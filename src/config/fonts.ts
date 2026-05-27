import type { CvFontId } from '../types/cv';

export interface CvFontDefinition {
  id: CvFontId;
  label: string;
  family: string;
  docxFamily: string;
}

export const cvFonts: CvFontDefinition[] = [
  {
    id: 'serif',
    label: 'Classic Serif',
    family: "'Merriweather', 'Times New Roman', serif",
    docxFamily: 'Merriweather'
  },
  {
    id: 'sans',
    label: 'Modern Sans',
    family: "Roboto, Arial, sans-serif",
    docxFamily: 'Roboto'
  },
  {
    id: 'ats',
    label: 'ATS Readable',
    family: "Arial, Helvetica, sans-serif",
    docxFamily: 'Arial'
  }
];

export function getCvFont(fontId: CvFontId): CvFontDefinition {
  return cvFonts.find((font) => font.id === fontId) ?? cvFonts[0];
}
