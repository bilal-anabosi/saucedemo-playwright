import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { TestData } from '../test-data/TestData';

test.describe('Remove from Cart Feature Tests', () => {
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

  test.describe('Remove Single Item from Inventory Page', () => {
    test('should remove item from cart via inventory page', async () => {
      const itemName = TestData.products.backpack;

      await inventoryPage.addItemToCart(itemName);
      expect(await inventoryPage.getCartItemCount()).toBe('1');
      expect(await inventoryPage.verifyItemInCart(itemName)).toBeTruthy();

      await inventoryPage.removeItemFromCart(itemName);

      expect(await inventoryPage.getCartItemCount()).toBe('0');
      expect(await inventoryPage.verifyItemInCart(itemName)).toBeFalsy();

      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      expect(await cartPage.isCartEmpty()).toBeTruthy();
    });

    test('should remove multiple items from inventory page', async () => {
      const itemsToAdd = [
        TestData.products.backpack,
        TestData.products.bikeLight,
        TestData.products.boltTShirt
      ];

      for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item);
      }
      expect(await inventoryPage.getCartItemCount()).toBe(itemsToAdd.length.toString());

      await inventoryPage.removeItemFromCart(itemsToAdd[0]);
      expect(await inventoryPage.getCartItemCount()).toBe('2');

      await inventoryPage.removeItemFromCart(itemsToAdd[1]);
      expect(await inventoryPage.getCartItemCount()).toBe('1');

      await inventoryPage.removeItemFromCart(itemsToAdd[2]);
      expect(await inventoryPage.getCartItemCount()).toBe('0');

      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      expect(await cartPage.isCartEmpty()).toBeTruthy();
    });
  });

  test.describe('Remove Items from Cart Page', () => {
    test('should remove single item from cart page', async () => {
      const itemName = TestData.products.backpack;

      await inventoryPage.addItemToCart(itemName);
      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();

      expect(await cartPage.verifyItemInCart(itemName)).toBeTruthy();
      expect(await cartPage.getCartItemCount()).toBe(1);

      await cartPage.removeItem(itemName);

      expect(await cartPage.isCartEmpty()).toBeTruthy();
      expect(await cartPage.getCartItemCount()).toBe(0);
    });

    test('should remove specific item from multiple items in cart', async () => {
      const itemsToAdd = [
        TestData.products.backpack,
        TestData.products.bikeLight,
        TestData.products.boltTShirt
      ];

      for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item);
      }

      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(3);

      await cartPage.removeItem(itemsToAdd[1]);

      expect(await cartPage.getCartItemCount()).toBe(2);
      expect(await cartPage.verifyItemInCart(itemsToAdd[0])).toBeTruthy();
      expect(await cartPage.verifyItemInCart(itemsToAdd[1])).toBeFalsy();
      expect(await cartPage.verifyItemInCart(itemsToAdd[2])).toBeTruthy();
    });

    test('should remove all items one by one from cart page', async () => {
      const itemsToAdd = Object.values(TestData.products);

      for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item);
      }

      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      expect(await cartPage.getCartItemCount()).toBe(itemsToAdd.length);

      for (let i = 0; i < itemsToAdd.length; i++) {
        await cartPage.removeItem(itemsToAdd[i]);
        expect(await cartPage.getCartItemCount()).toBe(itemsToAdd.length - i - 1);
      }

      expect(await cartPage.isCartEmpty()).toBeTruthy();
    });
  });

  
});