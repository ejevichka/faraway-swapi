import { test, expect } from '@playwright/test';

test.describe('TokenList Component', () => {
  test.beforeEach(async ({ page }) => {
    const data = [
      { chainId: 1, chainType: 'EVM', coinKey: 'ETH', name: 'Ethereum', address: '0x1', logoURI: '/eth-logo.png' },
      { chainId: 100, chainType: 'EVM', coinKey: 'DAI', name: 'MakerDAO', address: '0x2', logoURI: '/dai-logo.png' },
      { chainId: 137, chainType: 'EVM', coinKey: 'MATIC', name: 'Polygon', address: '0x3', logoURI: '/matic-logo.png' },
      { chainId: 137, chainType: 'EVM', coinKey: 'UNI', name: 'Uniswap', address: '0x4', logoURI: '/uni-logo.png' },
      { chainId: 2, chainType: 'SVM', coinKey: 'SOL', name: 'Solana', address: '0x5', logoURI: '/sol-logo.png' },
    ];

    await page.route('**/api/tokens', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    });

    await page.route('**/api/cache', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ favoriteTokens: ['0x1', '0x2'] }),
      });
    });

    await page.goto('/');
  });

  test('should render TokenList component', async ({ page }) => {

    await expect(page.locator('[data-testid="chain-id-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="chain-type-select"]')).toBeVisible();
  });

  test('should filter tokens by chainId', async ({ page }) => {
    await page.selectOption('[data-testid="chain-id-select"]', '1');
    await page.waitForSelector('[data-testid="token-row-0x1"]');
    await expect(page.locator('[data-testid="token-row-0x1"]')).toBeVisible();
    await expect(page.locator('[data-testid="token-row-0x2"]')).not.toBeVisible();
  });

  test('should filter tokens by chainType', async ({ page }) => {
    await page.selectOption('[data-testid="chain-type-select"]', 'SVM');
    await page.waitForSelector('[data-testid="token-row-0x5"]');
    await expect(page.locator('[data-testid="token-row-0x5"]')).toBeVisible();
    await expect(page.locator('[data-testid="token-row-0x1"]')).not.toBeVisible();
  });

  test('should prioritize favorite tokens', async ({ page }) => {
    await page.waitForSelector('.token-row');
    const firstToken = await page.locator('.token-row').first().textContent();
    expect(firstToken).toContain('Ethereum');
    const secondToken = await page.locator('.token-row').nth(1).textContent();
    expect(secondToken).toContain('MakerDAO');
  });

  test('should navigate to token detail page on link click', async ({ page }) => {
    await page.click('[data-testid="token-row-0x1"] a');
    await expect(page).toHaveURL('/token/1/0x1');
  });
});
