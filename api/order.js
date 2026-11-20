import { createHmac } from 'node:crypto';
import { Resend } from 'resend';
import { OrderError, validateOrder } from '../src/lib/order.ts';
import { orderMessages as m } from '../src/data/content.ts';
import { buildOrderEmail } from '../server/order-email.js';

// A small delivery seam lets tests verify order handling without sending real emails.
export function createOrderHandler({ env = process.env, deliver } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: m.method });
    }
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || ''))
      return res.status(415).json({ error: m.contentType });
    if (Number(req.headers['content-length'] || 0) > 32768)
      return res.status(413).json({ error: m.size });
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!raw) throw new OrderError(m.body);
      if (Buffer.byteLength(raw) > 32768) throw new OrderError(m.size, 413);
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        throw new OrderError(m.json);
      }
      const order = validateOrder(body);
      if (!env.RESEND_API_KEY || !env.ORDER_TO_EMAIL || !env.ORDER_FROM_EMAIL)
        return res.status(503).json({ error: m.unconfigured });

      // Stable for a retry, different when the customer or cart changes. The secret never reaches the client.
      const digest = createHmac('sha256', env.RESEND_API_KEY)
        .update(JSON.stringify(order))
        .digest('hex');
      const orderNumber = `ZL-${digest.slice(0, 8).toUpperCase()}`;
      const message = {
        from: env.ORDER_FROM_EMAIL,
        to: [env.ORDER_TO_EMAIL],
        ...(order.customer.email ? { replyTo: order.customer.email } : {}),
        ...buildOrderEmail(order, orderNumber),
      };
      const send =
        deliver || ((email, options) => new Resend(env.RESEND_API_KEY).emails.send(email, options));
      const { data, error } = await send(message, { idempotencyKey: `zaarilux-order-${digest}` });
      if (error || !data?.id) {
        if (error?.statusCode === 429) {
          res.setHeader('Retry-After', '30');
          return res.status(429).json({ error: m.busy });
        }
        return res.status(502).json({ error: m.failed });
      }
      return res
        .status(201)
        .json({
          orderNumber,
          timestamp: new Date().toISOString(),
          items: order.items,
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          paymentMethod: 'Cash on Delivery',
        });
    } catch (error) {
      if (error instanceof OrderError)
        return res.status(error.status).json({ error: error.message });
      return res.status(502).json({ error: m.service });
    }
  };
}

export default createOrderHandler();
