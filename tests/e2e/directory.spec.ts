import { expect, test } from '@playwright/test';

const PINNED = 'Norax';

test.describe('the directory', () => {
  test('shows the featured community above the grid', async ({ page }) => {
    await page.goto('/');

    const featured = page.getByRole('article').filter({ hasText: 'Featured community' });
    await expect(featured).toBeVisible();
    await expect(featured.getByRole('heading', { name: PINNED })).toBeVisible();
    await expect(featured.getByRole('link', { name: /Join/ })).toHaveAttribute(
      'href',
      'https://discord.gg/tgUbkdsCY',
    );
  });

  test('keeps the featured community visible while the grid is searched', async ({ page }) => {
    await page.goto('/');

    const search = page.getByLabel('Search communities');
    await search.fill('pixel');

    await expect(page.getByRole('heading', { name: 'Pixel Forge' })).toBeVisible();
    // The pin is not a search result — it stays put no matter what the grid is showing.
    await expect(page.getByText('Featured community')).toBeVisible();
    await expect(page).toHaveURL(/q=pixel/);
  });

  test('search state survives a reload, because it lives in the URL', async ({ page }) => {
    await page.goto('/?q=tempo');
    await expect(page.getByLabel('Search communities')).toHaveValue('tempo');
    await expect(page.getByRole('heading', { name: 'Tempo' })).toBeVisible();
  });

  test('shows an empty state when nothing matches, and recovers', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Search communities').fill('zzzznotathing');

    await expect(page.getByText('No communities match')).toBeVisible();

    await page.getByRole('button', { name: /Clear filters/ }).click();
    await expect(page.getByText('No communities match')).toBeHidden();
  });

  test('filters by category and reports the count', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Art', exact: true }).first().click();

    await expect(page).toHaveURL(/cat=Art/);
    await expect(page.getByRole('heading', { name: 'Pixel Forge' })).toBeVisible();
  });

  test('sorts the grid alphabetically', async ({ page }) => {
    await page.goto('/?sort=name');

    const headings = page.locator('#directory article h3');
    const names = await headings.allInnerTexts();
    const trimmed = names.map((name) => name.trim());
    expect(trimmed).toEqual([...trimmed].sort((a, b) => a.localeCompare(b)));
  });

  test('switches to the list view', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'List view' }).click();
    await expect(page).toHaveURL(/view=list/);
  });
});

test.describe('a community page', () => {
  test('opens from the grid and shows the listing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Night Shift' }).first().click();

    await expect(page).toHaveURL(/\/c\/example-night-shift/);
    await expect(page.getByRole('heading', { level: 1, name: 'Night Shift' })).toBeVisible();
    // Example listings carry no invite, so there is nothing to join.
    await expect(page.getByText('Example listing').first()).toBeVisible();
  });

  test('links the pinned community to Discord', async ({ page }) => {
    await page.goto('/c/norax/');

    await expect(page.getByRole('heading', { level: 1, name: PINNED })).toBeVisible();
    await expect(page.getByText('1,009')).toBeVisible();
    await expect(page.getByRole('link', { name: /Join/ }).first()).toHaveAttribute(
      'href',
      'https://discord.gg/tgUbkdsCY',
    );
  });

  test('reaches tag and category pages from the listing', async ({ page }) => {
    await page.goto('/c/norax/');
    await page.getByRole('link', { name: 'Hangout' }).first().click();

    await expect(page).toHaveURL(/\/tag\/hangout/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hangout');
  });
});

test.describe('site behaviour', () => {
  test('opens the command palette with the keyboard', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Shortcut coverage on one engine is enough.');
    await page.goto('/');

    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: /Search communities and pages/ });
    await expect(dialog).toBeVisible();

    await dialog.getByRole('combobox').or(dialog.getByLabel('Search communities and pages')).fill('tempo');
    await expect(dialog.getByRole('option').first()).toContainText('Tempo');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('toggles the theme and remembers it', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /theme/i });

    // The control cycles system -> light -> dark, and "system" resolves to light in a
    // default browser, so click until dark is explicitly selected.
    for (let i = 0; i < 3 && (await html.getAttribute('data-theme')) !== 'dark'; i += 1) {
      await toggle.click();
    }
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('saves a community to the local list', async ({ page }) => {
    await page.goto('/');

    // Save from the grid, not the featured slot: the pinned community is deliberately
    // not part of the grid, so saving it would filter the grid down to nothing.
    await page.locator('#directory').getByRole('button', { name: /^Save / }).first().click();

    // The filter checkboxes are controlled by URL state, which lands a frame after the
    // click, so click and poll rather than using check() — that asserts synchronously.
    const savedOnly = page.getByRole('checkbox', { name: /Saved/ });
    await savedOnly.click();

    await expect(savedOnly).toBeChecked();
    await expect(page).toHaveURL(/saved=1/);
    await expect(page.locator('#directory article')).toHaveCount(1);
  });

  test('serves a 404 page for an unknown listing', async ({ page }) => {
    const response = await page.goto('/c/not-a-real-community/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /does not exist/i })).toBeVisible();
  });
});
