import { renderToString } from 'react-dom/server';

import { App } from '../../src/App';
import {
  addToBag,
  filterProducts,
  getBagCount,
  getBagSubtotal,
  products,
  updateBagQuantity
} from '../../src/storefront';

describe('storefront', () => {
  it('renders a browsable collection with accessible primary controls', () => {
    const html = renderToString(<App />);

    expect(html).toContain('Make room for better things.');
    expect(html).toContain('Search the collection');
    expect(html).toContain('Shopping bag, 0 items');
    expect(html).toContain('Filter products by category');
    expect(html).toContain('Add Arc table lamp to bag');
    expect(html).toContain('Fieldwork mug');
    expect(html).toContain('Skip to content');
  });

  it('keeps the optional custom hero title', () => {
    expect(renderToString(<App title="Made with a little care." />)).toContain(
      'Made with a little care.'
    );
  });

  it('filters the local catalogue by category and search text', () => {
    expect(filterProducts(products, 'Home', '').map((product) => product.id)).toEqual([
      'arc-lamp',
      'linen-throw'
    ]);
    expect(filterProducts(products, 'All', 'stoneware').map((product) => product.id)).toEqual([
      'field-mug'
    ]);
    expect(filterProducts(products, 'Wear', 'stoneware')).toEqual([]);
  });

  it('adds bag items, adjusts quantities, and calculates a subtotal', () => {
    const oneItem = addToBag({}, 'arc-lamp');
    const twoItems = addToBag(oneItem, 'arc-lamp');
    const mixedBag = addToBag(twoItems, 'field-mug');

    expect(getBagCount(mixedBag)).toBe(3);
    expect(getBagSubtotal(mixedBag)).toBe('$328');
    expect(updateBagQuantity(mixedBag, 'arc-lamp', -1)).toEqual({
      'arc-lamp': 1,
      'field-mug': 1
    });
    expect(updateBagQuantity({ 'field-mug': 1 }, 'field-mug', -1)).toEqual({});
  });
});
