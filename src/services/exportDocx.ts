import { saveAs } from 'file-saver';
import { AlignmentType, BorderStyle, Document, ExternalHyperlink, LevelFormat, Packer, Paragraph, TabStopType, TextRun } from 'docx';
import { getCvFont } from '../config/fonts';
import type { CvAdaptationResult, CvFontId, EducationEntry, Language, LinkState, Profile, SectionCaseId } from '../types/cv';

interface ExportDocxParams {
  cv: CvAdaptationResult;
  fileName: string;
  lang: Language;
  fontId: CvFontId;
  sectionCase: SectionCaseId;
  profile: Profile;
  education: EducationEntry[];
  links: LinkState;
}

function formatSectionTitle(title: string, sectionCase: SectionCaseId): string {
  return sectionCase === 'uppercase' ? title.toUpperCase() : title;
}

export async function downloadCvDocx({ cv, fileName, lang, fontId, sectionCase, profile, education, links }: ExportDocxParams): Promise<void> {
  const font = getCvFont(fontId).docxFamily;
  const columnWidth = 9360;
  const toVisibleUrl = (url: string) => url.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const rule = () => new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '111111', space: 1 } },
    spacing: { before: 0, after: 120 },
    children: []
  });

  const sectionTitle = (title: string) => new Paragraph({
    spacing: { before: 180, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '111111', space: 4 } },
    children: [new TextRun({ text: formatSectionTitle(title, sectionCase), bold: true, size: 20, font })]
  });

  const link = (label: string, url: string) => new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text: label, size: 18, font, color: '333333', underline: { type: 'single', color: '999999' } })]
  });

  const separator = () => new TextRun({ text: ' · ', size: 18, font, color: '888888' });
  const bullet = (text: string) => new Paragraph({
    numbering: { reference: 'bullet-list', level: 0 },
    spacing: { before: 28, after: 28 },
    children: [new TextRun({ text, size: 20, font })]
  });
  const small = (text: string, italic = false) => new Paragraph({
    spacing: { before: 0, after: 50 },
    children: [new TextRun({ text, size: 18, font, italics: italic, color: '666666' })]
  });

  const contactParts = [] as Array<TextRun | ExternalHyperlink>;
  if (links.email) {
    contactParts.push(link(profile.email, `mailto:${profile.email}`));
    contactParts.push(separator());
  }
  if (links.phone) {
    contactParts.push(new TextRun({ text: profile.phone, size: 18, font, color: '555555' }));
    contactParts.push(separator());
  }
  contactParts.push(new TextRun({ text: profile.location, size: 18, font, color: '555555' }));
  if (links.linkedin) {
    contactParts.push(separator());
    contactParts.push(link(toVisibleUrl(profile.linkedin.url), profile.linkedin.url));
  }
  if (links.github) {
    contactParts.push(separator());
    contactParts.push(link(toVisibleUrl(profile.github.url), profile.github.url));
  }
  if (links.portfolio) {
    contactParts.push(separator());
    contactParts.push(link(toVisibleUrl(profile.portfolio.url), profile.portfolio.url));
  }

  const localize = lang === 'en';
  const sectionLabels = {
    profile: localize ? 'Professional Profile' : 'Perfil Profesional',
    exp: localize ? 'Professional Experience' : 'Experiencia Profesional',
    proj: localize ? 'Key Projects' : 'Proyectos Destacados',
    skills: localize ? 'Technical Skills' : 'Habilidades Técnicas',
    edu: localize ? 'Education' : 'Educación',
    cert: localize ? 'Certifications' : 'Certificaciones',
    lang: localize ? 'Languages' : 'Idiomas'
  };

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: profile.name, bold: true, size: 28, font })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 50 },
      children: [new TextRun({ text: cv.jobTitle, italics: true, size: 21, font, color: '444444' })]
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: contactParts }),
    rule(),
    sectionTitle(sectionLabels.profile),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: cv.profile, size: 21, font })]
    }),
    sectionTitle(sectionLabels.exp),
    ...(cv.experience || []).flatMap((item) => [
      new Paragraph({
        spacing: { before: 120, after: 20 },
        tabStops: [{ type: TabStopType.RIGHT, position: columnWidth }],
        children: [
          new TextRun({ text: `${item.title}${item.isPracticas ? ' (Contrato de prácticas)' : ''}`, bold: true, size: 21, font }),
          new TextRun({ text: ` · ${item.company}`, italics: true, size: 20, font }),
          new TextRun({ text: `\t${item.period}`, size: 19, font, color: '666666' })
        ]
      }),
      small(item.location, true),
      ...(item.bullets || []).map((entry) => bullet(entry))
    ]),
    ...(cv.projects?.length ? [
      sectionTitle(sectionLabels.proj),
      ...(cv.projects || []).flatMap((project) => [
        new Paragraph({
          spacing: { before: 100, after: 20 },
          tabStops: [{ type: TabStopType.RIGHT, position: columnWidth }],
          children: [
            new TextRun({ text: project.name, bold: true, size: 21, font }),
            new TextRun({ text: `\t${project.period}`, size: 19, font, color: '666666' })
          ]
        }),
        small(project.tech),
        new Paragraph({ spacing: { before: 0, after: 50 }, children: [new TextRun({ text: project.desc, size: 20, font })] })
      ])
    ] : []),
    sectionTitle(sectionLabels.skills),
    ...Object.entries(cv.skills || {}).map(([category, value]) => new Paragraph({
      spacing: { before: 36, after: 36 },
      children: [
        new TextRun({ text: `${category}: `, bold: true, size: 20, font }),
        new TextRun({ text: value, size: 20, font })
      ]
    })),
    sectionTitle(sectionLabels.edu),
    ...(cv.educationOrder || [0, 1]).flatMap((index) => {
      const item = education[index];
      if (!item) {
        return [];
      }
      return [
        new Paragraph({
          spacing: { before: 90, after: 18 },
          tabStops: [{ type: TabStopType.RIGHT, position: columnWidth }],
          children: [
            new TextRun({ text: item.degree, bold: true, size: 21, font }),
            new TextRun({ text: `\t${item.period}`, size: 19, font, color: '666666' })
          ]
        }),
        small(`${item.institution} · ${item.location}`, true)
      ];
    }),
    sectionTitle(sectionLabels.cert),
    ...(cv.certifications || []).map((item) => bullet(item)),
    sectionTitle(sectionLabels.lang),
    new Paragraph({
      spacing: { before: 50 },
      children: [
        new TextRun({ text: 'Español: ', bold: true, size: 20, font }),
        new TextRun({ text: 'Nativo    ', size: 20, font }),
        new TextRun({ text: 'Inglés: ', bold: true, size: 20, font }),
        new TextRun({ text: 'B1 – Intermedio', size: 20, font })
      ]
    })
  ];

  const document = new Document({
    numbering: {
      config: [
        {
          reference: 'bullet-list',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 480, hanging: 300 } } }
            }
          ]
        }
      ]
    },
    styles: { default: { document: { run: { font, size: 20 } } } },
    sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children }]
  });

  const blob = await Packer.toBlob(document);
  saveAs(blob, `${fileName || 'Javier_Castillo_CV'}.docx`);
}
