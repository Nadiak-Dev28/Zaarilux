import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Mail, Menu, Search, ShoppingBag, Truck } from 'lucide-react';
import { brand, collections, footer, home, nav, ui, whatsappUrl } from '../data/content';
import { money, searchProducts } from '../data/products';
import { useCart } from '../lib/cart';
import { Logo, Modal, WhatsAppIcon } from './UI';

function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const matches = searchProducts(q);
  return (
    <Modal title={ui.searchTitle} onClose={onClose} className="search-modal">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
          navigate(`/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
        }}
      >
        <div className="search-field">
          <Search size={19} />
          <input
            autoFocus
            aria-label={ui.search}
            placeholder={ui.searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={100}
          />
          <button className="icon-button" aria-label={ui.goResults}>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
      <p className="eyebrow search-label">{q ? ui.searchResults : ui.popularSearch}</p>
      <div className="search-matches" aria-live="polite">
        {matches.length ? (
          matches.map((p) => (
            <Link onClick={onClose} key={p.id} to={`/product/${p.id}`}>
              <img src={p.images[0].src} alt="" />
              <span>
                <strong>{p.shortName}</strong>
                <small>
                  {p.category} <span aria-hidden="true">/</span> {money(p.price)}
                </small>
              </span>
              <ArrowRight size={16} />
            </Link>
          ))
        ) : (
          <p className="muted">{ui.searchEmpty}</p>
        )}
      </div>
    </Modal>
  );
}

export function Header() {
  const { count, setOpen } = useCart();
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useEffect(() => {
    setMenu(false);
    setDropdown(false);
    setSearch(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    if (!dropdown) return;
    const close = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setDropdown(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdown(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [dropdown]);
  const selectedCategory = collections.find(
    (c) => c.category === new URLSearchParams(location.search).get('category'),
  );
  const current =
    location.pathname === '/shop' && selectedCategory
      ? `/shop?category=${selectedCategory.category}`
      : location.pathname;
  return (
    <>
      <a className="skip-link" href="#main-content">
        {ui.skip}
      </a>
      <div className="announcement">
        <Truck size={14} strokeWidth={1.5} />
        <span>{home.announcement}</span>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <button
            className="icon-button mobile-menu-button"
            aria-label={ui.menu}
            onClick={() => setMenu(true)}
          >
            <Menu size={22} />
          </button>
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map((n) =>
              n.label === 'Shop' ? (
                <div
                  className={`shop-nav ${current === n.path ? 'is-active' : ''}`}
                  key={n.path}
                  ref={dropRef}
                >
                  <Link
                    to={n.path}
                    className="nav-link"
                    aria-current={current === n.path ? 'page' : undefined}
                  >
                    {n.label}
                  </Link>
                  <button
                    className="nav-chevron"
                    aria-label="Shop categories"
                    aria-expanded={dropdown}
                    aria-controls="shop-categories"
                    onClick={() => setDropdown(!dropdown)}
                  >
                    <ChevronDown size={12} />
                  </button>
                  {dropdown && (
                    <div className="shop-dropdown" id="shop-categories">
                      <Link to="/shop" onClick={() => setDropdown(false)}>
                        {ui.allProducts}
                        <ArrowRight size={14} />
                      </Link>
                      {collections.map((c) => (
                        <Link
                          key={c.category}
                          to={`/shop?category=${c.category}`}
                          onClick={() => setDropdown(false)}
                        >
                          {c.title}
                          <ArrowRight size={14} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={n.path}
                  to={n.path}
                  className={`nav-link ${current === n.path ? 'is-active' : ''}`}
                  aria-current={current === n.path ? 'page' : undefined}
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button search-trigger"
              aria-label={ui.search}
              onClick={() => setSearch(true)}
            >
              <Search strokeWidth={1.5} size={22} />
            </button>
            <span className="header-divider" />
            <button
              className="icon-button bag-button"
              aria-label={`Open cart, ${ui.itemCount(count)}`}
              onClick={() => setOpen(true)}
            >
              <ShoppingBag size={23} strokeWidth={1.5} />
              <span className="cart-count">{count}</span>
            </button>
          </div>
        </div>
      </header>
      {search && <SearchModal onClose={() => setSearch(false)} />}
      {menu && (
        <Modal
          title={brand.name}
          className="drawer mobile-navigation"
          onClose={() => setMenu(false)}
        >
          <nav aria-label="Mobile navigation">
            {[
              ...nav.slice(0, 4),
              { label: 'Bedding', path: '/shop?category=Bedding' },
              nav[4],
              ...footer.links.slice(0, 2),
            ].map((n) => (
              <Link key={n.path} to={n.path} onClick={() => setMenu(false)}>
                {n.label}
                <ArrowRight size={17} />
              </Link>
            ))}
          </nav>
          <p className="muted">{brand.tagline}</p>
        </Modal>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>{brand.description}</p>
            <div className="social-links">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                aria-label="Zaarilux on WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(brand.website)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share Zaarilux on Facebook"
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.3 22v-9h3l.5-3.5h-3.5V7.2c0-1 .3-1.7 1.8-1.7H18V2.4c-.4-.1-1.5-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.8v2.5h-3V13h3v9z" />
                </svg>
              </a>
              <a href={`mailto:${brand.email}`} aria-label="Email Zaarilux">
                <Mail size={17} />
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h3>{footer.shop}</h3>
            <Link to="/shop">{ui.allProducts}</Link>
            {collections.map((c) => (
              <Link key={c.category} to={`/shop?category=${c.category}`}>
                {c.title}
              </Link>
            ))}
          </div>
          <div className="footer-column">
            <h3>{footer.care}</h3>
            {[...footer.links, ...footer.policies].map((l) => (
              <Link to={l.path} key={l.path}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="footer-column">
            <h3>{footer.contact}</h3>
            <a href={`tel:+${brand.whatsapp}`}>{brand.phone}</a>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <span>{brand.country}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{footer.copyright(new Date().getFullYear())}</span>
          <span>{footer.bottom}</span>
        </div>
      </div>
    </footer>
  );
}
