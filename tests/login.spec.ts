import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { AutoHealHelper } from '../helpers/AutoHealHelper';

test.describe('AutoHeal Login Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test.afterAll(async () => {
    // Generate AutoHeal reports after all tests
    AutoHealHelper.generateReports('./autoheal-reports');
  });

  test('should login successfully with correct credentials', async ({ page }) => {
    // This will demonstrate AI healing because username locator is wrong!
    await loginPage.login(
      process.env.TEST_USERNAME || 'standard_user',
      process.env.TEST_PASSWORD || 'secret_sauce'
    );

    // Wait a bit for navigation
    await page.waitForTimeout(1000);

    // Verify we're on inventory page
    const inventoryContainer = await inventoryPage.getInventoryContainer();
    await expect(inventoryContainer).toBeVisible();

    console.log('✅ Login successful!');
  });

  test('should display products after login', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForTimeout(1000);

    // Get first product title
    const productTitle = await inventoryPage.getProductTitle(0);
    await expect(productTitle).toBeVisible();

    const titleText = await productTitle.textContent();
    console.log(`✅ First product: ${titleText}`);
  });

  test('should add product to cart', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForTimeout(1000);

    // Add a product to cart
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await page.waitForTimeout(500);

    // Verify cart count
    const count = await inventoryPage.getCartItemCount();
    expect(count).toBe(1);

    console.log('✅ Product added to cart successfully!');
  });
});