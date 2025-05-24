import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('.product_sort_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.removeButtons = page.locator('[data-test^="remove"]');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toContainText('Products');
    await expect(this.sortDropdown).toBeVisible();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
    await this.waitForPageLoad();
  }

  async addItemToCart(itemName: string) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    const addButton = item.locator('[data-test^="add-to-cart"]');
    await addButton.click();
  }

  async removeItemFromCart(itemName: string) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    const removeButton = item.locator('[data-test^="remove"]');
    await removeButton.click();
  }

  async getItemNames(): Promise<string[]> {
    await this.itemNames.first().waitFor();
    const names = await this.itemNames.allTextContents();
    return names;
  }

  async getItemPrices(): Promise<number[]> {
    await this.itemPrices.first().waitFor();
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async clickItemTitle(itemName: string) {
    await this.page.locator('.inventory_item_name', { hasText: itemName }).click();
  }

  async verifyItemInCart(itemName: string): Promise<boolean> {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    const removeButton = item.locator('[data-test^="remove"]');
    return await removeButton.isVisible();
  }
}