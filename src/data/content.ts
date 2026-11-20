import { images, money, shippingPolicy } from './products.ts';
import type { Category } from './products.ts';

export const brand = {
  name: 'Zaarilux',
  tagline: 'Comfort, care & confidence.',
  description: 'Thoughtful, reusable essentials for babies, women, and the spaces we call home.',
  phone: '+92 320 2406782',
  whatsapp: '923202406782',
  email: 'zariluxgarment@gmail.com',
  website: 'https://zaarilux.com',
  country: 'Pakistan',
};

export const whatsappUrl = (
  message = 'Hello Zaarilux! I would like some help with your products.',
) => `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;

export const nav = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Baby', path: '/shop?category=Baby' },
  { label: 'Women', path: '/shop?category=Women' },
  { label: 'Track Order', path: '/track-order' },
];

export const collections: {
  category: Category;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  intro: string;
}[] = [
  {
    category: 'Baby',
    title: 'Baby Care',
    subtitle: 'For your little one',
    image: images.baby,
    alt: 'Soft botanical baby nappies on a sage linen surface',
    intro: 'Little essentials for changing days and growing independence.',
  },
  {
    category: 'Women',
    title: "Women's Care",
    subtitle: 'Comfort, every day',
    image: images.women,
    alt: 'Folded dusty rose reusable period essentials',
    intro: 'Soft, reusable period essentials for your own rhythm.',
  },
  {
    category: 'Bedding',
    title: 'Bedding',
    subtitle: 'A softer space',
    image: images.bedding,
    alt: 'Ivory pillows and folded protectors on a linen bed',
    intro: 'Considered layers of comfort for a fresher, softer home.',
  },
];

export const home = {
  announcement: `Free shipping on orders above ${money(shippingPolicy.freeAt)}`,
  heroEyebrow: 'THE ZAARILUX COLLECTION',
  heroLines: ['Premium Care for', 'Babies & Women,'],
  heroItalic: 'Made with Comfort in Mind.',
  heroBody:
    'Soft, reusable essentials for your little one, yourself, and your home. Thoughtfully made for everyday life.',
  heroAlt:
    'A leaf-print reusable diaper, soft sage linens, and a knitted rabbit in warm morning light',
  shopNow: 'Shop Now',
  trust: [
    { title: 'Free Shipping', text: `On orders over ${money(shippingPolicy.freeAt)}` },
    { title: 'Cash on Delivery', text: 'Pay when you receive' },
    { title: 'Easy Returns', text: 'Here to help you' },
    { title: 'Soft & Skin-Safe', text: 'Gentle on delicate skin' },
  ],
  categoryHeading: 'Shop by Category',
  categoryEyebrow: 'FIND YOUR ESSENTIALS',
  exploreAll: 'Explore all',
  saleEyebrow: 'THE EVERYDAY EDIT',
  saleHeading: 'Everyday Favourites',
  viewShop: 'Shop all products',
  whyEyebrow: 'WHY ZAARILUX',
  whyHeading: 'Little choices. Lasting care.',
  why: [
    { title: 'Made to reuse', body: 'Wash, dry, and reach for your favourites again.' },
    { title: 'Less waste', body: 'Choose reusable care over single-use alternatives.' },
    { title: 'Everyday value', body: 'Buy thoughtfully and make the most of every use.' },
    { title: 'Gentle by nature', body: 'Soft fabrics, chosen with delicate skin in mind.' },
  ],
  storyEyebrow: 'OUR STORY',
  storyHeading: 'Care in the little things.',
  storyBody:
    'At Zaarilux, we believe everyday care should feel simple. We bring together soft, reusable essentials for the women, little ones, and homes we love.',
  storyLink: 'Get to know Zaarilux',
  storyAlt: 'Hands carefully folding soft sage fabric beside a stack of natural textiles',
  reviewsEyebrow: 'CUSTOMER REVIEWS',
  reviewsHeading: 'Everyday perspectives',
  sample: 'Sample review',
  sampleNote: 'Illustrative placeholders, not verified customer testimonials.',
  reviews: [
    'A soft, simple addition to our routine. I love being able to wash these little essentials and use them again.',
    'Comfort is what matters to me. A reusable option that fits into an ordinary wash day makes all the difference.',
  ],
  faqEyebrow: 'A LITTLE GUIDANCE',
  faqHeading: 'Frequently asked questions',
  helpHeading: 'A little help choosing?',
  helpBody: 'From finding the right fit to placing your order, we are a message away.',
  helpCta: 'Chat on WhatsApp',
};

export const faqs = [
  {
    question: 'How do I wash my reusable essentials?',
    answer:
      'Rinse used items first, then wash gently with a mild detergent. Skip fabric softener and bleach, and air-dry completely. Always follow the care label for your particular item.',
  },
  {
    question: 'How do I choose the right size?',
    answer:
      'Each product page lists the available sizes and fit guidance. If you are between sizes, send your measurements to our team on WhatsApp before ordering.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery time depends on your city and courier service. Our team will confirm availability and share an estimated delivery window by WhatsApp or phone before dispatch.',
  },
  {
    question: 'Can I return or exchange an item?',
    answer:
      'Contact us with your order number within 30 days to check eligibility. Eligible items must be unused and in their original packaging. Intimate and sanitary goods are excluded, and sale items are not refundable. See Refunds & Returns for details.',
  },
];

export const ui = {
  home: 'Home',
  about: 'About',
  aboutBrand: 'About Zaarilux',
  contact: 'Contact',
  track: 'Track Order',
  returns: 'Refunds & Returns',
  each: 'each',
  close: 'Close',
  menu: 'Open navigation',
  search: 'Search products',
  cart: 'Your Cart',
  backHome: 'Back to home',
  continueShopping: 'Continue shopping',
  shop: 'Shop',
  allProducts: 'All products',
  shopAll: 'Shop all essentials',
  sale: 'Sale',
  addToCart: 'Add to Cart',
  chooseOptions: 'Choose options',
  added: 'Added to your cart',
  colour: 'Colour',
  size: 'Size',
  quantity: 'Quantity',
  sizeGuide: 'Size & fit guide',
  remove: 'Remove',
  subtotal: 'Subtotal',
  shipping: 'Shipping',
  total: 'Total',
  free: 'Free',
  checkout: 'Checkout',
  checkoutCta: 'Proceed to Checkout',
  viewCart: 'View full cart',
  emptyTitle: 'A little room for comfort.',
  emptyCart:
    'Your cart is empty. Explore our reusable everyday essentials to find your favourites.',
  shippingUnlocked: 'Your order qualifies for free shipping.',
  shippingRemaining: (amount: number) => `You are ${money(amount)} away from free shipping.`,
  shippingNote: `Standard delivery is ${money(shippingPolicy.standard)}. Free on orders of ${money(shippingPolicy.freeAt)} or more.`,
  delivery: 'Delivery & returns',
  care: 'Washing & care',
  details: 'Product details',
  imageNote: 'Illustrative product photography. Colours and prints may vary.',
  whatsappOrder: 'Order on WhatsApp',
  talkFit: 'Ask about the fit',
  related: 'You may also like',
  summary: 'Order summary',
  cod: 'Cash on Delivery',
  searchTitle: 'Find your essentials',
  searchPlaceholder: 'Search diapers, period care, bedding...',
  searchEmpty: 'No essentials matched your search. Try another word, such as "baby" or "pads".',
  popularSearch: 'Explore our essentials',
  searchResults: 'Matching essentials',
  goResults: 'View search results',
  clear: 'Clear filters',
  shopHeading: 'Shop the Collection',
  shopIntro: 'Considered essentials for your little one, yourself, and your home.',
  shopEyebrow: 'ZAARILUX ESSENTIALS',
  sort: 'Sort by',
  featured: 'Featured',
  priceLow: 'Price: low to high',
  priceHigh: 'Price: high to low',
  chooseCollection: 'Filter by category',
  noProducts: 'No products found',
  productsCount: (n: number) => `${n} ${n === 1 ? 'essential' : 'essentials'}`,
  itemCount: (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`,
  skip: 'Skip to content',
  fitNote: 'A little guidance before you choose.',
  orderLimit: 'This item has reached the maximum quantity of 99.',
  lineLimit: 'Your cart has reached its limit. Please contact us for a larger order.',
  cartIntro: 'Your thoughtful choices, all in one place.',
  previous: 'Previous',
  next: 'Next',
  browsing: 'Collection',
};

