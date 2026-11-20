import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { collections, ui } from '../data/content';
import { Breadcrumbs, PageTitle } from '../components/UI';
import ProductGrid from '../components/ProductGrid';
import { searchProducts } from '../data/products';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const collection = collections.find(
    (c) => c.category.toLowerCase() === params.get('category')?.toLowerCase(),
  );
  const query = params.get('q')?.trim() || '';
  const sort = params.get('sort') || 'featured';
  const filtered = searchProducts(query).filter(
    (p) => !collection || p.category === collection.category,
  );
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { preventScrollReset: true });
  };
  return (
    <div className="shop-page">
      <PageTitle title={collection?.title || ui.shopHeading} />
      <div
        className={`shop-masthead ${collection ? `masthead-${collection.category.toLowerCase()}` : ''}`}
      >
        <div className="shell">
          <Breadcrumbs items={[{ label: ui.shop }]} />
          <div className="shop-heading">
            <p className="eyebrow ruled-eyebrow">{ui.shopEyebrow}</p>
            <h1>{collection?.title || ui.shopHeading}</h1>
            <p>{collection?.intro || ui.shopIntro}</p>
          </div>
        </div>
        {collection && <img className="shop-masthead-image" src={collection.image} alt="" />}
      </div>
      <div className="shell shop-content">
        <div className="shop-toolbar">
          <div className="filter-tabs" role="group" aria-label={ui.chooseCollection}>
            <button
              aria-pressed={!collection}
              className={!collection ? 'selected' : ''}
              onClick={() => change('category', '')}
            >
              {ui.allProducts}
            </button>
            {collections.map((c) => (
              <button
                key={c.category}
                aria-pressed={collection?.category === c.category}
                className={collection?.category === c.category ? 'selected' : ''}
                onClick={() => change('category', c.category)}
              >
                {c.category}
              </button>
            ))}
          </div>
          <label className="sort-control">
            <SlidersHorizontal size={15} />
            <span className="sr-only">{ui.sort}</span>
            <select value={sort} onChange={(e) => change('sort', e.target.value)}>
              <option value="featured">{ui.featured}</option>
              <option value="price-asc">{ui.priceLow}</option>
              <option value="price-desc">{ui.priceHigh}</option>
            </select>
          </label>
        </div>
        <div className="results-line">
          <span aria-live="polite">{ui.productsCount(filtered.length)}</span>
          {query && (
            <button onClick={() => change('q', '')} aria-label="Clear search">
              &ldquo;{query}&rdquo;
              <X size={13} />
            </button>
          )}
        </div>
        {filtered.length ? (
          <ProductGrid products={filtered} />
        ) : (
          <div className="empty-state">
            <h2>{ui.noProducts}</h2>
            <p>{ui.searchEmpty}</p>
            <Link to="/shop" className="button">
              {ui.clear}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
