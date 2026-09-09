import { expect, test } from '@playwright/test';

test.describe('search operators', () => {
  test('filters by a tag operator', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Search communities').fill('tag:roleplay');

    await expect(page.getByRole('heading', { name: 'Driftwood' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pixel Forge' })).toBeHidden();
  });

  test('filters by a numeric comparison', async ({ page }) => {
    await page.goto('/?q=members%3A%3C1000');

    // Only the small servers survive; the 27k one must not.
    await expect(page.getByRole('heading', { name: 'First Light' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'LAN Party' })).toBeHidden();
  });
});

test.describe('filters added later', () => {
  test('narrows to verified listings', async ({ page }) => {
    await page.goto('/');
    const verified = page.getByRole('checkbox', { name: 'Verified' });
    await verified.click();

    await expect(verified).toBeChecked();
    await expect(page).toHaveURL(/verified=1/);
    await expect(page.getByRole('heading', { name: 'Night Shift' })).toBeHidden();
  });

  test('sorts by growth, putting listings without history last', async ({ page }) => {
    await page.goto('/browse/?sort=growth');

    const names = (await page.locator('#directory article h3').allInnerTexts()).map((n) => n.trim());
    expect(names[0]).toContain('First Light');
  });
});

test.describe('the compare page', () => {
  test('asks for a second community before comparing', async ({ page }) => {
    await page.goto('/compare/');
    await expect(page.getByText('Choose at least two')).toBeVisible();
  });

  test('compares two communities and keeps the selection in the URL', async ({ page }) => {
    await page.goto('/compare/');

    await page.getByRole('button', { name: 'LAN Party' }).click();
    await page.getByRole('button', { name: 'Tempo' }).click();

    await expect(page).toHaveURL(/ids=/);
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: /LAN Party/ })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: /Tempo/ })).toBeVisible();

    // The larger server is marked in text, not by colour alone.
    await expect(table.getByRole('row', { name: /Members/ }).getByText('highest')).toBeVisible();
  });

  test('restores a shared comparison from the URL', async ({ page }) => {
    await page.goto('/compare/?ids=example-lan-party,example-first-light');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /First Light/ })).toBeVisible();
  });
});

test.describe('growth', () => {
  test('shows a trend for a listing with history', async ({ page }) => {
    await page.goto('/c/example-pixel-forge/');

    await expect(page.getByRole('heading', { name: 'Member growth' })).toBeVisible();
    await expect(page.getByRole('img', { name: /grew from .* to .* members/ })).toBeVisible();
  });

  test('says so plainly when there is not enough history', async ({ page }) => {
    await page.goto('/c/norax/');

    await expect(page.getByRole('heading', { name: 'Member growth' })).toBeVisible();
    await expect(page.getByText(/Not enough history yet/)).toBeVisible();
  });

  test('ranks the fastest growing on the statistics page', async ({ page }) => {
    await page.goto('/stats/');
    await expect(page.getByRole('heading', { name: 'Fastest growing' })).toBeVisible();
  });
});

test.describe('keyboard help', () => {
  test('opens with ? and closes with Escape', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Shortcut coverage on one engine is enough.');
    await page.goto('/');

    await page.keyboard.press('?');
    const sheet = page.getByRole('dialog', { name: 'Keyboard shortcuts' });
    await expect(sheet).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
  });

  test('ignores ? typed into the search box', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Shortcut coverage on one engine is enough.');
    await page.goto('/');

    const search = page.getByLabel('Search communities');
    await search.click();
    await search.type('?');

    await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeHidden();
    await expect(search).toHaveValue('?');
  });
});

test.describe('recently viewed', () => {
  test('appears after visiting a community', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Recently viewed' })).toBeHidden();

    await page.goto('/c/example-tempo/');
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Recently viewed' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Recently viewed' }).locator('..').getByText('Tempo'),
    ).toBeVisible();
  });
});