export const checkoutCopy = {
  eyebrow: 'THE LAST LITTLE STEP',
  title: 'Checkout',
  intro: 'A few details, and we will take care of the rest.',
  contact: 'Your details',
  delivery: 'Delivery details',
  payment: 'Payment method',
  name: 'Full name',
  phone: 'Phone number',
  email: 'Email address',
  optional: 'optional',
  address: 'Full address',
  city: 'City',
  notes: 'Order notes',
  nameHint: 'Your first and last name',
  phoneHint: '03XX XXXXXXX',
  emailHint: 'you@example.com',
  addressHint: 'House or flat, street, area, and nearby landmark',
  cityHint: 'Your delivery city',
  notesHint: 'Anything we should know about your delivery?',
  paymentNote: 'Pay the courier in cash when your order arrives.',
  consent: 'Your details are used to fulfil this order, as explained in our',
  place: 'Place COD Order',
  placing: 'Placing your order...',
  privacy: 'Privacy Policy',
  error:
    'We could not send your order right now. Your cart is saved. Please try again or contact us on WhatsApp.',
  unavailable:
    'Online ordering is temporarily unavailable. Your cart is saved. Please try again later or order on WhatsApp.',
  network:
    'We could not reach the store. Please check your connection and try again. Your cart is saved.',
  validation: 'Please check the highlighted fields.',
  thanks: 'Thank you for your order.',
  successBody: 'Thank you, we will contact you shortly to confirm your details and delivery.',
  orderNumber: 'Order number',
  deliveryCity: 'Delivery city',
  amountDue: 'Due on delivery',
  honeypot: 'Leave this field empty',
  successEyebrow: 'ORDER RECEIVED',
  noReceipt: 'No recent order to display',
  noReceiptBody: 'If you have an order number, our team can help you check on your order.',
};

