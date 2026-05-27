export function stripCodeFences(content: string): string {
  return content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
}

export function safeParseJson<T>(content: string): T {
  const clean = stripCodeFences(content);
  return JSON.parse(clean) as T;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
