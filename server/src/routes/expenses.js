const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

const router = express.Router();

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

// --- Validation helper ---
function validateExpense(body) {
  const errors = [];
  const { amount, category, date } = body;

  if (amount === undefined || amount === null || amount === '') {
    errors.push('Amount is required.');
  } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push('Amount must be a positive number.');
  }

  if (!category) {
    errors.push('Category is required.');
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`);
  }

  if (!date) {
    errors.push('Date is required.');
  } else {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(inputDate.getTime())) {
      errors.push('Date is invalid.');
    } else if (inputDate > today) {
      errors.push('Date cannot be in the future.');
    }
  }

  return errors;
}

// GET /api/expenses — list with optional filters
// Query params: category, startDate, endDate
router.get('/', (req, res) => {
  let expenses = store.getAll();
  const { category, startDate, endDate } = req.query;

  if (category && category !== 'All') {
    expenses = expenses.filter((e) => e.category === category);
  }

  if (startDate) {
    const start = new Date(startDate);
    expenses = expenses.filter((e) => new Date(e.date) >= start);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    expenses = expenses.filter((e) => new Date(e.date) <= end);
  }

  res.json(expenses);
});

// GET /api/expenses/summary — aggregated stats for current month
router.get('/summary', (req, res) => {
  const all = store.getAll();
  const now = new Date();
  const thisMonth = all.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const perCategory = VALID_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = thisMonth
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {});

  const highestExpense = all.length
    ? all.reduce((max, e) => (e.amount > max.amount ? e : max), all[0])
    : null;

  res.json({ totalThisMonth, perCategory, highestExpense });
});

// GET /api/expenses/export — CSV download
router.get('/export', (req, res) => {
  const { category, startDate, endDate } = req.query;
  let expenses = store.getAll();

  if (category && category !== 'All') {
    expenses = expenses.filter((e) => e.category === category);
  }
  if (startDate) {
    expenses = expenses.filter((e) => new Date(e.date) >= new Date(startDate));
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    expenses = expenses.filter((e) => new Date(e.date) <= end);
  }

  const header = 'id,amount,category,date,note';
  const rows = expenses.map(
    (e) => `${e.id},${e.amount},${e.category},${e.date},"${(e.note || '').replace(/"/g, '""')}"`
  );
  const csv = [header, ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
  res.send(csv);
});

// GET /api/expenses/:id
router.get('/:id', (req, res) => {
  const expense = store.getById(req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found.' });
  res.json(expense);
});

// POST /api/expenses
router.post('/', (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { amount, category, date, note } = req.body;
  const expense = {
    id: uuidv4(),
    amount: Number(amount),
    category,
    date,
    note: note || '',
    createdAt: new Date().toISOString(),
  };

  const created = store.create(expense);
  res.status(201).json(created);
});

// PUT /api/expenses/:id
router.put('/:id', (req, res) => {
  const existing = store.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Expense not found.' });

  const errors = validateExpense(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { amount, category, date, note } = req.body;
  const updated = store.update(req.params.id, {
    amount: Number(amount),
    category,
    date,
    note: note || '',
  });

  res.json(updated);
});

// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Expense not found.' });
  res.status(204).send();
});

module.exports = router;
