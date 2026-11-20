import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '../data/products';
import { ui } from '../data/content';
import { Price } from './UI';

export default function ProductGrid({
  products,
  compact = false,
}: {
  products: Product[];
  compact?: boolean;
}) {
  return (
    <div className={`product-grid ${compact ? 'compact-grid' : ''}`}>
      {products.map((p) => (
        <article className="product-tile" key={p.id}>
          <Link
            to={`/product/${p.id}`}
            className="product-image-link"
            aria-label={`View ${p.shortName}`}
          >
            <img
              src={p.images[0].src}
              alt={p.images[0].alt}
              loading="lazy"
              width="600"
              height="650"
            />
            <span className="sale-label">{ui.sale}</span>
            <span className="product-quick-link" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </Link>
          <div className="product-caption">
            <p className="eyebrow">{p.category}</p>
            <h3>
              <Link to={`/product/${p.id}`}>{p.shortName}</Link>
            </h3>
            <Price product={p} />
          </div>
        </article>
      ))}
    </div>
  );
}