export const fieldErrors = {
  name: 'Enter your full name (2 to 90 characters).',
  phone: 'Enter a Pakistani mobile number, such as 0300 1234567 or +92 300 1234567.',
  email: 'Enter a valid email address, or leave it blank.',
  address: 'Enter a complete address (10 to 500 characters).',
  city: 'Enter your city (2 to 80 characters).',
  notes: 'Keep your notes under 1,000 characters.',
  orderNumber: 'Enter your order number in the format ZL-XXXXXX.',
};

export const orderMessages = {
  invalidField: 'An order field is invalid.',
  missingDetails: 'Please include your order and delivery details.',
  declined: 'This order could not be accepted.',
  payment: 'Only Cash on Delivery is available.',
  timestamp: 'Invalid order timestamp.',
  refresh: 'Please refresh checkout and try again.',
  lines: 'Your cart must contain between 1 and 30 selections.',
  item: 'An item in your cart is invalid.',
  unavailableItem: 'An item is no longer available. Please update your cart.',
  quantity: 'Please select a valid quantity.',
  variant: 'A selected size or colour is unavailable.',
  catalog: 'The catalog has changed. Please refresh and review your cart.',
  duplicate: 'Please combine duplicate cart selections.',
  totals: 'Your order total has changed. Please review your cart.',
  method: 'Use POST to place an order.',
  contentType: 'Use an application/json request.',
  size: 'The order is too large.',
  body: 'The order body is required.',
  json: 'The order must contain valid JSON.',
  unconfigured:
    'Online ordering is temporarily unavailable. Your cart is saved. Please contact us on WhatsApp.',
  busy: 'The store is receiving many orders. Please try again in a moment. Your cart is saved.',
  failed: 'We could not send your order to the store. Please try again. Your cart is saved.',
  service:
    'The order service is temporarily unavailable. Please try again later. Your cart is saved.',
};

export const emailCopy = {
  newOrder: 'New Cash on Delivery order',
  details: 'Delivery details',
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  address: 'Address',
  city: 'City',
  notes: 'Notes',
  timestamp: 'Placed at (UTC)',
  missing: 'Not provided',
  noNotes: 'None',
  item: 'Item',
  qty: 'Qty',
  price: 'Unit price',
  payment: 'Payment',
  due: 'Total due on delivery',
  instruction: 'Please contact the customer to confirm the order.',
  subject: (orderNumber: string) => `New COD order ${orderNumber} | ${brand.name}`,
};

export const chatMessages = {
  product: (name: string, qty: number, size: string, color: string, total: number) =>
    `Hello ${brand.name}! I would like to order ${qty} x ${name}. Size: ${size}. Colour: ${color}. Item total: ${money(total)} (before delivery). Please confirm availability and delivery.`,
  fit: (name: string) => `Hello ${brand.name}! Please help me choose a size for ${name}.`,
  tracking: (number: string, phone: string) =>
    `Hello ${brand.name}! Please help me track order ${number}. My order phone number is ${phone}.`,
  receipt: (number: string) => `Hello ${brand.name}! I have a question about order ${number}.`,
  cart: (
    items: { qty: number; name: string; size: string; color: string; unitPrice: number }[],
    shipping: number,
    total: number,
  ) =>
    `Hello ${brand.name}! I would like to place a COD order:\n${items.map((i) => `${i.qty} x ${i.name} (${i.size}, ${i.color}) - ${money(i.qty * i.unitPrice)}`).join('\n')}\nShipping: ${money(shipping)}. Total: ${money(total)}.`,
};

