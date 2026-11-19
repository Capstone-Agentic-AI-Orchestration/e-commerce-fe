export type ProductCategory = 'Home' | 'Objects' | 'Wear';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  priceLabel: string;
  image: string;
  imageAlt: string;
  imageTone: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 'arc-lamp',
    name: 'Arc table lamp',
    description: 'A softer kind of light',
    category: 'Home',
    price: 148,
    priceLabel: '$148',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Sculptural table lamp in a quiet, warm interior',
    imageTone: 'product-card__image-wrap--sand',
    badge: 'A good light'
  },
  {
    id: 'daily-tote',
    name: 'The daily tote',
    description: 'Room for the little things',
    category: 'Wear',
    price: 68,
    priceLabel: '$68',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Structured leather everyday bag in a warm neutral shade',
    imageTone: 'product-card__image-wrap--peach',
    badge: 'Maker favourite'
  },
  {
    id: 'field-mug',
    name: 'Fieldwork mug',
    description: 'Hand-finished stoneware',
    category: 'Objects',
    price: 32,
    priceLabel: '$32',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Handmade ceramic cup on a light tabletop',
    imageTone: 'product-card__image-wrap--blue'
  },
  {
    id: 'linen-throw',
    name: 'Sunday linen throw',
    description: 'Belgian flax linen',
    category: 'Home',
    price: 126,
    priceLabel: '$126',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Soft linen textiles layered across a calm living room',
    imageTone: 'product-card__image-wrap--green'
  },
  {
    id: 'everyday-cap',
    name: 'Weekend cap',
    description: 'Organic cotton twill',
    category: 'Wear',
    price: 42,
    priceLabel: '$42',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Simple cotton cap in a natural color',
    imageTone: 'product-card__image-wrap--yellow'
  },
  {
    id: 'stone-tray',
    name: 'Pebble catchall',
    description: 'A home for small things',
    category: 'Objects',
    price: 54,
    priceLabel: '$54',
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Minimal ceramic object on a softly lit shelf',
    imageTone: 'product-card__image-wrap--lavender'
  }
];

export function filterProducts(
  catalog: readonly Product[],
  category: 'All' | ProductCategory,
  searchTerm: string
): Product[] {
  const normalizedQuery = searchTerm.trim().toLocaleLowerCase();

  return catalog.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    const searchableText = `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase();
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
}

export function addToBag(
  bag: Readonly<Record<string, number>>,
  productId: string
): Record<string, number> {
  return { ...bag, [productId]: (bag[productId] ?? 0) + 1 };
}

export function updateBagQuantity(
  bag: Readonly<Record<string, number>>,
  productId: string,
  change: number
): Record<string, number> {
  const nextQuantity = (bag[productId] ?? 0) + change;
  if (nextQuantity > 0) return { ...bag, [productId]: nextQuantity };

  const remainingItems = { ...bag };
  delete remainingItems[productId];
  return remainingItems;
}

export function getBagCount(bag: Readonly<Record<string, number>>): number {
  return Object.values(bag).reduce((total, quantity) => total + quantity, 0);
}

export function getBagSubtotal(
  bag: Readonly<Record<string, number>>,
  catalog: readonly Product[] = products
): string {
  const cents = catalog.reduce((sum, product) => sum + product.price * (bag[product.id] ?? 0), 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(cents);
}
