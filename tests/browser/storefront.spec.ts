import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { products } from '../../src/data/products';
import { createOrderHandler } from '../../api/order.js';

test('homepage, collection navigation, price sorting, search, and FAQ', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Premium Care for');
  await page.getByRole('link', { name: 'Shop Now', exact: true }).click();
  await expect(page.locator('.product-tile')).toHaveCount(5);
  await page.getByRole('button', { name: 'Women', exact: true }).click();
  await expect(page.locator('.product-tile')).toHaveCount(2);
  await page.getByRole('combobox', { name: 'Sort by' }).selectOption('price-desc');
  await expect(page.locator('.product-tile').first()).toContainText('Ultra Soft Period Underwear');
  await page.getByRole('button', { name: 'Search products', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search products' }).fill('pillow');
  await expect(page.locator('.search-matches a')).toHaveCount(1);
  await page.locator('.search-matches a').click();
  await expect(page).toHaveURL(/waterproof-pillow-protectors/);
  await page.goto('/');
  await page.getByText('How do I wash my reusable essentials?', { exact: true }).click();
  await expect(page.locator('.faq-list details[open]')).toContainText('Rinse used items first');
  const quote = await page.locator('blockquote').innerText();
  await page.getByRole('button', { name: 'Next sample review' }).click();
  await expect(page.locator('blockquote')).not.toHaveText(quote);
});

test('variants, gallery, cart drawer, shipping progress, persistence, removal', async ({
  page,
}) => {
  await page.goto(`/product/${products[0].id}`);
  await page.getByRole('button', { name: 'View image 2:', exact: false }).click();
  await expect(page.locator('.gallery-main>img')).toHaveAttribute('src', products[0].images[1].src);
  await page.getByRole('button', { name: 'Size & fit guide' }).click();
  await expect(page.getByRole('dialog')).toContainText('waist');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Sage', exact: true }).click();
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toContainText('M / Sage');
  await drawer.getByRole('button', { name: /Increase quantity of/ }).click({ clickCount: 2 });
  await expect(drawer).toContainText('Your order qualifies for free shipping.');
  await drawer.getByRole('link', { name: 'View full cart' }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await page.reload();
  await expect(page.locator('.grand-total')).toContainText('Rs 2,550');
  await page.getByRole('button', { name: /Decrease quantity of/ }).click();
  await expect(page.locator('.grand-total')).toContainText('Rs 1,900');
  await page
    .getByRole('button', { name: 'Remove Reusable Potty Trainer Nappi', exact: true })
    .click();
  await expect(page.getByText('A little room for comfort.')).toBeVisible();
});

test('COD form validation, genuine service error, safe retry, and confirmed receipt', async ({
  page,
}) => {
  await page.goto(`/product/${products[2].id}`);
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
  await page.getByRole('button', { name: /Place COD Order/ }).click();
  await expect(page.getByText('Enter your full name (2 to 90 characters).')).toBeVisible();
  await page.getByLabel('Full name', { exact: true }).fill('Test Shopper');
  await page.getByLabel('Phone number', { exact: true }).fill('0300 1234567');
  await page
    .getByLabel('Full address', { exact: true })
    .fill('Test house, example street, city centre');
  await page.getByLabel('City', { exact: true }).fill('Lahore');
  await page.getByRole('button', { name: /Place COD Order/ }).click();
  await expect(page.getByRole('alert')).toContainText('Online ordering is temporarily unavailable');
  await expect(page.getByRole('button', { name: 'Open cart, 1 item' })).toBeVisible();

  // The full order handler runs; only outbound email delivery is replaced for this test.
  const handler = createOrderHandler({
    env: {
      RESEND_API_KEY: 'test-only',
      ORDER_TO_EMAIL: 'owner@example.test',
      ORDER_FROM_EMAIL: 'store@example.test',
    },
    deliver: async () => ({ data: { id: 'test-mail' }, error: null }),
  });
  await page.route('**/api/order', async (route) => {
    const request = route.request();
    let code = 200;
    let data: unknown;
    const res = {
      setHeader() {},
      status(n: number) {
        code = n;
        return this;
      },
      json(v: unknown) {
        data = v;
      },
    };
    await new Promise((resolve) => setTimeout(resolve, 250));
    await handler(
      { method: request.method(), headers: request.headers(), body: request.postDataJSON() },
      res,
    );
    await route.fulfill({
      status: code,
      contentType: 'application/json',
      body: JSON.stringify(data),
    });
  });
  await page.getByRole('button', { name: /Place COD Order/ }).click();
  await expect(page.getByRole('button', { name: 'Placing your order...' })).toBeDisabled();
  await expect(page).toHaveURL(/order-success/);
  await expect(page.locator('.receipt-heading strong')).toHaveText(/^ZL-[A-F0-9]{8}$/);
  await expect(page.locator('.grand-total')).toContainText('Rs 400');
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.receipt')).toBeVisible();
  await page.locator('.success-links').getByRole('link', { name: 'Track Order' }).click();
  await expect(page.getByLabel('Order number', { exact: true })).toHaveValue(/^ZL-/);
  await page.getByLabel('Phone number', { exact: true }).fill('+92 300 1234567');
  await page.getByRole('button', { name: 'Check order', exact: true }).click();
  await expect(page.locator('.tracking-result')).toContainText('Tracking is handled personally');
  await expect(page.getByRole('link', { name: 'Ask for an order update' })).toHaveAttribute(
    'href',
    /^https:\/\/wa.me\/923202406782/,
  );
});

test('mobile navigation, searchable catalog, and no horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Bedding', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bedding');
  await expect(page.locator('.product-tile')).toHaveCount(1);
  await page.goto('/shop?q=unmatched-item');
  await expect(page.getByRole('heading', { name: 'No products found' })).toBeVisible();
  await page.getByRole('link', { name: 'Clear filters' }).click();
  await expect(page.locator('.product-tile')).toHaveCount(5);
  for (const path of [
    '/',
    '/shop',
    `/product/${products[1].id}`,
    '/cart',
    '/checkout',
    '/track-order',
    '/about',
    '/contact',
    '/refunds-returns',
    '/privacy-policy',
    '/order-success',
    '/missing-page',
  ]) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      path,
    ).toBe(true);
  }
});

test('accessible homepage, product selections, and cart dialog', async ({ page }) => {
  for (const path of ['/', `/product/${products[0].id}`]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
      path,
    ).toEqual([]);
  }
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
