import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createOrderHandler } from '../api/order.js';
import { products, shippingFor } from '../src/data/products.ts';
import { normalizePhone } from '../src/lib/order.ts';

const p = products[0];
const payload = () => ({
  customer: {
    name: 'Test Shopper',
    phone: '0300 1234567',
    email: '',
    address: 'Test house, example street',
    city: 'Lahore',
    notes: '',
  },
  items: [
    {
      productId: p.id,
      name: p.name,
      qty: 1,
      unitPrice: p.price,
      size: p.sizes[0],
      color: p.colors[0].name,
    },
  ],
  subtotal: p.price,
  shipping: shippingFor(p.price),
  total: p.price + shippingFor(p.price),
  timestamp: new Date().toISOString(),
  requestId: randomUUID(),
  paymentMethod: 'Cash on Delivery',
  website: '',
});
// Synthetic settings and an in-memory mail transport are confined to tests.
const settings = {
  RESEND_API_KEY: 'test-only',
  ORDER_TO_EMAIL: 'owner@example.test',
  ORDER_FROM_EMAIL: 'store@example.test',
};
async function invoke(body, options = {}) {
  const mail = [];
  const handler = createOrderHandler({
    env: options.env || settings,
    deliver:
      options.deliver ||
      (async (message, opts) => {
        mail.push({ message, opts });
        return { data: { id: 'test-message' }, error: null };
      }),
  });
  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    ...options.req,
  };
  const result = { code: 0, headers: {}, json: null, mail };
  const res = {
    setHeader(k, v) {
      result.headers[k] = v;
    },
    status(n) {
      result.code = n;
      return this;
    },
    json(v) {
      result.json = v;
      return this;
    },
  };
  await handler(req, res);
  return result;
}

test('valid COD order is emailed, returns an authoritative receipt, and does not expose customer details', async () => {
  const data = payload();
  const r = await invoke(data);
  assert.equal(r.code, 201);
  assert.match(r.json.orderNumber, /^ZL-[0-9A-F]{8}$/);
  assert.equal(r.json.total, 1050);
  assert.equal(r.json.customer, undefined);
  assert.equal(r.mail.length, 1);
  assert.equal(r.mail[0].message.to[0], settings.ORDER_TO_EMAIL);
  assert.equal(r.mail[0].message.from, settings.ORDER_FROM_EMAIL);
  assert.match(r.mail[0].message.html, /Cash on Delivery/);
  assert.match(r.mail[0].message.text, /\+923001234567/);
  const retry = await invoke(data);
  assert.equal(retry.json.orderNumber, r.json.orderNumber);
  assert.equal(retry.mail[0].opts.idempotencyKey, r.mail[0].opts.idempotencyKey);
});

test('free shipping is applied at and above the configured threshold', async () => {
  assert.equal(shippingFor(1999), 200);
  assert.equal(shippingFor(2000), 0);
  assert.equal(shippingFor(0), 0);
  const data = payload();
  data.items[0].qty = 3;
  data.subtotal = data.total = 2550;
  data.shipping = 0;
  assert.equal((await invoke(data)).code, 201);
});

test('customer text is normalized and safely escaped in the HTML email', async () => {
  const data = payload();
  data.customer.notes = ' Please   use <gate A> & call. ';
  data.customer.email = 'shopper@example.test';
  const r = await invoke(data);
  assert.equal(r.code, 201);
  assert.match(r.mail[0].message.html, /Please use &lt;gate A&gt; &amp; call/);
  assert.equal(r.mail[0].message.replyTo, data.customer.email);
});

for (const [name, mutate, status] of [
  [
    'honeypot',
    (b) => {
      b.website = 'filled';
    },
    400,
  ],
  [
    'empty cart',
    (b) => {
      b.items = [];
    },
    400,
  ],
  [
    'unknown product',
    (b) => {
      b.items[0].productId = 'unavailable';
    },
    409,
  ],
  [
    'changed unit price',
    (b) => {
      b.items[0].unitPrice = 1;
    },
    409,
  ],
  [
    'changed total',
    (b) => {
      b.total = 1;
    },
    409,
  ],
  [
    'invalid shipping',
    (b) => {
      b.shipping = 0;
    },
    409,
  ],
  [
    'fractional quantity',
    (b) => {
      b.items[0].qty = 1.5;
    },
    400,
  ],
  [
    'excess quantity',
    (b) => {
      b.items[0].qty = 100;
    },
    400,
  ],
  [
    'invalid variant',
    (b) => {
      b.items[0].size = 'unavailable';
    },
    400,
  ],
  [
    'duplicate variant',
    (b) => {
      b.items.push({ ...b.items[0] });
    },
    400,
  ],
  [
    'invalid phone',
    (b) => {
      b.customer.phone = '12345';
    },
    400,
  ],
  [
    'invalid email',
    (b) => {
      b.customer.email = 'not-an-email';
    },
    400,
  ],
  [
    'missing name',
    (b) => {
      b.customer.name = '';
    },
    400,
  ],
  [
    'short address',
    (b) => {
      b.customer.address = 'short';
    },
    400,
  ],
  [
    'invalid notes',
    (b) => {
      b.customer.notes = 'a'.repeat(1001);
    },
    400,
  ],
  [
    'invalid city',
    (b) => {
      b.customer.city = {};
    },
    400,
  ],
  [
    'invalid payment',
    (b) => {
      b.paymentMethod = 'card';
    },
    400,
  ],
  [
    'invalid timestamp',
    (b) => {
      b.timestamp = 'invalid';
    },
    400,
  ],
])
  test(`rejects ${name} without sending a notification`, async () => {
    const b = payload();
    mutate(b);
    const r = await invoke(b);
    assert.equal(r.code, status);
    assert.equal(r.mail.length, 0);
  });

test('requires JSON POST, with bounded body size', async () => {
  assert.equal((await invoke(payload(), { req: { method: 'GET' } })).code, 405);
  assert.equal(
    (await invoke(payload(), { req: { headers: { 'content-type': 'text/plain' } } })).code,
    415,
  );
  assert.equal((await invoke('{bad json')).code, 400);
  assert.equal((await invoke('x'.repeat(33000))).code, 413);
});
test('an unconfigured or unavailable mail service never returns false success', async () => {
  assert.equal((await invoke(payload(), { env: {} })).code, 503);
  assert.equal(
    (await invoke(payload(), { deliver: async () => ({ error: { statusCode: 400 } }) })).code,
    502,
  );
  assert.equal(
    (await invoke(payload(), { deliver: async () => ({ error: { statusCode: 429 } }) })).code,
    429,
  );
  assert.equal(
    (
      await invoke(payload(), {
        deliver: async () => {
          throw new Error('Unavailable');
        },
      })
    ).code,
    502,
  );
});
test('Pakistani mobile formats normalize consistently', () => {
  for (const phone of ['03001234567', '+92 300 1234567', '0092-300-1234567', '923001234567'])
    assert.equal(normalizePhone(phone), '+923001234567');
  for (const phone of ['0300123456', '+1 300 1234567', 'letters', '030012345678'])
    assert.equal(normalizePhone(phone), '');
});
