import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils';

const today = new Date().toISOString().split('T')[0];

const empty = { amount: '', category: '', date: today, note: '' };

export default function ExpenseForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial || empty);
    setErrors({});
  }, [initial]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errs.amount = 'Enter a positive amount.';
    if (!form.category) errs.category = 'Select a category.';
    if (!form.date) errs.date = 'Date is required.';
    else if (form.date > today) errs.date = 'Date cannot be in the future.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Amount (₹)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
        />
        {errors.amount && <p className="field-error">{errors.amount}</p>}
      </div>

      <div className="form-group">
        <label>Category</label>
        <select value={form.category} onChange={(e) => set('category', e.target.value)}>
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="field-error">{errors.category}</p>}
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          max={today}
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
        />
        {errors.date && <p className="field-error">{errors.date}</p>}
      </div>

      <div className="form-group">
        <label>Note (optional)</label>
        <textarea
          placeholder="What was this for?"
          value={form.note}
          onChange={(e) => set('note', e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Update Expense' : 'Add Expense'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
