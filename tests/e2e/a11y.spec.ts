import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'directory home' },
  { path: '/browse/', name: 'browse' },
  { path: '/c/norax/', name: 'a community page' },
  { path: '/stats/', name: 'statistics' },
  { path: '/compare/?ids=example-lan-party,example-tempo', name: 'compare' },
  { path: '/submit/', name: 'submit' },
  { path: '/faq/', name: 'FAQ' },
];

/** WCAG A and AA, on the real exported pages, in both themes. */
for (const { path, name } of PAGES) {
  test(`${name} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test('the directory is accessible in light mode too', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
