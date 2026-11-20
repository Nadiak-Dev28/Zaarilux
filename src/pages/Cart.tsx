import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Banknote } from 'lucide-react';
import { ui } from '../data/content';
import { useCart } from '../lib/cart';
import { CartItems, EmptyCart, ShippingProgress, Totals } from '../components/ShoppingCart';
import { Breadcrumbs, PageHeading, PageTitle } from '../components/UI';

export default function Cart() {
  const cart = useCart();
  return (
    <div className="shell interior-page">
      <PageTitle title={ui.cart} />
      <Breadcrumbs items={[{ label: ui.cart }]} />
      <PageHeading title={ui.cart} body={cart.count ? ui.cartIntro : undefined} />
      {cart.count ? (
        <div className="cart-page-layout">
          <div>
            <ShippingProgress />
            <CartItems />
            <Link className="text-link back-shopping" to="/shop">
              <ArrowLeft size={16} />
              {ui.continueShopping}
            </Link>
          </div>
          <aside className="order-aside">
            <h2>{ui.summary}</h2>
            <p className="muted small">{ui.itemCount(cart.count)}</p>
            <Totals {...cart} />
            <Link className="button full-width" to="/checkout">
              {ui.checkoutCta}
              <ArrowRight size={16} />
            </Link>
            <p className="payment-caption">
              <Banknote size={16} />
              {ui.cod}
            </p>
          </aside>
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}
