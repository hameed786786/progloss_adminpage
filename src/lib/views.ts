export function saveView(key: string, name: string, data: any) {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ name, data, created: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    // ignore storage errors
    console.error('saveView error', e);
  }
}

export function getViews(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

export default { saveView, getViews };
