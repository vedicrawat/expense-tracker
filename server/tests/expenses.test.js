const request = require('supertest');
const app = require('../src/index');

describe('Expense API', () => {
  let createdId;

  it('POST /api/expenses — creates a valid expense', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 250,
      category: 'Food',
      date: '2025-06-01',
      note: 'Lunch',
    });
    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(250);
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  it('POST /api/expenses — rejects negative amount', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: -100,
      category: 'Food',
      date: '2025-06-01',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Amount must be a positive number.');
  });

  it('POST /api/expenses — rejects future date', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 100,
      category: 'Food',
      date: '2099-01-01',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Date cannot be in the future.');
  });

  it('POST /api/expenses — rejects missing category', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 100,
      date: '2025-06-01',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Category is required.');
  });

  it('GET /api/expenses — returns list', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/expenses/:id — updates an expense', async () => {
    const res = await request(app).put(`/api/expenses/${createdId}`).send({
      amount: 300,
      category: 'Food',
      date: '2025-06-01',
      note: 'Updated lunch',
    });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(300);
  });

  it('DELETE /api/expenses/:id — deletes an expense', async () => {
    const res = await request(app).delete(`/api/expenses/${createdId}`);
    expect(res.status).toBe(204);
  });

  it('GET /api/expenses/:id — 404 for missing', async () => {
    const res = await request(app).get('/api/expenses/nonexistent-id');
    expect(res.status).toBe(404);
  });

  it('GET /api/expenses/summary — returns summary shape', async () => {
    const res = await request(app).get('/api/expenses/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalThisMonth');
    expect(res.body).toHaveProperty('perCategory');
  });
});