export const info = {
  about: {
    eyebrow: 'ABOUT ZAARILUX',
    title: 'Comfort, care & confidence.',
    intro: 'Thoughtful essentials. A gentler everyday.',
    body: [
      'Zaarilux is a Pakistani online store for the everyday care of babies, women, and the places they call home. Our collection brings together washable baby diapers, reusable period care, and practical bedding essentials.',
      'We choose products with a simple idea in mind: comfort should feel natural, and reusability should fit into real life. From the first nappy change to a fresh, comfortable bed, it is the little things that matter.',
      'Have a question about a size, a fabric, or your first reusable routine? Our team is here to help you choose with confidence.',
    ],
  },
  contact: {
    eyebrow: 'GET IN TOUCH',
    title: 'We are here to help.',
    intro: 'A question about fit, care, or an order? Talk to the Zaarilux team directly.',
    whatsapp: 'Message us',
    whatsappText: 'For product guidance and order updates, start a conversation on WhatsApp.',
    phone: 'Give us a call',
    phoneText: 'Keep your order number handy if you are calling about a delivery.',
    email: 'Write to us',
    emailText: 'For returns or a more detailed enquiry, send our team an email.',
  },
  tracking: {
    eyebrow: 'ORDER CARE',
    title: 'Track your order',
    intro: 'Enter your order details and we will help you find the latest update.',
    action: 'Check order',
    result: "Let's check on your order.",
    resultBody:
      'Tracking is handled personally by our team via WhatsApp or phone. Send the details below and we will check your delivery. This is not an automated status update.',
    chat: 'Ask for an order update',
    reset: 'Check another order',
    hint: 'ZL-XXXXXX',
  },
  returns: {
    eyebrow: 'CUSTOMER CARE',
    title: 'Refunds & Returns',
    intro: 'Clear guidance, so you know what to expect.',
    sections: [
      {
        title: 'Start with a conversation',
        body: 'Contact our team within 30 days of purchase with your order number and proof of purchase. Please wait for our return instructions before sending any item back.',
      },
      {
        title: 'Return eligibility',
        body: 'Eligible items must be unused, in their original condition, and in their original packaging. Intimate and sanitary goods are not accepted for return. Only regular-priced items are eligible for a refund; sale items are not refundable.',
      },
      {
        title: 'A wrong or damaged item',
        body: 'If your order arrives damaged or does not match what you ordered, contact us promptly with your order number and a clear photo. Our team will review the issue and explain the next steps.',
      },
      {
        title: 'Inspection and refunds',
        body: 'We will inspect eligible returned items and tell you whether your refund is approved. For Cash on Delivery orders, our team will agree on a suitable refund method with you. Do not share passwords, card PINs, or one-time codes.',
      },
      {
        title: 'Return delivery',
        body: 'Customers are responsible for return delivery costs unless our team confirms otherwise. Original shipping charges are not refundable. Contact us for the correct return address.',
      },
    ],
  },
  privacy: {
    eyebrow: 'YOUR PRIVACY',
    title: 'Privacy Policy',
    intro: 'How your information is used when you shop with Zaarilux.',
    sections: [
      {
        title: 'Information you share',
        body: 'When you place an order, we collect your name, phone number, delivery address, city, selected items, and any notes you provide. Your email address is optional. We do not collect card information because this store uses Cash on Delivery.',
      },
      {
        title: 'Fulfilling your order',
        body: 'We use these details to confirm your order, arrange delivery, respond to enquiries, and handle eligible returns. The information needed to deliver your parcel may be shared with our delivery partner.',
      },
      {
        title: 'Hosting and order email',
        body: 'The storefront is designed to be hosted on Vercel. Order notifications are sent to the store owner using Resend. These services process the information needed to host the store and deliver the order notification.',
      },
      {
        title: 'Storage on your device',
        body: 'Your cart is stored locally in your browser so it remains available when you return. A limited order receipt, without your full address or phone number, is kept for the current browser session. Clearing browser storage removes this information.',
      },
      {
        title: 'WhatsApp and external links',
        body: 'WhatsApp opens only when you choose a chat link. Review the prepared message before sending it. External services have their own privacy policies.',
      },
      {
        title: 'Your choices',
        body: 'To ask about your order data, request a correction, or discuss deletion subject to order and legal requirements, contact our team using the details below. We do not sell your personal information.',
      },
    ],
  },
  notFound: {
    eyebrow: 'PAGE NOT FOUND',
    title: 'A little off the path.',
    body: 'This page is not part of our collection. Let us help you find your way back.',
  },
};

export const footer = {
  shop: 'Explore',
  care: 'Customer care',
  contact: 'Get in touch',
  links: [
    { label: 'About Zaarilux', path: '/about' },
    { label: 'Contact us', path: '/contact' },
    { label: 'Track Order', path: '/track-order' },
  ],
  policies: [
    { label: 'Refunds & Returns', path: '/refunds-returns' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
  ],
  copyright: (year: number) => `\u00a9 ${year} Zaarilux. All rights reserved.`,
  bottom: 'Thoughtfully chosen for Pakistan.',
};
