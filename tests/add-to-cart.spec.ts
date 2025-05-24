import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { TestData } from '../test-data/TestData';

test.describe('Add to Cart Feature Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  test.describe('Single Item Add to Cart', () => {
    Object.values(TestData.products).forEach((productName) => {
      test(`should add ${productName} to cart`, async () => {
        await inventoryPage.addItemToCart(productName);

        expect(await inventoryPage.getCartItemCount()).toBe('1');

        expect(await inventoryPage.verifyItemInCart(productName)).toBeTruthy();
        await inventoryPage.goToCart();
        await cartPage.verifyPageLoaded();
        expect(await cartPage.verifyItemInCart(productName)).toBeTruthy();
        expect(await cartPage.getCartItemCount()).toBe(1);
      });
    });
  });

  test.describe('Multiple Items Add to Cart', () => {
    test('should add multiple different items to cart', async () => {
      const itemsToAdd = [
        TestData.products.backpack,
        TestData.products.bikeLight,
        TestData.products.boltTShirt
      ];

      for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item);
      }

      expect(await inventoryPage.getCartItemCount()).toBe(itemsToAdd.length.toString());

      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toHaveLength(itemsToAdd.length);
      
      for (const item of itemsToAdd) {
        expect(cartItems).toContain(item);
      }
    });

    test('should handle adding all available items to cart', async () => {
      const allItems = Object.values(TestData.products);

      for (const item of allItems) {
        await inventoryPage.addItemToCart(item);
      }

      expect(await inventoryPage.getCartItemCount()).toBe(allItems.length.toString());

      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toHaveLength(allItems.length);
      
      for (const item of allItems) {
        expect(cartItems).toContain(item);
      }
    });
  });

test('should persist cart items after logout and login with the same user', async () => {
  const itemName = TestData.products.backpack;

  await inventoryPage.addItemToCart(itemName);
  expect(await inventoryPage.getCartItemCount()).toBe('1');

  await inventoryPage.logout();

  await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
  await inventoryPage.verifyPageLoaded();

  expect(await inventoryPage.getCartItemCount()).toBe('1');

  await inventoryPage.goToCart();
  await cartPage.verifyPageLoaded();
  const cartItems = await cartPage.getCartItemNames();
  expect(cartItems).toContain(itemName);
});

  
});