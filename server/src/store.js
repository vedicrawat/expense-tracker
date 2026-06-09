const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/expenses.json');

// Ensure data directory and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

let expenses = [];

// Load from file on startup
function loadFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      expenses = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not load expenses from file, starting fresh.', err.message);
    expenses = [];
  }
}

function saveToFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
  } catch (err) {
    console.error('Failed to persist expenses:', err.message);
  }
}

loadFromFile();

function getAll() {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getById(id) {
  return expenses.find((e) => e.id === id) || null;
}

function create(expense) {
  expenses.push(expense);
  saveToFile();
  return expense;
}

function update(id, updates) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;
  expenses[index] = { ...expenses[index], ...updates };
  saveToFile();
  return expenses[index];
}

function remove(id) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  saveToFile();
  return true;
}

module.exports = { getAll, getById, create, update, remove };
