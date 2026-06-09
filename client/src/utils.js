export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Bills: '#ec4899',
  Entertainment: '#8b5cf6',
  Other: '#6b7280',
};
