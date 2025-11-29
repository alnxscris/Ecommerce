import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json([
      { id: 1, name: 'Pizza Margherita', price: 25.9, stock: 10 },
      { id: 2, name: 'Pepperoni',        price: 28.5, stock: 7  },
    ]);
  }),

  http.post('/api/payments/qr', async ({ request }) => {
    const raw = await request.text();

    if (!raw || raw.trim() === '') {
      return new HttpResponse(JSON.stringify({ error: 'empty body' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    let body;
    try { body = JSON.parse(raw); }
    catch { 
      return new HttpResponse(JSON.stringify({ error: 'not json' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    if (typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount <= 0) {
      return new HttpResponse(JSON.stringify({ error: 'invalid amount' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    return HttpResponse.json({ status: 'APPROVED', qrId: 'TEST-123', amount: body.amount });
  }),
];
