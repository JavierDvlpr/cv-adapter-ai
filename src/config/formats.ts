import type { CvFormatId } from '../types/cv';

export interface CvFormatDefinition {
  id: CvFormatId;
  label: string;
  description: string;
}

export const cvFormats: CvFormatDefinition[] = [
  {
    id: 'harvard',
    label: 'Harvard',
    description: 'Clásico y optimizado para lectura humana y ATS.'
  }
];

export function getCvFormat(formatId: CvFormatId): CvFormatDefinition {
  return cvFormats.find((format) => format.id === formatId) ?? cvFormats[0];
}
