const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export const api = {
  getExpenses: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/expenses${qs ? '?' + qs : ''}`);
  },
  getSummary: () => request('/expenses/summary'),
  createExpense: (body) => request('/expenses', { method: 'POST', body: JSON.stringify(body) }),
  updateExpense: (id, body) => request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
  getExportUrl: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return `${BASE}/expenses/export${qs ? '?' + qs : ''}`;
  },
};
