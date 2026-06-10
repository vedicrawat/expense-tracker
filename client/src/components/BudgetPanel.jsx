import { useState } from 'react';
import { CATEGORIES, formatCurrency, CATEGORY_COLORS } from '../utils';

const DEFAULT_BUDGETS = CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});

function loadBudgets() {
  try {
    return JSON.parse(localStorage.getItem('budgets')) || DEFAULT_BUDGETS;
  } catch {
    return DEFAULT_BUDGETS;
  }
}

export default function BudgetPanel({ perCategory }) {
  const [budgets, setBudgets] = useState(loadBudgets);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(loadBudgets);

  function saveBudgets() {
    setBudgets(draft);
    localStorage.setItem('budgets', JSON.stringify(draft));
    setEditing(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
          Monthly Budgets
        </p>
        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => editing ? saveBudgets() : setEditing(true)}>
          {editing ? '💾 Save' : '✏️ Edit'}
        </button>
      </div>

      {CATEGORIES.map((cat) => {
        const budget = budgets[cat] || 0;
        const spent = perCategory?.[cat] || 0;
        const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
        const over = budget > 0 && spent > budget;
        const warn = budget > 0 && pct >= 80 && !over;

        const barColor = over ? '#dc2626' : warn ? '#d97706' : CATEGORY_COLORS[cat];

        return (
          <div key={cat} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
              <span className={`category-badge cat-${cat}`}>{cat}</span>
              <span style={{ fontSize: '0.8rem', color: over ? 'var(--danger)' : 'var(--text-muted)', fontWeight: over ? 700 : 400 }}>
                {formatCurrency(spent)} {budget > 0 ? `/ ${formatCurrency(budget)}` : '(no limit)'}
                {over && ' ⚠️'}
              </span>
            </div>

            {editing ? (
              <input
                type="number"
                min="0"
                placeholder="Set budget (0 = no limit)"
                value={draft[cat] || ''}
                onChange={(e) => setDraft(d => ({ ...d, [cat]: Number(e.target.value) }))}
                style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.85rem', background: 'var(--bg)', color: 'var(--text)' }}
              />
            ) : (
              <div style={{ background: 'var(--border)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: barColor,
                  borderRadius: 999,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
