import { useState } from 'react';

function slugifyFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .toLowerCase();
}

function formatFileToken(value: string) {
  return slugifyFileName(value)
    .split('_')
    .filter(Boolean)
    .map((segment) => (segment.length <= 3 && segment === segment.toUpperCase() ? segment : segment.charAt(0).toUpperCase() + segment.slice(1)))
    .join('_');
}

export function buildAutoFileName(fullName: string, jobTitle: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const titleParts = jobTitle.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0 || titleParts.length === 0) {
    return 'CV';
  }

  const firstName = parts[0];
  const surname = parts.length >= 4 ? parts[parts.length - 2] : (parts[1] || parts[0]);

  return `${formatFileToken(firstName)}_${formatFileToken(surname)}_${titleParts.map(formatFileToken).filter(Boolean).join('_')}_CV`;
}

export function useFileHandling(initialFileName: string) {
  const [fileName, setFileName] = useState(initialFileName);

  return {
    fileName,
    setFileName,
    buildAutoFileName,
    slugifyFileName
  };
}
