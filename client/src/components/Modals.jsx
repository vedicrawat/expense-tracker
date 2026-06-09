import ExpenseForm from './ExpenseForm';

export function EditModal({ expense, onSubmit, onClose, loading }) {
  if (!expense) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Expense</h2>
        <ExpenseForm
          initial={{
            amount: String(expense.amount),
            category: expense.category,
            date: expense.date,
            note: expense.note || '',
          }}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </div>
  );
}

export function DeleteModal({ expense, onConfirm, onClose, loading }) {
  if (!expense) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Expense?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          This will permanently delete <strong>₹{expense.amount}</strong> on{' '}
          <strong>{expense.category}</strong>
          {expense.note ? ` (${expense.note})` : ''}.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
