import { Link } from 'react-router-dom';
import { ArrowRight, Check, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useCart } from '../lib/cart';
import { money, shippingPolicy } from '../data/products';
import { ui } from '../data/content';
import { Modal, Quantity } from './UI';

export function ShippingProgress() {
  const { subtotal } = useCart();
  const remaining = Math.max(0, shippingPolicy.freeAt - subtotal);
  return (
    <div className="shipping-progress">
      <p aria-live="polite">
        {remaining ? <Truck size={18} /> : <Check size={18} />}
        {remaining ? ui.shippingRemaining(remaining) : ui.shippingUnlocked}
      </p>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Free shipping progress"
        aria-valuemin={0}
        aria-valuemax={shippingPolicy.freeAt}
        aria-valuenow={Math.min(subtotal, shippingPolicy.freeAt)}
      >
        <span style={{ width: `${Math.min(100, (subtotal / shippingPolicy.freeAt) * 100)}%` }} />
      </div>
    </div>
  );
}

export function EmptyCart({ onContinue }: { onContinue?: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <ShoppingBag size={38} strokeWidth={1.1} />
      </div>
      <h2>{ui.emptyTitle}</h2>
      <p>{ui.emptyCart}</p>
      <Link className="button" to="/shop" onClick={onContinue}>
        {ui.shopAll}
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}

export function CartItems() {
  const { entries, setQty, remove, setOpen } = useCart();
  return (
    <ul className="cart-items">
      {entries.map((l) => (
        <li className="cart-item" key={l.key}>
          <Link
            to={`/product/${l.productId}`}
            onClick={() => setOpen(false)}
            tabIndex={-1}
            aria-hidden="true"
          >
            <img src={l.product.images[0].src} alt="" className="cart-item-image" />
          </Link>
          <div className="cart-item-main">
            <Link
              className="cart-item-name"
              to={`/product/${l.productId}`}
              onClick={() => setOpen(false)}
            >
              {l.product.shortName}
            </Link>
            <p className="muted small">
              {l.size} <span aria-hidden="true">/</span> {l.color}
            </p>
            <span className="small cart-unit-price">
              {money(l.product.price)} {ui.each}
            </span>
            <div className="cart-item-controls">
              <Quantity
                value={l.qty}
                onChange={(qty) => setQty(l.key, qty)}
                label={`quantity of ${l.product.shortName}`}
              />
              <strong>{money(l.product.price * l.qty)}</strong>
            </div>
          </div>
          <button
            className="remove-item icon-button"
            onClick={() => remove(l.key)}
            aria-label={`${ui.remove} ${l.product.shortName}`}
          >
            <Trash2 size={15} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function Totals({
  subtotal,
  shipping,
  total,
}: {
  subtotal: number;
  shipping: number;
  total: number;
}) {
  return (
    <dl className="totals">
      <div>
        <dt>{ui.subtotal}</dt>
        <dd>{money(subtotal)}</dd>
      </div>
      <div>
        <dt>{ui.shipping}</dt>
        <dd>{shipping ? money(shipping) : ui.free}</dd>
      </div>
      <div className="grand-total">
        <dt>{ui.total}</dt>
        <dd>{money(total)}</dd>
      </div>
    </dl>
  );
}

export function CartDrawer() {
  const cart = useCart();
  if (!cart.open) return null;
  return (
    <Modal
      title={`${ui.cart} (${cart.count})`}
      onClose={() => cart.setOpen(false)}
      className="drawer cart-drawer"
    >
      {cart.entries.length ? (
        <>
          <ShippingProgress />
          <div className="drawer-scroll">
            <CartItems />
          </div>
          <div className="drawer-bottom">
            <Totals {...cart} />
            <Link to="/checkout" onClick={() => cart.setOpen(false)} className="button full-width">
              {ui.checkoutCta}
              <ArrowRight size={17} />
            </Link>
            <Link to="/cart" onClick={() => cart.setOpen(false)} className="underlined-link">
              {ui.viewCart}
            </Link>
          </div>
        </>
      ) : (
        <EmptyCart onContinue={() => cart.setOpen(false)} />
      )}
    </Modal>
  );
}
