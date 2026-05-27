import type { ExperienceEntry } from '../types/cv';

function parseYears(value: string) {
  const normalized = value.replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseYearMonth(value: string) {
  const [yearText, monthText] = value.split('-');
  const year = Number.parseInt(yearText, 10);
  const month = Number.parseInt(monthText, 10);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null;
  }

  return new Date(year, month - 1, 1);
}

function mergeIntervals(intervals: Array<{ start: Date; end: Date }>) {
  const sorted = [...intervals].sort((left, right) => left.start.getTime() - right.start.getTime());
  const merged: Array<{ start: Date; end: Date }> = [];

  for (const interval of sorted) {
    const last = merged[merged.length - 1];
    if (!last || interval.start.getTime() > last.end.getTime()) {
      merged.push({ ...interval });
      continue;
    }

    if (interval.end.getTime() > last.end.getTime()) {
      last.end = interval.end;
    }
  }

  return merged;
}

export function estimateCandidateExperienceYears(experience: ExperienceEntry[]) {
  const today = new Date();
  const intervals = experience
    .map((item) => {
      const start = parseYearMonth(item.start_date);
      const end = parseYearMonth(item.end_date || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
      if (!start || !end) {
        return null;
      }
      return { start, end };
    })
    .filter((interval): interval is { start: Date; end: Date } => Boolean(interval));

  const merged = mergeIntervals(intervals);
  const months = merged.reduce((total, interval) => {
    const endYear = interval.end.getFullYear();
    const endMonth = interval.end.getMonth();
    const startYear = interval.start.getFullYear();
    const startMonth = interval.start.getMonth();
    return total + ((endYear - startYear) * 12 + (endMonth - startMonth) + 1);
  }, 0);

  return months / 12;
}

export function extractMinimumExperienceYears(jobDescText: string) {
  const patterns = [
    /(?:mínimo|minima|mínima|al menos|at least|minimum of?)\s*(\d+(?:[.,]\d+)?)\s*(?:años?|years?|yrs?)/i,
    /(\d+(?:[.,]\d+)?)\s*\+?\s*(?:años?|years?|yrs?)\s*(?:de|of)?\s*experiencia/i,
    /(?:experience|experiencia)\s*(?:of|de)?\s*(\d+(?:[.,]\d+)?)\s*(?:years?|años?|yrs?)/i
  ];

  for (const pattern of patterns) {
    const match = jobDescText.match(pattern);
    if (match?.[1]) {
      const years = parseYears(match[1]);
      if (years !== null) {
        return years;
      }
    }
  }

  return null;
}

export function buildExperienceBlockMessage(requiredYears: number, availableYears: number) {
  const formatYears = (value: number) => {
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded.toFixed(0)} años` : `${rounded.toFixed(1)} años`;
  };

  return `Alerta: la vacante pide al menos ${formatYears(requiredYears)} y la experiencia acumulada estimada es ${formatYears(availableYears)}. La IA evaluará si el perfil sigue siendo compatible.`;
}
