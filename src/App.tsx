import { useState, type KeyboardEvent } from 'react';

import {
  addToBag,
  filterProducts,
  getBagCount,
  getBagSubtotal,
  products,
  updateBagQuantity,
  type Product,
  type ProductCategory
} from './storefront';

export interface AppProps {
  title?: string;
}

const categoryFilters: Array<'All' | ProductCategory> = ['All', 'Home', 'Objects', 'Wear'];

function ProductCard({
  product,
  onAdd
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <article className="product-card">
      <div className={`product-card__image-wrap ${product.imageTone}`}>
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        <img alt={product.imageAlt} className="product-card__image" loading="lazy" src={product.image} />
        <button
          aria-label={`Add ${product.name} to bag`}
          className="product-card__add"
          onClick={() => onAdd(product)}
          type="button"
        >
          <span aria-hidden="true">+</span>
          <span>Add to bag</span>
        </button>
      </div>
      <div className="product-card__details">
        <div>
          <h3>{product.name}</h3>
          <p>{product.category} · {product.description}</p>
        </div>
        <span className="product-card__price">{product.priceLabel}</span>
      </div>
    </article>
  );
}

export function App({ title = 'Make room for better things.' }: AppProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [bag, setBag] = useState<Record<string, number>>({});
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const visibleProducts = filterProducts(products, selectedCategory, searchTerm);
  const bagCount = getBagCount(bag);
  const bagProducts = products.filter((product) => (bag[product.id] ?? 0) > 0);
  const subtotal = getBagSubtotal(bag);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && isBagOpen) setIsBagOpen(false);
  }

  function handleAdd(product: Product) {
    setBag((current) => addToBag(current, product.id));
    setAnnouncement(`${product.name} added to your bag.`);
  }

  function handleQuantityChange(product: Product, amount: number) {
    setBag((current) => updateBagQuantity(current, product.id, amount));
  }

  function resetFilters() {
    setSelectedCategory('All');
    setSearchTerm('');
  }

  return (
    <div className="storefront" onKeyDown={handleKeyDown}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement-bar">
        <span>Good things, made to stay.</span>
        <span className="announcement-bar__detail">Free shipping on orders over $75</span>
      </div>

      <header className="site-header">
        <a aria-label="Common Form home" className="brand" href="#top" id="top">
          <span aria-hidden="true" className="brand__mark">c.</span>
          <span className="brand__name">common form</span>
        </a>

        <nav aria-label="Main navigation" className="main-nav">
          <a href="#collection">Shop all</a>
          <a href="#our-story">Our point of view</a>
        </nav>

        <div className="header-actions">
          <label className="search-box">
            <span className="visually-hidden">Search the collection</span>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="10.8" cy="10.8" r="6.3" />
              <path d="m15.5 15.5 4.2 4.2" />
            </svg>
            <input
              aria-label="Search the collection"
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              placeholder="Find..."
              type="search"
              value={searchTerm}
            />
          </label>
          <button
            aria-controls="shopping-bag"
            aria-expanded={isBagOpen}
            aria-label={`Shopping bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
            className="bag-toggle"
            onClick={() => setIsBagOpen((open) => !open)}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M5.5 8.5h13l1 12h-15l1-12Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <span>Bag</span>
            <span aria-hidden="true" className="bag-toggle__count">{bagCount}</span>
          </button>
        </div>
      </header>

      <aside
        aria-label="Shopping bag"
        className="bag-panel"
        hidden={!isBagOpen}
        id="shopping-bag"
        role="region"
      >
        <div className="bag-panel__heading">
          <div>
            <span className="eyebrow">Your picks</span>
            <h2>Your bag <span>({bagCount})</span></h2>
          </div>
          <button aria-label="Close shopping bag" className="icon-button" onClick={() => setIsBagOpen(false)} type="button">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {bagProducts.length === 0 ? (
          <div className="bag-empty">
            <p>Your bag is taking a little breather.</p>
            <button className="text-button" onClick={() => setIsBagOpen(false)} type="button">
              Find something lovely <span aria-hidden="true">↗</span>
            </button>
          </div>
        ) : (
          <>
            <ul className="bag-list">
              {bagProducts.map((product) => (
                <li className="bag-item" key={product.id}>
                  <img alt="" src={product.image} />
                  <div className="bag-item__info">
                    <h3>{product.name}</h3>
                    <span>{product.priceLabel}</span>
                    <div aria-label={`${product.name} quantity`} className="quantity-control">
                      <button aria-label={`Remove one ${product.name}`} onClick={() => handleQuantityChange(product, -1)} type="button">−</button>
                      <span aria-live="polite">{bag[product.id]}</span>
                      <button aria-label={`Add one ${product.name}`} onClick={() => handleQuantityChange(product, 1)} type="button">+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bag-subtotal">
              <span>Subtotal</span>
              <strong>{subtotal}</strong>
            </div>
            <p className="bag-note">Shipping and any applicable taxes are calculated at checkout.</p>
            <button className="button button--dark bag-continue" onClick={() => setIsBagOpen(false)} type="button">
              Keep looking <span aria-hidden="true">↗</span>
            </button>
          </>
        )}
      </aside>

      <main id="main-content">
        <section aria-labelledby="hero-title" className="hero">
          <div className="hero__copy">
            <span className="eyebrow"><span className="eyebrow__dot" /> Considered goods for everyday</span>
            <h1 id="hero-title">{title}</h1>
            <p>Useful, beautiful things from independent makers. Chosen with care, made for the long run.</p>
            <a className="button button--dark" href="#collection">
              Explore the collection <span aria-hidden="true">↘</span>
            </a>
            <div className="hero__footnote">
              <span className="hero__asterisk" aria-hidden="true">✳</span>
              <span>Small makers. Thoughtful materials.<br />A little more meaning in the everyday.</span>
            </div>
          </div>
          <div className="hero__visual">
            <img
              alt="Sunlit, thoughtfully furnished living space in warm natural tones"
              className="hero__image"
              fetchPriority="high"
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
            />
            <div className="hero-stamp">
              <span aria-hidden="true">✳</span>
              <span>MADE FOR<br />THE EVERYDAY</span>
            </div>
            <div className="hero-caption">
              <span>01 — The slower home</span>
              <span>Pieces that feel like yours.</span>
            </div>
          </div>
          <span aria-hidden="true" className="hero__side-note">LIVE WITH LESS, LOVE IT MORE</span>
        </section>

        <section aria-labelledby="collection-title" className="collection" id="collection">
          <div className="collection__intro">
            <div>
              <span className="eyebrow">The good stuff</span>
              <h2 id="collection-title">Find your everyday favourite.</h2>
            </div>
            <p>Objects with a point of view, a purpose, and a place in your home.</p>
          </div>

          <div className="collection__toolbar">
            <div aria-label="Filter products by category" className="category-filters" role="group">
              {categoryFilters.map((category) => (
                <button
                  aria-pressed={selectedCategory === category}
                  className={selectedCategory === category ? 'filter-button is-active' : 'filter-button'}
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                >
                  {category === 'All' ? 'Everything' : category}
                </button>
              ))}
            </div>
            <span aria-live="polite" className="collection__count">
              {visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} onAdd={handleAdd} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <span aria-hidden="true">⌕</span>
              <h3>No finds this time.</h3>
              <p>Try another search or take a look at everything we have.</p>
              <button className="text-button" onClick={resetFilters} type="button">
                Clear search and filters <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}
        </section>

        <section aria-labelledby="story-title" className="story" id="our-story">
          <span aria-hidden="true" className="story__spark">✳</span>
          <div>
            <span className="eyebrow">A little more considered</span>
            <h2 id="story-title">Less, but better.<br />And better for longer.</h2>
          </div>
          <p>We look for makers who care about the details: the feel of a material, the usefulness of a shape, and the life a piece will have with you.</p>
          <a className="text-button" href="#collection">Get to know the collection <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer className="site-footer">
        <a aria-label="Common Form, back to top" className="brand brand--footer" href="#top">
          <span aria-hidden="true" className="brand__mark">c.</span>
          <span className="brand__name">common form</span>
        </a>
        <p>Made for the everyday, by people who care.</p>
        <span>© Common Form</span>
      </footer>
      <span aria-live="polite" className="visually-hidden">{announcement}</span>
    </div>
  );
}
