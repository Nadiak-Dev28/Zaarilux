import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Coins,
  Heart,
  Leaf,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { brand, collections, faqs, home, ui, whatsappUrl } from '../data/content';
import { images, products } from '../data/products';
import { Accordion, Branch, PageTitle, TextLink, WhatsAppIcon } from '../components/UI';
import ProductGrid from '../components/ProductGrid';

const trustIcons = [Truck, Banknote, RotateCcw, Leaf];
const whyIcons = [RefreshCw, Leaf, Coins, Heart];

export function HelpBanner() {
  return (
    <section className="help-banner">
      <div className="shell help-inner">
        <div>
          <h2>{home.helpHeading}</h2>
          <p>{home.helpBody}</p>
        </div>
        <a className="button button-light" href={whatsappUrl()} target="_blank" rel="noreferrer">
          <WhatsAppIcon />
          {home.helpCta}
        </a>
      </div>
      <Branch className="help-branch" />
    </section>
  );
}

export default function Home() {
  const [review, setReview] = useState(0);
  return (
    <>
      <PageTitle title={brand.tagline} />
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-image-plane">
          <img
            src={images.hero}
            alt={home.heroAlt}
            fetchPriority="high"
            width="1248"
            height="832"
          />
        </div>
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span />
              {home.heroEyebrow}
            </p>
            <h1 id="hero-heading" aria-label={[...home.heroLines, home.heroItalic].join(' ')}>
              <span>{home.heroLines[0]}</span>
              <span>{home.heroLines[1]}</span>
              <em>{home.heroItalic}</em>
            </h1>
            <p className="hero-description">{home.heroBody}</p>
            <Link to="/shop" className="button hero-cta">
              {home.shopNow}
              <ArrowRight size={18} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>
      <section className="trust-strip" aria-label="Shopping with Zaarilux">
        <div className="shell trust-inner">
          {home.trust.map((t, i) => {
            const Icon = trustIcons[i];
            return (
              <div className="trust-item" key={t.title}>
                <span className="trust-icon">
                  <Icon size={28} strokeWidth={1.35} />
                </span>
                <div>
                  <h2>{t.title}</h2>
                  <p>{t.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="category-section shell" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow ruled-eyebrow">{home.categoryEyebrow}</p>
            <h2>{home.categoryHeading}</h2>
          </div>
          <TextLink to="/shop">{home.exploreAll}</TextLink>
        </div>
        <div className="collection-grid">
          {collections.map((c) => (
            <Link
              className={`collection-link collection-${c.category.toLowerCase()}`}
              key={c.category}
              to={`/shop?category=${c.category}`}
            >
              <img src={c.image} alt={c.alt} width="600" height="350" loading="lazy" />
              <div className="collection-copy">
                <h3>{c.title}</h3>
                <p>{c.subtitle}</p>
                <span className="collection-arrow" aria-hidden="true">
                  <ArrowRight size={19} strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="sale-section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow ruled-eyebrow">{home.saleEyebrow}</p>
            <h2>{home.saleHeading}</h2>
          </div>
          <TextLink to="/shop">{home.viewShop}</TextLink>
        </div>
        <ProductGrid products={[products[0], products[3], products[1], products[2]]} compact />
      </section>
      <section className="why-section">
        <div className="shell">
          <div className="center-heading">
            <p className="eyebrow">{home.whyEyebrow}</p>
            <h2>{home.whyHeading}</h2>
          </div>
          <div className="why-grid">
            {home.why.map((w, i) => {
              const Icon = whyIcons[i];
              return (
                <div key={w.title}>
                  <Icon size={27} strokeWidth={1.2} />
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="story-section shell">
        <div className="story-image">
          <img loading="lazy" src={images.story} alt={home.storyAlt} width="640" height="450" />
        </div>
        <div className="story-copy">
          <p className="eyebrow ruled-eyebrow">{home.storyEyebrow}</p>
          <h2>{home.storyHeading}</h2>
          <p>{home.storyBody}</p>
          <TextLink to="/about">{home.storyLink}</TextLink>
        </div>
      </section>
      <section className="reviews-section">
        <div className="shell review-inner">
          <div>
            <p className="eyebrow ruled-eyebrow">{home.reviewsEyebrow}</p>
            <h2>{home.reviewsHeading}</h2>
            <p className="sample-note">{home.sampleNote}</p>
          </div>
          <div className="review-quote">
            <p className="eyebrow">
              {home.sample} {String(review + 1).padStart(2, '0')}
            </p>
            <blockquote key={review} aria-live="polite">
              &ldquo;{home.reviews[review]}&rdquo;
            </blockquote>
            <div className="review-controls">
              <button
                className="round-button"
                aria-label={`${ui.previous} sample review`}
                onClick={() =>
                  setReview((v) => (v + home.reviews.length - 1) % home.reviews.length)
                }
              >
                <ArrowLeft size={15} />
              </button>
              <button
                className="round-button"
                aria-label={`${ui.next} sample review`}
                onClick={() => setReview((v) => (v + 1) % home.reviews.length)}
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="faq-section shell">
        <div className="faq-intro">
          <p className="eyebrow ruled-eyebrow">{home.faqEyebrow}</p>
          <h2>{home.faqHeading}</h2>
          <ShieldCheck size={31} strokeWidth={1.1} />
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <Accordion title={f.question} key={f.question} group="home-faq">
              {f.answer}
            </Accordion>
          ))}
        </div>
      </section>
      <HelpBanner />
    </>
  );
}
