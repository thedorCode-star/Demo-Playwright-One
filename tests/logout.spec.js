// @ts-check
const { test, expect } = require('@playwright/test');

const VALID_CREDENTIALS = { username: 'testuser', password: 'Test123!' };

test.describe('Logout - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(VALID_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should redirect to login page when clicking Sign out', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign out' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should display login form after logout', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign out' }).click();

    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Username')).toHaveValue('');
    await expect(page.getByLabel('Password')).toHaveValue('');
  });

  test('should allow login again after logout', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(VALID_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
