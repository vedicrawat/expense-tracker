import BudgetPanel from './components/BudgetPanel';
import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { CATEGORIES } from './utils';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryPanel from './components/SummaryPanel';
import { EditModal, DeleteModal } from './components/Modals';



const RANGE_PRESETS = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Custom', value: 'custom' },
];

function getDateRange(preset) {
  const now = new Date();
  if (preset === 'this_month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    return { startDate: start, endDate: '' };
  }
  if (preset === 'last_month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    return { startDate: start, endDate: end };
  }
  return { startDate: '', endDate: '' };
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

useEffect(() => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}, [dark]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [rangePreset, setRangePreset] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { category: categoryFilter === 'All' ? '' : categoryFilter };
      if (rangePreset !== 'all' && rangePreset !== 'custom') {
        const range = getDateRange(rangePreset);
        if (range.startDate) params.startDate = range.startDate;
        if (range.endDate) params.endDate = range.endDate;
      } else if (rangePreset === 'custom') {
        if (customStart) params.startDate = customStart;
        if (customEnd) params.endDate = customEnd;
      }
      const [data, sum] = await Promise.all([api.getExpenses(params), api.getSummary()]);
      setExpenses(data);
      setSummary(sum);
    } catch {
      setError('Failed to load expenses. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, rangePreset, customStart, customEnd]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleAdd(form) {
    setFormLoading(true);
    setError('');
    try {
      await api.createExpense(form);
      await fetchData();
    } catch (err) {
      setError(err.errors ? err.errors.join(' ') : 'Failed to add expense.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleEdit(form) {
    setFormLoading(true);
    setError('');
    try {
      await api.updateExpense(editExpense.id, form);
      setEditExpense(null);
      await fetchData();
    } catch (err) {
      setError(err.errors ? err.errors.join(' ') : 'Failed to update expense.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete() {
    setFormLoading(true);
    try {
      await api.deleteExpense(deleteExpense.id);
      setDeleteExpense(null);
      await fetchData();
    } catch {
      setError('Failed to delete expense.');
    } finally {
      setFormLoading(false);
    }
  }

  function handleExport() {
    const params = { category: categoryFilter === 'All' ? '' : categoryFilter };
    if (rangePreset !== 'all' && rangePreset !== 'custom') {
      const range = getDateRange(rangePreset);
      if (range.startDate) params.startDate = range.startDate;
      if (range.endDate) params.endDate = range.endDate;
    } else if (rangePreset === 'custom') {
      if (customStart) params.startDate = customStart;
      if (customEnd) params.endDate = customEnd;
    }
    window.open(api.getExportUrl(params), '_blank');
  }

  return (
    <>
      <header className="header">
  <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <h1>💸 Expense Tracker</h1>
      <p>Track your daily spending across categories</p>
    </div>
    <button
      onClick={() => setDark(d => !d)}
      style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: '1.1rem' }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  </div>
</header>

      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="layout">
          {/* Left: Add form + Summary */}
          <aside>
            <div className="card">
              <p className="card-title">Add Expense</p>
              <ExpenseForm onSubmit={handleAdd} loading={formLoading} />
            </div>

            <div className="card">
                <p className="card-title">Summary</p>
                <SummaryPanel summary={summary} />
                <BudgetPanel perCategory={summary?.perCategory} />
            </div>
          </aside>

          {/* Right: Filters + List */}
          <main>
            {error && <div className="error-banner">{error}</div>}

            <div className="card">
              <div className="top-bar">
                <p className="card-title" style={{ marginBottom: 0 }}>Expenses</p>
                <button className="btn btn-success" onClick={handleExport} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  ⬇️ Export CSV
                </button>
              </div>

              {/* Category tabs */}
              <div className="tab-row">
                {['All', ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    className={`tab ${categoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Date range */}
              <div className="filters">
                {RANGE_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    className={`tab ${rangePreset === p.value ? 'active' : ''}`}
                    onClick={() => setRangePreset(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {rangePreset === 'custom' && (
                <div className="filters" style={{ marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>From</label>
                    <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>To</label>
                    <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
                  </div>
                </div>
              )}

              {loading ? (
                <div className="spinner" />
              ) : (
                <ExpenseList
                  expenses={expenses}
                  onEdit={setEditExpense}
                  onDelete={setDeleteExpense}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <EditModal
        expense={editExpense}
        onSubmit={handleEdit}
        onClose={() => setEditExpense(null)}
        loading={formLoading}
      />
      <DeleteModal
        expense={deleteExpense}
        onConfirm={handleDelete}
        onClose={() => setDeleteExpense(null)}
        loading={formLoading}
      />
    </>
  );
}
