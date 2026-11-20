export type Category = 'Baby' | 'Women' | 'Bedding';

// All storefront photography lives here, including collection and editorial images.
export const images = {
  hero: '/images/hero-care.webp',
  baby: '/images/baby-collection.webp',
  women: '/images/women-collection.webp',
  bedding: '/images/bedding-collection.webp',
  story: '/images/our-story.webp',
  trainer: '/images/trainer.webp',
  diaper: '/images/diaper.webp',
  pads: '/images/cloth-pads.webp',
  underwear: '/images/period-underwear.webp',
  pillow: '/images/pillow.webp',
  padDetail: '/images/pad-detail.webp',
  underwearDetail: '/images/underwear-detail.webp',
};

export interface Product {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  price: number;
  oldPrice: number;
  description: string;
  images: { src: string; alt: string }[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  details: string[];
  care: string;
  fit: string;
}

export const shippingPolicy = { freeAt: 2000, standard: 200 };
export const maxQuantity = 99;
export const maxCartLines = 30;
export const money = (amount: number) => `Rs ${amount.toLocaleString('en-PK')}`;
export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= shippingPolicy.freeAt ? 0 : shippingPolicy.standard;

const botanical = { name: 'Botanical', hex: '#afba9f' };
const sage = { name: 'Sage', hex: '#9ba78c' };
const rose = { name: 'Dusty Rose', hex: '#b78585' };
const cream = { name: 'Ivory', hex: '#e8e1d2' };
const washCare =
  'Rinse after use, then wash gently with a mild detergent. Avoid fabric softener and bleach. Air-dry completely and follow the care label on your item.';

// The order function imports this same catalog. Client-supplied prices are never trusted.
export const products: Product[] = [
  {
    id: 'reusable-potty-trainer-nappi',
    name: 'Reusable Potty Trainer Nappi',
    shortName: 'Reusable Potty Trainer Nappi',
    category: 'Baby',
    price: 850,
    oldPrice: 1000,
    description:
      'A soft, pull-on essential for little steps towards independence. A comfortable, washable alternative for your potty-training routine.',
    images: [
      { src: images.trainer, alt: 'Botanical cotton trainer nappy with a soft gathered waistband' },
      {
        src: images.baby,
        alt: 'Botanical and sage training nappies styled with a wooden stacking toy',
      },
    ],
    colors: [botanical, sage],
    sizes: ['S', 'M', 'L'],
    details: [
      'Reusable, pull-on design',
      'Soft, elasticated waist and leg openings',
      'One training nappy per item',
    ],
    care: washCare,
    fit: "Measure around your little one's waist and upper thigh. Share the measurements with our team before ordering for help choosing S, M, or L.",
  },
  {
    id: 'washable-baby-diaper-jumbo-insert',
    name: 'Baby Washable Diapers (Reusable) with Jumbo Insert, 8-hour use',
    shortName: 'Washable Diaper & Jumbo Insert',
    category: 'Baby',
    price: 600,
    oldPrice: 1000,
    description:
      'A gentle, reusable diaper with adjustable snaps and a generous jumbo insert. Made for a comfortable fit through everyday changes.',
    images: [
      {
        src: images.diaper,
        alt: 'Ivory reusable baby diaper with leaf print and sage snap fasteners',
      },
      { src: images.hero, alt: 'Reusable diaper beside folded muslin and a knitted rabbit' },
    ],
    colors: [botanical, sage],
    sizes: ['Adjustable'],
    details: [
      'One washable diaper and one jumbo insert',
      'Adjustable snap fastening',
      'Up to 8-hour use varies with fit and wetness. Check regularly and change whenever needed.',
    ],
    care: washCare,
    fit: 'Adjust the snaps for a snug, comfortable fit without tight marks. Ask our team to help check the fit for your little one.',
  },
  {
    id: 'reusable-cloth-menstrual-pads',
    name: 'Reusable Washable Cloth Menstrual Heavy Duty Pads',
    shortName: 'Reusable Cloth Menstrual Pads',
    category: 'Women',
    price: 200,
    oldPrice: 300,
    description:
      'Soft, washable cloth pads for a more considered period routine. A practical everyday design with wings that fasten around your underwear.',
    images: [
      { src: images.pads, alt: 'Clean botanical reusable cloth menstrual pads with snap wings' },
      { src: images.padDetail, alt: 'A closer view of the cloth pad stitching and fabric texture' },
    ],
    colors: [botanical, rose],
    sizes: ['One size'],
    details: ['Heavy-duty reusable cloth design', 'Snap-around wings', 'One washable pad per item'],
    care: washCare,
    fit: 'The wings fasten around the gusset of your underwear. Contact us for current pad measurements and help deciding if this style suits your routine.',
  },
  {
    id: 'ultra-soft-period-panty',
    name: 'Period Panty, Women Ultra Soft Underwear',
    shortName: 'Ultra Soft Period Underwear',
    category: 'Women',
    price: 800,
    oldPrice: 1600,
    description:
      'Everyday softness, with a little extra reassurance. Comfortable, washable period underwear designed to become part of your personal care routine.',
    images: [
      {
        src: images.underwear,
        alt: 'Unworn dusty rose cotton period underwear laid flat on linen',
      },
      {
        src: images.underwearDetail,
        alt: 'Close-up of the soft rose fabric and waistband stitching',
      },
    ],
    colors: [rose, { name: 'Clay', hex: '#ad806d' }],
    sizes: ['S', 'M', 'L', 'XL'],
    details: ['Soft, comfortable waistband', 'Washable and reusable', 'One pair per item'],
    care: washCare,
    fit: 'Measure around the fullest part of your hips and your natural waist. Send both measurements to our team for help choosing your size.',
  },
  {
    id: 'waterproof-pillow-protectors',
    name: 'Waterproof Pillow Protector Covers, Queen size, 2 pack',
    shortName: 'Waterproof Pillow Protectors, 2 Pack',
    category: 'Bedding',
    price: 600,
    oldPrice: 1200,
    description:
      'An extra layer of everyday care for your pillows. These soft waterproof protectors slip beneath your pillowcases for a fresh, comfortable bed.',
    images: [
      { src: images.pillow, alt: 'Ivory queen pillows with folded waterproof protector covers' },
      { src: images.bedding, alt: 'A pair of cream pillows on a softly sunlit linen bed' },
    ],
    colors: [cream],
    sizes: ['Queen'],
    details: [
      'Set of two pillow protector covers',
      'Queen size',
      'Waterproof protection beneath your pillowcase; pillows not included',
    ],
    care: 'Wash gently according to the care label. Avoid bleach, high heat, and ironing the waterproof layer. Air-dry before use.',
    fit: 'Designed for queen-size pillows. Send your pillow length and width to our team to confirm the fit before ordering.',
  },
];

export const findProduct = (id: string) => products.find((product) => product.id === id);

export function searchProducts(query: string) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    const text = `${p.name} ${p.shortName} ${p.category} ${p.description}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
}
