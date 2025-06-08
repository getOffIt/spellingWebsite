export type ProgressData = Record<string, any>;

const API_BASE = 'https://api.spellingninjas.com/api/progress';

export async function getAllProgress(token: string): Promise<ProgressData> {
  const res = await fetch(API_BASE, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch progress: ${res.status}`);
  }
  return await res.json();
}

export async function putWordProgress(token: string, wordId: string, progress: any): Promise<any> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(wordId)}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ progress }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update progress: ${res.status}`);
  }
  return await res.json();
} 