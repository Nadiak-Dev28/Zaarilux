import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Banknote, Check, CheckCheck, LoaderCircle, LockKeyhole } from 'lucide-react';
import { checkoutCopy as c, chatMessages, home, ui, whatsappUrl } from '../data/content';
import { findProduct, money } from '../data/products';
import { useCart } from '../lib/cart';
import { normalizePhone, validateCustomer } from '../lib/order';
import type { Customer, FormErrors, Receipt } from '../lib/order';
import { Breadcrumbs, PageHeading, PageTitle, WhatsAppIcon } from '../components/UI';
import { EmptyCart, Totals } from '../components/ShoppingCart';

const RECEIPT_KEY = 'zaarilux.receipt.v1';
const blank: Customer = { name: '', phone: '', email: '', address: '', city: '', notes: '' };
type ReceiptWithCity = Receipt & { city: string };

function isReceipt(value: unknown): value is Receipt {
  if (!value || typeof value !== 'object') return false;
  const r = value as Receipt;
  return (
    typeof r.orderNumber === 'string' &&
    /^ZL-[A-Z0-9]{6,8}$/.test(r.orderNumber) &&
    r.paymentMethod === 'Cash on Delivery' &&
    Number.isFinite(r.total) &&
    Number.isFinite(r.subtotal) &&
    Number.isFinite(r.shipping) &&
    r.total === r.subtotal + r.shipping &&
    Array.isArray(r.items) &&
    r.items.length > 0 &&
    r.items.every(
      (i) =>
        i &&
        typeof i.name === 'string' &&
        Number.isInteger(i.qty) &&
        i.qty > 0 &&
        Number.isFinite(i.unitPrice),
    )
  );
}

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer>(blank);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [website, setWebsite] = useState('');
  const busyRef = useRef(false);
  const attempt = useRef<{ signature: string; requestId: string; timestamp: string } | null>(null);
  const items = cart.entries.map((l) => ({
    productId: l.productId,
    name: l.product.name,
    qty: l.qty,
    unitPrice: l.product.price,
    size: l.size,
    color: l.color,
  }));
  const update = (key: keyof Customer, value: string) => {
    setCustomer((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setError('');
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busyRef.current) return;
    const cleaned = Object.fromEntries(
      Object.entries(customer).map(([k, v]) => [k, v.trim()]),
    ) as Customer;
    const foundErrors = validateCustomer(cleaned);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length) {
      setError(c.validation);
      document.getElementById(`checkout-${Object.keys(foundErrors)[0]}`)?.focus();
      return;
    }
    cleaned.phone = normalizePhone(cleaned.phone);
    const signature = JSON.stringify({ cleaned, items, total: cart.total });
    if (!attempt.current || attempt.current.signature !== signature)
      attempt.current = {
        signature,
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
    busyRef.current = true;
    setBusy(true);
    setError('');
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 26000);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          customer: cleaned,
          items,
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          total: cart.total,
          timestamp: attempt.current.timestamp,
          requestId: attempt.current.requestId,
          paymentMethod: ui.cod,
          website,
        }),
      });
      if (!response.headers.get('content-type')?.includes('application/json'))
        throw new Error(c.unavailable);
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          response.status === 503
            ? c.unavailable
            : typeof data.error === 'string'
              ? data.error
              : c.error,
        );
      if (!isReceipt(data)) throw new Error(c.error);
      const receipt: ReceiptWithCity = { ...data, city: cleaned.city };
      try {
        sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
      } catch {
        /* Navigation state also carries the receipt. */
      }
      cart.clear();
      navigate('/order-success', { replace: true, state: { receipt } });
    } catch (err) {
      setError(
        err instanceof Error && err.name !== 'AbortError' && !(err instanceof TypeError)
          ? err.message
          : c.network,
      );
    } finally {
      window.clearTimeout(timer);
      busyRef.current = false;
      setBusy(false);
    }
  };
  const field = (
    key: keyof Customer,
    label: string,
    placeholder: string,
    props: {
      type?: string;
      autoComplete?: string;
      optional?: boolean;
      area?: boolean;
      max: number;
    },
  ) => {
    const shared = {
      id: `checkout-${key}`,
      name: key,
      value: customer[key],
      placeholder,
      required: !props.optional,
      maxLength: props.max,
      autoComplete: props.autoComplete,
      'aria-invalid': !!errors[key],
      'aria-describedby': errors[key] ? `error-${key}` : undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        update(key, e.target.value),
    };
    return (
      <div className="field">
        <label htmlFor={`checkout-${key}`}>
          {label}
          {props.optional && <small> ({c.optional})</small>}
        </label>
        {props.area ? (
          <textarea {...shared} rows={3} />
        ) : (
          <input {...shared} type={props.type || 'text'} />
        )}
        {errors[key] && (
          <small className="field-error" id={`error-${key}`}>
            {errors[key]}
          </small>
        )}
      </div>
    );
  };
  return (
    <div className="shell interior-page">
      <PageTitle title={c.title} />
      <Breadcrumbs items={[{ label: ui.cart, to: '/cart' }, { label: c.title }]} />
      <PageHeading eyebrow={c.eyebrow} title={c.title} body={c.intro} />
      {!cart.count ? (
        <EmptyCart />
      ) : (
        <div className="checkout-layout">
          <form noValidate onSubmit={submit} className="checkout-form">
            <fieldset disabled={busy}>
              <legend>{c.contact}</legend>
              {field('name', c.name, c.nameHint, { autoComplete: 'name', max: 90 })}
              <div className="form-row">
                {field('phone', c.phone, c.phoneHint, {
                  type: 'tel',
                  autoComplete: 'tel',
                  max: 28,
                })}
                {field('email', c.email, c.emailHint, {
                  type: 'email',
                  autoComplete: 'email',
                  optional: true,
                  max: 254,
                })}
              </div>
            </fieldset>
            <fieldset disabled={busy}>
              <legend>{c.delivery}</legend>
              {field('address', c.address, c.addressHint, {
                area: true,
                autoComplete: 'street-address',
                max: 500,
              })}
              {field('city', c.city, c.cityHint, { autoComplete: 'address-level2', max: 80 })}
              {field('notes', c.notes, c.notesHint, { area: true, optional: true, max: 1000 })}
            </fieldset>
            <div className="honeypot" aria-hidden="true">
              <label>
                {c.honeypot}
                <input
                  autoComplete="off"
                  name="website"
                  tabIndex={-1}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>
            <fieldset disabled={busy}>
              <legend>{c.payment}</legend>
              <div className="payment-choice">
                <span className="payment-radio">
                  <Check size={12} />
                </span>
                <div>
                  <strong>{ui.cod}</strong>
                  <p>{c.paymentNote}</p>
                </div>
                <Banknote size={24} strokeWidth={1.4} />
              </div>
            </fieldset>
            <p className="privacy-consent">
              <LockKeyhole size={14} />
              <span>
                {c.consent}{' '}
                <Link to="/privacy-policy" target="_blank">
                  {c.privacy}
                </Link>
                .
              </span>
            </p>
            {error && (
              <div className="form-alert" role="alert">
                <p>{error}</p>
                {error !== c.validation && (
                  <a
                    className="text-link"
                    href={whatsappUrl(chatMessages.cart(items, cart.shipping, cart.total))}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon size={16} />
                    {ui.whatsappOrder}
                  </a>
                )}
              </div>
            )}
            <button className="button checkout-submit full-width" type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="spinner" size={18} /> : <CheckCheck size={18} />}
              {busy ? c.placing : `${c.place} \u00b7 ${money(cart.total)}`}
            </button>
          </form>
          <aside className="order-aside checkout-summary">
            <h2>{ui.summary}</h2>
            <ul className="summary-items">
              {cart.entries.map((l) => (
                <li key={l.key}>
                  <img src={l.product.images[0].src} alt="" />
                  <div>
                    <strong>{l.product.shortName}</strong>
                    <p>
                      {l.size} / {l.color}
                    </p>
                    <small>
                      {ui.quantity}: {l.qty}
                    </small>
                  </div>
                  <span>{money(l.qty * l.product.price)}</span>
                </li>
              ))}
            </ul>
            <Totals {...cart} />
            <Link className="underlined-link" to="/cart">
              {ui.viewCart}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export function OrderSuccess() {
  const location = useLocation();
  const [receipt] = useState<ReceiptWithCity | null>(() => {
    try {
      const candidate =
        location.state?.receipt || JSON.parse(sessionStorage.getItem(RECEIPT_KEY) || 'null');
      return isReceipt(candidate) ? (candidate as ReceiptWithCity) : null;
    } catch {
      return null;
    }
  });
  if (!receipt)
    return (
      <div className="shell success-page">
        <PageTitle title={ui.summary} />
        <PageHeading title={c.noReceipt} body={c.noReceiptBody} />
        <Link to="/track-order" className="button">
          {ui.track}
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  return (
    <div className="shell success-page">
      <PageTitle title={c.thanks} />
      <div className="success-mark">
        <Check size={30} strokeWidth={1.5} />
      </div>
      <PageHeading eyebrow={c.successEyebrow} title={c.thanks} body={c.successBody} />
      <div className="receipt">
        <div className="receipt-heading">
          <span className="eyebrow">{c.orderNumber}</span>
          <strong>{receipt.orderNumber}</strong>
        </div>
        <h2>{ui.summary}</h2>
        <ul className="summary-items">
          {receipt.items.map((i) => (
            <li key={`${i.productId}-${i.color}-${i.size}`}>
              <img src={findProduct(i.productId)?.images[0].src} alt="" />
              <div>
                <strong>{i.name}</strong>
                <p>
                  {i.size} / {i.color} / {ui.quantity}: {i.qty}
                </p>
              </div>
              <span>{money(i.unitPrice * i.qty)}</span>
            </li>
          ))}
        </ul>
        <Totals {...receipt} />
        <div className="receipt-payment">
          <Banknote size={17} />
          {ui.cod} <span>{receipt.city}</span>
        </div>
      </div>
      <div className="success-links">
        <Link className="button" to={`/track-order?order=${receipt.orderNumber}`}>
          {ui.track}
          <ArrowRight size={16} />
        </Link>
        <Link className="text-link" to="/shop">
          {ui.continueShopping}
        </Link>
      </div>
      <a
        className="success-help"
        href={whatsappUrl(chatMessages.receipt(receipt.orderNumber))}
        target="_blank"
        rel="noreferrer"
      >
        <WhatsAppIcon size={16} />
        {home.helpCta}
      </a>
    </div>
  );
}
