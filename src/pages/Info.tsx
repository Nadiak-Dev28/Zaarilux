import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Mail, PackageCheck, Phone } from 'lucide-react';
import {
  brand,
  chatMessages,
  checkoutCopy,
  fieldErrors,
  home,
  info,
  ui,
  whatsappUrl,
} from '../data/content';
import { images } from '../data/products';
import { normalizePhone } from '../lib/order';
import { Breadcrumbs, PageHeading, PageTitle, WhatsAppIcon } from '../components/UI';

export function About() {
  const c = info.about;
  return (
    <div className="shell interior-page">
      <PageTitle title={ui.aboutBrand} />
      <Breadcrumbs items={[{ label: ui.about }]} />
      <div className="about-page-grid">
        <div className="about-photo">
          <img src={images.story} alt={home.storyAlt} />
        </div>
        <div>
          <PageHeading eyebrow={c.eyebrow} title={c.title} body={c.intro} />
          <div className="prose">
            {c.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link className="button" to="/shop">
            {ui.shopAll}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  const c = info.contact;
  return (
    <div className="shell interior-page">
      <PageTitle title={ui.contact} />
      <Breadcrumbs items={[{ label: ui.contact }]} />
      <div className="contact-grid">
        <div>
          <PageHeading eyebrow={c.eyebrow} title={c.title} body={c.intro} />
          <img
            className="contact-image"
            src={images.baby}
            alt="Soft baby care essentials in a sunlit setting"
          />
        </div>
        <div className="contact-methods">
          <div>
            <WhatsAppIcon size={26} />
            <h2>{c.whatsapp}</h2>
            <p>{c.whatsappText}</p>
            <a className="text-link" href={whatsappUrl()} target="_blank" rel="noreferrer">
              {home.helpCta}
              <ArrowRight size={15} />
            </a>
          </div>
          <div>
            <Phone size={25} strokeWidth={1.3} />
            <h2>{c.phone}</h2>
            <p>{c.phoneText}</p>
            <a className="text-link" href={`tel:+${brand.whatsapp}`}>
              {brand.phone}
              <ArrowRight size={15} />
            </a>
          </div>
          <div>
            <Mail size={25} strokeWidth={1.3} />
            <h2>{c.email}</h2>
            <p>{c.emailText}</p>
            <a className="text-link" href={`mailto:${brand.email}`}>
              {brand.email}
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Policy({ kind }: { kind: 'returns' | 'privacy' }) {
  const c = info[kind];
  return (
    <div className="shell interior-page">
      <PageTitle title={c.title} />
      <Breadcrumbs items={[{ label: c.title }]} />
      <article className="policy-content">
        <PageHeading eyebrow={c.eyebrow} title={c.title} body={c.intro} />
        {c.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
        <div className="policy-contact">
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer">
            {home.helpCta}
            <ArrowRight size={15} />
          </a>
        </div>
      </article>
    </div>
  );
}

export function TrackOrder() {
  const c = info.tracking;
  const [params] = useSearchParams();
  const [number, setNumber] = useState(params.get('order')?.slice(0, 11) || '');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({ number: '', phone: '' });
  return (
    <div className="shell interior-page">
      <PageTitle title={ui.track} />
      <Breadcrumbs items={[{ label: ui.track }]} />
      <div className="tracking-layout">
        <div className="tracking-copy">
          <p className="eyebrow ruled-eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p>{c.intro}</p>
          <div className="tracking-decoration">
            <PackageCheck size={53} strokeWidth={1} />
          </div>
        </div>
        {sent ? (
          <div className="tracking-result" aria-live="polite">
            <h2>{c.result}</h2>
            <p>{c.resultBody}</p>
            <dl className="tracking-details">
              <div>
                <dt>{checkoutCopy.orderNumber}</dt>
                <dd>{number}</dd>
              </div>
              <div>
                <dt>{checkoutCopy.phone}</dt>
                <dd>{normalizePhone(phone)}</dd>
              </div>
            </dl>
            <a
              className="button full-width"
              href={whatsappUrl(chatMessages.tracking(number, normalizePhone(phone)))}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={18} />
              {c.chat}
            </a>
            <a className="contact-phone" href={`tel:+${brand.whatsapp}`}>
              <Phone size={14} />
              {brand.phone}
            </a>
            <button className="underlined-link" onClick={() => setSent(false)}>
              {c.reset}
            </button>
          </div>
        ) : (
          <form
            className="tracking-form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const next = {
                number: /^ZL-[A-Z0-9]{6,8}$/.test(number.trim()) ? '' : fieldErrors.orderNumber,
                phone: normalizePhone(phone) ? '' : fieldErrors.phone,
              };
              setErrors(next);
              if (!next.number && !next.phone) {
                setNumber(number.trim());
                setSent(true);
              } else document.getElementById(next.number ? 'track-number' : 'track-phone')?.focus();
            }}
          >
            <label className="field" htmlFor="track-number">
              <span>{checkoutCopy.orderNumber}</span>
              <input
                id="track-number"
                value={number}
                onChange={(e) => setNumber(e.target.value.toUpperCase())}
                maxLength={11}
                required
                placeholder={c.hint}
                autoCapitalize="characters"
                aria-invalid={!!errors.number}
                aria-describedby={errors.number ? 'track-number-error' : undefined}
              />
              {errors.number && (
                <small id="track-number-error" className="field-error">
                  {errors.number}
                </small>
              )}
            </label>
            <label className="field" htmlFor="track-phone">
              <span>{checkoutCopy.phone}</span>
              <input
                id="track-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={28}
                required
                placeholder={checkoutCopy.phoneHint}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'track-phone-error' : undefined}
              />
              {errors.phone && (
                <small id="track-phone-error" className="field-error">
                  {errors.phone}
                </small>
              )}
            </label>
            <button className="button full-width" type="submit">
              {c.action}
              <ArrowRight size={17} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function NotFound() {
  const c = info.notFound;
  return (
    <div className="shell not-found">
      <PageTitle title={c.eyebrow} />
      <PageHeading eyebrow={c.eyebrow} title={c.title} body={c.body} />
      <Link className="button" to="/">
        {ui.backHome}
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
