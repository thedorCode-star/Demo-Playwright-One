// @ts-check
const { test, expect } = require('@playwright/test');

const VALID_CREDENTIALS = { username: 'testuser', password: 'Test123!' };

test.describe('Registration - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form with required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('valid registration flow - should redirect to login on success', async ({ page }) => {
    const uniqueUser = `newuser_${Date.now()}`;
    await page.getByLabel('Username').fill(uniqueUser);
    await page.getByLabel('Email').fill(`${uniqueUser}@example.com`);
    await page.getByLabel('Password').fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Password123!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('valid registration flow - new user can login after registration', async ({ page }) => {
    const uniqueUser = `reguser_${Date.now()}`;
    await page.getByLabel('Username').fill(uniqueUser);
    await page.getByLabel('Email').fill(`${uniqueUser}@example.com`);
    await page.getByLabel('Password').fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Password123!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel('Username').fill(uniqueUser);
    await page.getByLabel('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('invalid registration flow - should show error for duplicate username', async ({ page }) => {
    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Email').fill('new@example.com');
    await page.getByLabel('Password').fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Password123!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('alert')).toContainText('Username already exists');
  });

  test('invalid registration flow - should show error when passwords do not match', async ({ page }) => {
    await page.getByLabel('Username').fill('newuser');
    await page.getByLabel('Email').fill('new@example.com');
    await page.getByLabel('Password').fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Password456!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('alert')).toContainText('Passwords do not match');
  });

  test('invalid registration flow - should show error for short password', async ({ page }) => {
    await page.getByLabel('Username').fill('newuser');
    await page.getByLabel('Email').fill('new@example.com');
    await page.getByLabel('Password').fill('12345');
    await page.getByLabel('Confirm Password').fill('12345');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('alert')).toContainText('at least 6 characters');
  });

  test('should have link to login page', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
