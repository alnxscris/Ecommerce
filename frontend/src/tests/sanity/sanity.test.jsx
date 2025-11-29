import { render, screen } from '@testing-library/react';

describe('Sanity', () => {
  it('renderiza en JSDOM y aserciones de jest-dom funcionan', () => {
    render(<button>Agregar</button>);
    expect(screen.getByRole('button', { name: /agregar/i })).toBeInTheDocument();
  });

  it('MSW mockea /api/products correctamente', async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('name', 'Pizza Margherita');
  });

  it('MSW valida POST /api/payments/qr', async () => {
    const ok = await fetch('/api/payments/qr', {
      method: 'POST',
      body: JSON.stringify({ amount: 50 }),
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json());
    expect(ok.status).toBe('APPROVED');

    const bad = await fetch('/api/payments/qr', {
      method: 'POST',
      body: JSON.stringify({ amount: 0 }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(bad.status).toBe(400);
  });
});
