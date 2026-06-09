import { formatCurrency, formatDate } from '../utils';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
        <p>No expenses found</p>
        <p style={{ fontSize: '0.85rem', marginTop: 6 }}>Add your first expense using the form.</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div className="expense-item" key={expense.id}>
          <span className="expense-date">{formatDate(expense.date)}</span>
          <div>
            <span className={`category-badge cat-${expense.category}`}>{expense.category}</span>
            {expense.note && <p className="expense-note">{expense.note}</p>}
          </div>
          <span className="expense-amount">{formatCurrency(expense.amount)}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            #{expense.id.slice(0, 6)}
          </span>
          <div className="actions">
            <button className="btn btn-ghost" onClick={() => onEdit(expense)} title="Edit">
              ✏️
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(expense)} title="Delete">
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
