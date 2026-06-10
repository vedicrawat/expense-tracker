# Expense Tracker

A full-stack expense tracking application built with Node.js + Express (backend) and React + Vite (frontend). This is my submission for **Exercise 2: Mini Expense Tracker** from the Studio Graphene Full Stack Developer Assessment.

Users can log daily spending across categories, filter by date and category, view a summary panel with a pie chart, set monthly budgets per category, and export data as CSV.

---

## Live Demo

- **Frontend:** https://expense-tracker-beta-red-43.vercel.app/
- **Backend:** https://creative-truth-port.up.railway.app/

---

## Screenshots

![Dashboard](https://github.com/user-attachments/assets/1695a2ea-f75d-4e0a-980b-554b91e3e161)

<br/>

![Dark Mode](https://github.com/user-attachments/assets/eac37326-bc0b-4b57-ba96-52d567218991)

<br/>

![Budget Panel](https://github.com/user-attachments/assets/44ec7841-6e3c-4f95-a2a5-5109853dc4b7)



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


# 1. Clone the repo
git clone https://github.com/vedicrawat/expense-tracker.git
cd expense-tracker

# 2. Install and start the backend
cd server
npm install
npm run dev        # runs on http://localhost:4000

# 3. In a new terminal, install and start the frontend
cd ../client
npm install
npm run dev        # runs on http://localhost:5173


Open http://localhost:5173 in your browser.

**Environment variables (optional):**

# client/.env (copy from .env.example)
VITE_API_URL=http://localhost:4000/api


**Run backend tests:**

cd server
npm test




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
  "highestExpense": { "...expense object" }
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
│   │       ├── BudgetPanel.jsx    # Monthly budgets with progress bars
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

1. **Authentication** — session/token to support multiple users
2. **PostgreSQL / Prisma** — JSON file works but wouldn't scale
3. **More chart types** — monthly bar chart for spending trends over time
4. **Debounced search** — filter expenses by note text as you type
5. **Drag-and-drop reordering** — using `@dnd-kit/core`

---

## Notes on AI Usage

I used Claude (Anthropic) to assist with scaffolding this project. All code has been reviewed, understood, and can be explained line-by-line in the follow-up interview.
```
