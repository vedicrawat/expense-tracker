<<<<<<< HEAD
# Expense Tracker

A full-stack expense tracking application built with Node.js + Express (backend) and React + Vite (frontend). This is my submission for **Exercise 2: Mini Expense Tracker** from the Studio Graphene Full Stack Developer Assessment.

Users can log daily spending across categories, filter by date and category, view a summary panel with a pie chart, and export their data as CSV.

---

## Live Demo

> Add your deployed links here after deployment.
> - **Frontend:** https://your-app.vercel.app
> - **Backend:** https://your-api.railway.app

---

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Backend | Node.js + Express | Lightweight, well-understood REST framework |
| Storage | In-memory array + JSON file | Simple persistence without a DB setup; survives server restarts |
| Frontend | React + Vite | Fast dev server, functional components with hooks |
| Charts | Recharts | Composable, React-native charting library |
| Styling | Plain CSS (custom) | Full control, no build-time overhead |
| Testing | Jest + Supertest | Meaningful integration tests on the API layer |

---

## How to Run Locally

Assumes you have **Node.js 18+** installed.

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker

# 2. Install and start the backend
cd server
npm install
npm run dev        # runs on http://localhost:4000

# 3. In a new terminal, install and start the frontend
cd ../client
npm install
npm run dev        # runs on http://localhost:5173
```

Open http://localhost:5173 in your browser.

**Environment variables (optional):**
```bash
# client/.env (copy from .env.example)
VITE_API_URL=http://localhost:4000/api
```

**Run backend tests:**
```bash
cd server
npm test
```

---

## API Documentation

Base URL: `http://localhost:4000/api`

### GET /expenses
Returns a filtered list of expenses sorted by date (newest first).

Query params:
- `category` — one of `Food | Transport | Bills | Entertainment | Other`
- `startDate` — ISO date string e.g. `2025-06-01`
- `endDate` — ISO date string

Response: `200 OK`
```json
[
  {
    "id": "uuid",
    "amount": 250,
    "category": "Food",
    "date": "2025-06-01",
    "note": "Lunch",
    "createdAt": "2025-06-01T10:00:00.000Z"
  }
]
```

### GET /expenses/summary
Returns aggregated stats for the current month.

Response: `200 OK`
```json
{
  "totalThisMonth": 3200,
  "perCategory": {
    "Food": 1200,
    "Transport": 800,
    "Bills": 1000,
    "Entertainment": 200,
    "Other": 0
  },
  "highestExpense": { ...expense object }
}
```

### GET /expenses/export
Returns current filtered expenses as a CSV file download.
Accepts the same query params as `GET /expenses`.

### GET /expenses/:id
Response: `200 OK` — expense object, or `404` if not found.

### POST /expenses
Body:
```json
{
  "amount": 250,
  "category": "Food",
  "date": "2025-06-01",
  "note": "Optional"
}
```
Response: `201 Created` — created expense, or `400` with `{ errors: [...] }`.

### PUT /expenses/:id
Body: same shape as POST.
Response: `200 OK` — updated expense, or `400 / 404`.

### DELETE /expenses/:id
Response: `204 No Content`, or `404`.

---

## Project Structure

```
expense-tracker/
├── package.json              # Root scripts
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── main.jsx          # Entry point
│   │   ├── App.jsx           # Root component, state management
│   │   ├── api.js            # Fetch wrapper for all API calls
│   │   ├── utils.js          # Currency formatting, constants
│   │   ├── index.css         # Global styles
│   │   └── components/
│   │       ├── ExpenseForm.jsx    # Add / edit form with validation
│   │       ├── ExpenseList.jsx    # Expense rows + empty state
│   │       ├── SummaryPanel.jsx   # Stats + pie chart
│   │       └── Modals.jsx         # Edit and delete confirmation modals
│   └── .env.example
└── server/
    ├── src/
    │   ├── index.js           # Express app setup
    │   ├── store.js           # In-memory store + JSON file persistence
    │   └── routes/
    │       └── expenses.js    # All expense endpoints + validation
    ├── data/
    │   └── expenses.json      # Auto-created on first write
    └── tests/
        └── expenses.test.js   # 9 integration tests via Supertest
```

---

## Next Steps

Things I chose not to build given the time constraint, in priority order:

1. **Authentication** — even a simple session/token would let multiple users track separately.
2. **Budget per category** — a monthly budget limit with a visual warning bar when nearing the limit.
3. **Drag-and-drop reordering** — would use `@dnd-kit/core`.
4. **PostgreSQL / Prisma** — JSON file is fine for the assessment but wouldn't scale.
5. **More chart types** — a monthly bar chart of spending over time would give useful trend visibility.
6. **Debounced search** — filtering as-you-type by note text.

---

## Notes on AI Usage

I used Claude (Anthropic) to assist with scaffolding this project. All code has been reviewed, understood, and can be explained line-by-line in the follow-up interview.
=======
# expense-tracker
>>>>>>> f172f5cd899ea253100270ba486a5fc64f9ab176
