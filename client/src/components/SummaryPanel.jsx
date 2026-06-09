import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, CATEGORY_COLORS } from '../utils';

export default function SummaryPanel({ summary }) {
  if (!summary) return null;

  const { totalThisMonth, perCategory, highestExpense } = summary;

  const chartData = Object.entries(perCategory)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div>
      <div className="summary-grid">
        <div className="summary-stat">
          <div className="label">This Month</div>
          <div className="value">{formatCurrency(totalThisMonth)}</div>
        </div>
        <div className="summary-stat">
          <div className="label">Highest Expense</div>
          {highestExpense ? (
            <>
              <div className="value">{formatCurrency(highestExpense.amount)}</div>
              <div className="sub">{highestExpense.category} · {highestExpense.note || 'No note'}</div>
            </>
          ) : (
            <div className="value" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>—</div>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <p style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 8 }}>
        By Category
      </p>
      <ul className="cat-breakdown">
        {Object.entries(perCategory).map(([cat, amt]) => (
          <li key={cat}>
            <span className={`category-badge cat-${cat}`}>{cat}</span>
            <span style={{ fontWeight: amt > 0 ? 600 : 400 }}>{formatCurrency(amt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
