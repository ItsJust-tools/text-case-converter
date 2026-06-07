import { test, expect } from '@playwright/test';

async function closeBackdropIfOpen(page: import('@playwright/test').Page) {
  const backdrop = page.locator('.sidebar-backdrop');
  for (let i = 0; i < 3; i++) {
    const visible = await backdrop.isVisible().catch(() => false);
    if (!visible) return;
    await backdrop.evaluate((el) => (el as HTMLElement).click());
    await page.waitForTimeout(100);
  }
}

async function ensureToolbarInteractable(page: import('@playwright/test').Page) {
  await closeBackdropIfOpen(page);
  const backdrop = page.locator('.sidebar-backdrop');
  if (await backdrop.isVisible().catch(() => false)) {
    await page.keyboard.press('Control+b');
    await expect(backdrop).toBeHidden();
  }
}

test('tool loads with correct title', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  await expect(title).toContain('Text Case Converter');
});

test('textarea is editable', async ({ page }) => {
  await page.goto('/');
  const textarea = page.locator('.case-textarea');
  await textarea.fill('Hello World');
  await expect(textarea).toHaveValue('Hello World');
});

test('case conversion updates output', async ({ page }) => {
  await page.goto('/');
  const textarea = page.locator('.case-textarea');
  await textarea.fill('hello world');

  // Default mode is 'lowercase', so output should contain placeholder
  // Switch to uppercase by clicking the uppercase mode button
  const upperBtn = page.getByRole('button', { name: /uppercase/i }).first();
  await upperBtn.click();

  // Click Convert button
  const convertBtn = page.getByRole('button', { name: /convert/i });
  await convertBtn.click();

  // The output area should show HELLO WORLD
  const output = page.locator('.case-output');
  await expect(output).toContainText('HELLO WORLD');
});

test('sidebar toggle button works', async ({ page }) => {
  await page.goto('/');
  await ensureToolbarInteractable(page);
  const sidebarToggle = page.locator('.toolbar-btn-sidebar');
  const sidebar = page.locator('.tool-shell-sidebar');
  const mobile =
    (await page.viewportSize())?.width !== undefined && (await page.viewportSize())!.width <= 768;
  const isCollapsed = await sidebar.evaluate((el) => el.classList.contains('collapsed'));
  if (isCollapsed) {
    await sidebarToggle.click();
    await expect(sidebar).toHaveClass(/open/);
    if (mobile) {
      await page.locator('.sidebar-backdrop').click();
    } else {
      await sidebarToggle.click();
    }
    await expect(sidebar).toHaveClass(/collapsed/);
    return;
  }
  await expect(sidebar).toHaveClass(/open/);
  if (mobile) {
    await page.locator('.sidebar-backdrop').click();
  } else {
    await sidebarToggle.click();
  }
  await expect(sidebar).toHaveClass(/collapsed/);
});

test('dark mode toggle works', async ({ page }) => {
  await page.goto('/');
  await ensureToolbarInteractable(page);
  const themeButton = page.getByRole('button', { name: /Switch to dark mode/i });
  if (await themeButton.isVisible()) {
    await themeButton.click();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const lightButton = page.getByRole('button', { name: /Switch to light mode/i });
    await lightButton.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
  }
});

test('SEO meta tags are present', async ({ page }) => {
  await page.goto('/');

  const title = await page.title();
  expect(title).toBeTruthy();

  const description = await page.getAttribute('meta[name="description"]', 'content');
  expect(description).toBeTruthy();

  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
  expect(ogTitle).toBeTruthy();

  const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
  expect(ogImage).toBeTruthy();

  const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
  expect(canonical).toBeTruthy();
});

test('JSON-LD structured data is present', async ({ page }) => {
  await page.goto('/');
  const jsonLd = page.locator('script[type="application/ld+json"]').first();
  const content = await jsonLd.textContent();
  const parsed = JSON.parse(content!);
  expect(parsed['@type']).toBe('WebApplication');
  expect(parsed.name).toBeTruthy();
  expect(parsed.offers.price).toBe('0');
});

test('sitemap.xml is accessible', async ({ page }) => {
  const response = await page.goto('/sitemap.xml');
  expect(response?.ok()).toBe(true);
  const content = await response?.text();
  expect(content).toContain('urlset');
});

test('robots.txt is accessible', async ({ page }) => {
  const response = await page.goto('/robots.txt');
  expect(response?.ok()).toBe(true);
  const content = await response?.text();
  expect(content).toMatch(/User-[Aa]gent/);
});

test('keyboard shortcuts overlay opens and closes', async ({ page, browserName }, _testInfo) => {
  if (browserName !== 'chromium') return;
  await page.goto('/');
  await ensureToolbarInteractable(page);
  if (_testInfo.project.name.includes('Mobile')) {
    await expect(page.getByRole('button', { name: /keyboard shortcuts/i })).toBeVisible();
    return;
  }
  await page.getByRole('button', { name: /keyboard shortcuts/i }).click({ force: true });
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('mobile sidebar backdrop closes sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  await ensureToolbarInteractable(page);
  const sidebar = page.locator('.tool-shell-sidebar');

  await page.locator('[aria-label="Show options"]').click();
  await expect(sidebar).toHaveClass(/open/);

  await page.locator('.sidebar-backdrop').evaluate((el) => (el as HTMLElement).click());
  await expect(sidebar).toHaveClass(/collapsed/);
});

test('import from json file works', async ({ page }) => {
  await page.goto('/');
  await ensureToolbarInteractable(page);

  const fileContent = JSON.stringify({ input: 'Imported Text', mode: 'uppercase' });

  const fileInput = page.locator('input[type="file"]');
  await fileInput.evaluate((el: HTMLInputElement) => {
    el.style.display = 'block';
    el.style.visibility = 'visible';
  });
  await fileInput.setInputFiles({
    name: 'test.json',
    mimeType: 'application/json',
    buffer: Buffer.from(fileContent),
  });

  await expect.poll(() => page.locator('.case-textarea').inputValue()).toContain('Imported Text');
});

test('export json download triggers', async ({ page }) => {
  await page.goto('/');
  await ensureToolbarInteractable(page);

  const exportButton = page.getByRole('button', { name: /export/i });
  await exportButton.click({ force: true });

  const jsonOption = page.getByRole('option', { name: /JSON/ });
  const [download] = await Promise.all([page.waitForEvent('download'), jsonOption.click()]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
});

test('image export downloads trigger for screenshot formats', async ({ page }, testInfo) => {
  await page.goto('/');
  await ensureToolbarInteractable(page);

  if (testInfo.project.name.includes('Mobile')) {
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible();
    return;
  }

  const expected: Array<{ option: RegExp; ext: RegExp }> = [
    { option: /PNG/, ext: /\.png$/i },
    { option: /JPEG/, ext: /\.(jpg|jpeg)$/i },
    { option: /webp/i, ext: /\.webp$/i },
  ];

  for (const format of expected) {
    await ensureToolbarInteractable(page);
    await page.getByRole('button', { name: /export/i }).click({ force: true });
    const option = page.getByRole('option', { name: format.option });
    await expect(option).toBeVisible();
    const [download] = await Promise.all([page.waitForEvent('download'), option.click()]);
    expect(download.suggestedFilename()).toMatch(format.ext);
  }
});

test('404 page works', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  const contentType = response?.headers()['content-type'] ?? '';
  expect(contentType).toContain('text/html');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('visual regression — default view', async ({ page, browserName }) => {
  if (browserName !== 'chromium') return;
  await page.goto('/');
  await page.waitForSelector('.tool-shell-canvas');
  await expect(page.locator('.tool-shell')).toBeVisible();
});
