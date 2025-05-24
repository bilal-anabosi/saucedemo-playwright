import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { TestData } from '../test-data/TestData';

test.describe('Sort Feature Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  test.describe('Sort by Name Tests', () => {
    test('should sort products by name A to Z', async () => {
      await inventoryPage.sortBy(TestData.sortOptions.nameAZ);

      const productNames = await inventoryPage.getItemNames();

      const sortedNames = [...productNames].sort();
      expect(productNames).toEqual(sortedNames);

      expect(productNames[0]).toBe('Sauce Labs Backpack');
    });

    test('should sort products by name Z to A', async () => {
      await inventoryPage.sortBy(TestData.sortOptions.nameZA);

      const productNames = await inventoryPage.getItemNames();

      const sortedNames = [...productNames].sort().reverse();
      expect(productNames).toEqual(sortedNames);

      expect(productNames[0]).toBe('Test.allTheThings() T-Shirt (Red)');
    });
  });

  test.describe('Sort by Price Tests', () => {
    test('should sort products by price low to high', async () => {
      await inventoryPage.sortBy(TestData.sortOptions.priceLowHigh);

      const productPrices = await inventoryPage.getItemPrices();

      const sortedPrices = [...productPrices].sort((a, b) => a - b);
      expect(productPrices).toEqual(sortedPrices);

      expect(productPrices[0]).toBe(Math.min(...productPrices));
    });

    test('should sort products by price high to low', async () => {
 
      await inventoryPage.sortBy(TestData.sortOptions.priceHighLow);

      const productPrices = await inventoryPage.getItemPrices();

      const sortedPrices = [...productPrices].sort((a, b) => b - a);
      expect(productPrices).toEqual(sortedPrices);
 
      expect(productPrices[0]).toBe(Math.max(...productPrices));
    });

  });

  test.describe('Sort Functionality Tests', () => {
  
    test('should display all products after sorting', async () => {

      const initialCount = await inventoryPage.getItemCount();

      await inventoryPage.sortBy(TestData.sortOptions.nameZA);
      expect(await inventoryPage.getItemCount()).toBe(initialCount);
      
      await inventoryPage.sortBy(TestData.sortOptions.priceHighLow);
      expect(await inventoryPage.getItemCount()).toBe(initialCount);
      
      await inventoryPage.sortBy(TestData.sortOptions.priceLowHigh);
      expect(await inventoryPage.getItemCount()).toBe(initialCount);
    });


  });

  test.describe('Sort Combinations Tests', () => {
    test('should handle multiple sort operations', async () => {
      await inventoryPage.sortBy(TestData.sortOptions.nameAZ);
      const nameAZOrder = await inventoryPage.getItemNames();

      await inventoryPage.sortBy(TestData.sortOptions.priceHighLow);
      const priceHighLowOrder = await inventoryPage.getItemPrices();

      await inventoryPage.sortBy(TestData.sortOptions.nameZA);
      const nameZAOrder = await inventoryPage.getItemNames();

      await inventoryPage.sortBy(TestData.sortOptions.priceLowHigh);
      const priceLowHighOrder = await inventoryPage.getItemPrices();

      expect(nameAZOrder).toEqual([...nameAZOrder].sort());
      expect(priceHighLowOrder).toEqual([...priceHighLowOrder].sort((a, b) => b - a));
      expect(nameZAOrder).toEqual([...nameZAOrder].sort().reverse());
      expect(priceLowHighOrder).toEqual([...priceLowHighOrder].sort((a, b) => a - b));
    });

test('should verify specific product positions after sorting', async () => {

  await inventoryPage.sortBy(TestData.sortOptions.priceHighLow);

  const prices = await inventoryPage.getItemPrices();
  const names = await inventoryPage.getItemNames();

  const maxPrice = Math.max(...prices);
  const maxPriceIndex = prices.indexOf(maxPrice);

  expect(maxPriceIndex).toBe(0);

  expect(names[0]).toBe('Sauce Labs Fleece Jacket');
});
  });
});
