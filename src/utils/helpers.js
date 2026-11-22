export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const levelFromPoints = (points) => Math.floor(points / 100) + 1;
export const levelProgress = (points) => (points % 100) / 100;

export function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// "term = definition" per line -> [{ term, definition }]
export function parseTerms(text) {
  return text
    .split('\n')
    .map((line) => line.split('='))
    .filter((p) => p.length >= 2 && p[0].trim() && p.slice(1).join('=').trim())
    .map((p) => ({ term: p[0].trim(), definition: p.slice(1).join('=').trim() }));
}
