import { Page, Locator } from '@playwright/test';
import { AutoHealHelper } from '../helpers/AutoHealHelper';

export class InventoryPage {
  private page: Page;
  private autoHeal: any;

  constructor(page: Page) {
    this.page = page;
    this.autoHeal = AutoHealHelper.getAutoHeal(page);
  }

  async getInventoryContainer(): Promise<Locator> {
    return await this.autoHeal.find(
      this.page,
      this.page.locator('.inventory_container'),
      'Main inventory container'
    );
  }

  async getProductTitle(index: number = 0): Promise<Locator> {
    return await this.autoHeal.find(
      this.page,
      this.page.locator('.inventory_item_name').nth(index),
      `Product title at index ${index}`
    );
  }

  async addProductToCart(productId: string): Promise<void> {
    const addButton = await this.autoHeal.find(
      this.page,
      this.page.locator(`[data-test="add-to-cart-${productId}"]`),
      `Add to cart button for ${productId}`
    );
    await addButton.click();
  }

  async getCartBadge(): Promise<Locator> {
    return await this.autoHeal.find(
      this.page,
      this.page.locator('.shopping_cart_badge'),
      'Shopping cart item count badge'
    );
  }

  async getCartItemCount(): Promise<number> {
    const badge = await this.getCartBadge();
    const text = await badge.textContent();
    return parseInt(text || '0');
  }
}