import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly removeButtons: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
    this.removeButtons = page.locator('[data-test^="remove"]');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.itemQuantities = page.locator('.cart_quantity');
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toContainText('Your Cart');
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.waitForPageLoad();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await this.waitForPageLoad();
  }

  async removeItem(itemName: string) {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    const removeButton = item.locator('[data-test^="remove"]');
    await removeButton.click();
  }

  async getCartItemNames(): Promise<string[]> {
    if (await this.cartItems.count() === 0) {
      return [];
    }
    return await this.itemNames.allTextContents();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async verifyItemInCart(itemName: string): Promise<boolean> {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    return await item.isVisible();
  }

  async getTotalPrice(): Promise<number> {
    const prices = await this.itemPrices.allTextContents();
    return prices.reduce((total, price) => {
      return total + parseFloat(price.replace('$', ''));
    }, 0);
  }

  async isCartEmpty(): Promise<boolean> {
    return (await this.cartItems.count()) === 0;
  }
}