import { useEffect, useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Minus, Plus, X } from 'lucide-react';
import { brand, ui } from '../data/content';
import { maxQuantity, money } from '../data/products';
import type { Product } from '../data/products';

export function Branch({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 44 52" fill="none" aria-hidden="true">
      <path
        d="M9 48C12 33 21 19 36 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M15 33C6 32 5 24 5 19C14 21 18 25 15 33Z" fill="currentColor" opacity=".85" />
      <path d="M20 24C15 20 15 12 17 7C24 12 25 18 20 24Z" fill="currentColor" />
      <path d="M25 18C25 9 31 4 37 2C38 10 33 16 25 18Z" fill="currentColor" opacity=".86" />
      <path d="M20 25C25 18 34 18 40 20C35 27 27 29 20 25Z" fill="currentColor" opacity=".75" />
      <path d="M13 38C18 30 25 29 32 31C28 38 20 41 13 38Z" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="brand-lockup" aria-label={`${brand.name} home`}>
      <Branch className="brand-branch" />
      <span className="brand-type">
        <span className="wordmark">{brand.name}</span>
        <span className="brand-tagline">{brand.tagline}</span>
      </span>
    </Link>
  );
}

export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 11.7a8.9 8.9 0 0 1-13.1 7.9l-4.8 1.3 1.3-4.6A8.9 8.9 0 1 1 20.8 11.7Z" />
      <path
        d="m8.3 7.3 1.2-.2 1.1 2.6-.9 1.1c.8 1.6 1.8 2.6 3.5 3.3l1.1-1.2 2.5 1.2c-.3 2.4-1.8 2.9-3.9 2-3.2-1.3-5.5-3.8-6-6.5-.2-1 .4-1.8 1.4-2.3Z"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} | ${brand.name}`;
  }, [title]);
  return null;
}

export function Modal({
  children,
  onClose,
  title,
  className = '',
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button type="button" className="icon-button" aria-label={ui.close} onClick={onClose}>
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function Quantity({
  value,
  onChange,
  label = ui.quantity,
  max = maxQuantity,
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  max?: number;
}) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        type="button"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease ${label}`}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export function Price({ product }: { product: Product }) {
  return (
    <div className="price">
      <span>{money(product.price)}</span>
      <del>{money(product.oldPrice)}</del>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">{ui.home}</Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          <ChevronRight size={12} />
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="text-link" to={to}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}

export function Accordion({
  title,
  children,
  group,
}: {
  title: string;
  children: ReactNode;
  group?: string;
}) {
  return (
    <details className="accordion" name={group}>
      <summary>
        {title}
        <Plus className="accordion-plus" size={18} />
        <Minus className="accordion-minus" size={18} />
      </summary>
      <div className="accordion-answer">{children}</div>
    </details>
  );
}

export function PageHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {body && <p className="page-intro">{body}</p>}
    </div>
  );
}
