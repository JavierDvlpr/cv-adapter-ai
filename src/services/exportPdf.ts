import { escapeHtml } from '../utils/json';
import { getCvFont } from '../config/fonts';
import type { CvFontId, SectionCaseId } from '../types/cv';

interface ExportPdfParams {
  html: string;
  title: string;
  fontId: CvFontId;
  sectionCase: SectionCaseId;
}

export function downloadCvPdf({ html, title, fontId, sectionCase }: ExportPdfParams): void {
  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    throw new Error('No se pudo abrir la ventana de impresión');
  }

  const safeTitle = escapeHtml(title || 'Javier_Castillo_CV');
  const fontFamily = getCvFont(fontId).family;
  const sectionTransform = sectionCase === 'uppercase' ? 'uppercase' : 'capitalize';

  previewWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>${safeTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: letter; margin: 0.5in; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${fontFamily}; color: #111; font-size: 10.5pt; line-height: 1.42; }
    .cv-name { font-size: 19pt; font-weight: 700; text-align: center; letter-spacing: 0.02em; margin-bottom: 3px; }
    .cv-subtitle { text-align: center; font-size: 10.5pt; font-style: italic; color: #444; margin-bottom: 5px; }
    .cv-contact { text-align: center; font-size: 9pt; color: #555; margin-bottom: 2px; }
    .cv-contact a { color: #333; text-decoration: none; }
    .cv-hr { border: none; border-top: 1.5px solid #111; margin: 9px 0 12px; }
    .cv-section { font-size: 10pt; font-weight: 700; text-transform: ${sectionTransform}; letter-spacing: 0.08em; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 15px 0 7px; }
    .cv-job-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 9px; margin-bottom: 1px; }
    .cv-job-title { font-weight: 700; font-size: 10pt; }
    .cv-job-co { font-style: italic; font-weight: 400; }
    .cv-job-date { font-size: 9pt; color: #666; }
    .cv-job-loc { font-size: 9pt; color: #777; font-style: italic; margin-bottom: 3px; }
    .cv-bullets { margin: 3px 0 5px 16px; }
    .cv-bullets li { font-size: 10pt; margin-bottom: 2px; }
    .cv-profile { font-size: 10.5pt; text-align: justify; }
    .cv-skill-row { font-size: 10pt; margin-bottom: 2px; }
    .cv-edu-row { display: flex; justify-content: space-between; margin-bottom: 1px; }
    .cv-edu-name { font-weight: 700; font-size: 10pt; }
    .cv-edu-inst { font-style: italic; font-size: 9.5pt; color: #555; }
    .cv-cert { margin: 3px 0 0 16px; }
    .cv-cert li { font-size: 10pt; margin-bottom: 1px; }
    .cv-proj-row { display: flex; justify-content: space-between; margin-top: 8px; }
    .cv-proj-name { font-weight: 700; font-size: 10pt; }
    .cv-proj-tech { font-size: 9pt; color: #777; font-style: italic; }
    .cv-proj-desc { font-size: 10pt; margin-bottom: 4px; }
  </style></head><body>${html}</body></html>`);
  previewWindow.document.close();

  setTimeout(() => {
    previewWindow.focus();
    previewWindow.print();
    previewWindow.close();
  }, 800);
}
