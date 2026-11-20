import { fieldErrors, orderMessages as m } from '../data/content.ts';
import { findProduct, maxCartLines, maxQuantity, shippingFor } from '../data/products.ts';

export type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
};
export type FormErrors = Partial<Record<keyof Customer, string>>;
export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  size: string;
  color: string;
};
export type Receipt = {
  orderNumber: string;
  timestamp: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
};

export const normalizePhone = (value: string) => {
  const compact = value.replace(/[\s()-]/g, '');
  if (!/^(?:0|\+92|0092|92)3\d{9}$/.test(compact)) return '';
  return `+92${compact.slice(-10)}`;
};

export const validateCustomer = (c: Customer): FormErrors => {
  const errors: FormErrors = {};
  if (c.name.trim().length < 2 || c.name.length > 90) errors.name = fieldErrors.name;
  if (!normalizePhone(c.phone) || c.phone.length > 28) errors.phone = fieldErrors.phone;
  if (c.email && (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(c.email) || c.email.length > 254))
    errors.email = fieldErrors.email;
  if (c.address.trim().length < 10 || c.address.length > 500) errors.address = fieldErrors.address;
  if (c.city.trim().length < 2 || c.city.length > 80) errors.city = fieldErrors.city;
  if (c.notes.length > 1000) errors.notes = fieldErrors.notes;
  return errors;
};

export class OrderError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function clean(value: unknown, optional = false): string {
  if (optional && (value === undefined || value === null)) return '';
  if (typeof value !== 'string' || value.length > 1500) throw new OrderError(m.invalidField);
  return value
    .normalize('NFC')
    .replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function validateOrder(body: unknown) {
  if (!object(body) || !object(body.customer)) throw new OrderError(m.missingDetails);
  if (body.website !== undefined && body.website !== '') throw new OrderError(m.declined);
  if (body.paymentMethod !== 'Cash on Delivery') throw new OrderError(m.payment);
  if (
    typeof body.timestamp !== 'string' ||
    body.timestamp.length > 40 ||
    !Number.isFinite(Date.parse(body.timestamp))
  )
    throw new OrderError(m.timestamp);
  if (
    typeof body.requestId !== 'string' ||
    !/^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i.test(body.requestId)
  )
    throw new OrderError(m.refresh);
  const c = body.customer;
  const customer: Customer = {
    name: clean(c.name),
    phone: clean(c.phone),
    email: clean(c.email, true),
    address: clean(c.address),
    city: clean(c.city),
    notes: clean(c.notes, true),
  };
  const errors = validateCustomer(customer);
  if (Object.keys(errors).length) throw new OrderError(Object.values(errors)[0] as string);
  customer.phone = normalizePhone(customer.phone);
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > maxCartLines)
    throw new OrderError(m.lines);
  const seen = new Set<string>();
  const items: OrderItem[] = body.items.map((raw: unknown) => {
    if (!object(raw) || typeof raw.productId !== 'string') throw new OrderError(m.item);
    const p = findProduct(raw.productId);
    if (!p) throw new OrderError(m.unavailableItem, 409);
    if (
      typeof raw.qty !== 'number' ||
      !Number.isInteger(raw.qty) ||
      raw.qty < 1 ||
      raw.qty > maxQuantity
    )
      throw new OrderError(m.quantity);
    if (
      typeof raw.size !== 'string' ||
      !p.sizes.includes(raw.size) ||
      typeof raw.color !== 'string' ||
      !p.colors.some((c) => c.name === raw.color)
    )
      throw new OrderError(m.variant);
    if (raw.unitPrice !== p.price || raw.name !== p.name) throw new OrderError(m.catalog, 409);
    const key = `${p.id}|${raw.size}|${raw.color}`;
    if (seen.has(key)) throw new OrderError(m.duplicate);
    seen.add(key);
    return {
      productId: p.id,
      name: p.name,
      qty: raw.qty,
      unitPrice: p.price,
      size: raw.size,
      color: raw.color,
    };
  });
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  if (body.subtotal !== subtotal || body.shipping !== shipping || body.total !== total)
    throw new OrderError(m.totals, 409);
  return {
    requestId: body.requestId,
    customer,
    items,
    subtotal,
    shipping,
    total,
    timestamp: new Date(body.timestamp).toISOString(),
  };
}
