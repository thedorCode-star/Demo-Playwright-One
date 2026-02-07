// @ts-check
const { test, expect } = require('@playwright/test');

const VALID_CREDENTIALS = { username: 'testuser', password: 'Test123!' };
const INVALID_CREDENTIALS = { username: 'wronguser', password: 'WrongPass1!' };
const LOCKED_CREDENTIALS = { username: 'locked', password: 'Locked123!' };

test.describe('Login Page - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form with required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    const usernameInput = page.locator('#username');
    const passwordInput = page.locator('#password');
    await expect(usernameInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('valid login flow - should redirect to dashboard on correct credentials', async ({ page }) => {
    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(VALID_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('You have successfully logged in.')).toBeVisible();
  });

  test('invalid login flow - should show error message for wrong credentials', async ({ page }) => {
    await page.getByLabel('Username').fill(INVALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(INVALID_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('alert')).toContainText('Invalid username or password');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('invalid login flow - should show error for empty credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByLabel('Username')).toBeFocused();
    await expect(page).toHaveURL(/\/login/);
  });

  test('invalid login flow - should show error for locked account', async ({ page }) => {
    await page.getByLabel('Username').fill(LOCKED_CREDENTIALS.username);
    await page.getByLabel('Password').fill(LOCKED_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('alert')).toContainText('Account is locked');
  });

  test('valid login flow - should persist on page reload from dashboard', async ({ page }) => {
    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(VALID_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
