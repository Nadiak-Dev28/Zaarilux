import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Banknote, Expand, Ruler, ShoppingBag } from 'lucide-react';
import { chatMessages, ui, whatsappUrl } from '../data/content';
import { findProduct, maxCartLines, products } from '../data/products';
import type { Product as ProductType } from '../data/products';
import { useCart } from '../lib/cart';
import {
  Accordion,
  Breadcrumbs,
  Modal,
  PageTitle,
  Price,
  Quantity,
  WhatsAppIcon,
} from '../components/UI';
import ProductGrid from '../components/ProductGrid';
import { NotFound } from './Info';

function ProductDetail({ product: p }: { product: ProductType }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(p.sizes[0]);
  const [color, setColor] = useState(p.colors[0].name);
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [error, setError] = useState('');
  const cart = useCart();
  const image = p.images[activeImage];
  const orderMessage = chatMessages.product(p.name, qty, size, color, p.price * qty);
  return (
    <div className="shell product-page">
      <PageTitle title={p.shortName} />
      <Breadcrumbs
        items={[
          { label: ui.shop, to: '/shop' },
          { label: p.category, to: `/shop?category=${p.category}` },
          { label: p.shortName },
        ]}
      />
      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="gallery-main">
            <img src={image.src} alt={image.alt} key={image.src} />
            <span className="sale-label">{ui.sale}</span>
            <button
              className="gallery-zoom round-button"
              aria-label="Enlarge product image"
              onClick={() => setZoom(true)}
            >
              <Expand size={17} />
            </button>
          </div>
          <div className="gallery-thumbs" role="group" aria-label="Product gallery">
            {p.images.map((img, i) => (
              <button
                key={img.src}
                aria-pressed={i === activeImage}
                className={i === activeImage ? 'active' : ''}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}: ${img.alt}`}
              >
                <img src={img.src} alt="" />
              </button>
            ))}
          </div>
          <p className="image-note">{ui.imageNote}</p>
        </div>
        <div className="product-information">
          <p className="eyebrow ruled-eyebrow">
            {p.category} {ui.browsing}
          </p>
          <h1>{p.name}</h1>
          <Price product={p} />
          <p className="product-description">{p.description}</p>
          <div className="variant-section">
            <div className="variant-heading">
              <span>
                {ui.colour}: <strong>{color}</strong>
              </span>
            </div>
            <div className="swatch-list" role="group" aria-label={ui.colour}>
              {p.colors.map((c) => (
                <button
                  key={c.name}
                  aria-label={c.name}
                  title={c.name}
                  aria-pressed={color === c.name}
                  onClick={() => {
                    setColor(c.name);
                    setError('');
                  }}
                  className={`swatch ${color === c.name ? 'selected' : ''}`}
                >
                  <span style={{ backgroundColor: c.hex }} />
                </button>
              ))}
            </div>
          </div>
          <div className="variant-section">
            <div className="variant-heading">
              <span>{ui.size}</span>
              <button className="fit-link" onClick={() => setGuide(true)}>
                <Ruler size={14} />
                {ui.sizeGuide}
              </button>
            </div>
            <div className="size-list" role="group" aria-label={ui.size}>
              {p.sizes.map((s) => (
                <button
                  key={s}
                  aria-pressed={size === s}
                  className={size === s ? 'selected' : ''}
                  onClick={() => {
                    setSize(s);
                    setError('');
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="add-cart-row">
            <Quantity
              value={qty}
              onChange={(q) => {
                setQty(q);
                setError('');
              }}
            />
            <button
              className="button"
              onClick={() => {
                if (!cart.add(p, size, color, qty))
                  setError(cart.entries.length >= maxCartLines ? ui.lineLimit : ui.orderLimit);
                else setError('');
              }}
            >
              <ShoppingBag size={17} />
              {ui.addToCart}
            </button>
          </div>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <a
            className="button button-outline full-width whatsapp-order"
            href={whatsappUrl(orderMessage)}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={18} />
            {ui.whatsappOrder}
          </a>
          <div className="product-payment-note">
            <Banknote size={17} />
            {ui.cod}
          </div>
          <div className="product-accordions">
            <Accordion title={ui.details} group="product-info">
              <ul>
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Accordion>
            <Accordion title={ui.care} group="product-info">
              {p.care}
            </Accordion>
            <Accordion title={ui.delivery} group="product-info">
              <p>{ui.shippingNote}</p>
              <Link className="underlined-link" to="/refunds-returns">
                {ui.returns}
              </Link>
            </Accordion>
          </div>
        </div>
      </div>
      <section className="related-section">
        <div className="section-heading">
          <h2>{ui.related}</h2>
        </div>
        <ProductGrid
          products={[
            ...products.filter((x) => x.category === p.category && x.id !== p.id),
            ...products.filter((x) => x.category !== p.category),
          ].slice(0, 4)}
          compact
        />
      </section>
      {guide && (
        <Modal title={ui.sizeGuide} onClose={() => setGuide(false)} className="fit-modal">
          <p className="eyebrow">{p.shortName}</p>
          <p>{p.fit}</p>
          <a
            className="button"
            href={whatsappUrl(chatMessages.fit(p.name))}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={17} />
            {ui.talkFit}
          </a>
        </Modal>
      )}
      {zoom && (
        <Modal title={p.shortName} onClose={() => setZoom(false)} className="zoom-modal">
          <img src={image.src} alt={image.alt} />
        </Modal>
      )}
    </div>
  );
}

export default function Product() {
  const { id = '' } = useParams();
  const p = findProduct(id);
  return p ? <ProductDetail key={p.id} product={p} /> : <NotFound />;
}
