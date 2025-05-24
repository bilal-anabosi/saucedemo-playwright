import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { TestData } from '../test-data/TestData';

test.describe('Checkout Feature Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  test.describe('Complete Checkout Process', () => {
    test('should complete checkout with single item', async () => {
      await inventoryPage.addItemToCart(TestData.products.backpack);
      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      await cartPage.proceedToCheckout();
      
      await checkoutPage.verifyCheckoutStepOne();
      await checkoutPage.fillShippingInformation(
        TestData.checkoutInfo.valid.firstName,
        TestData.checkoutInfo.valid.lastName,
        TestData.checkoutInfo.valid.postalCode
      );
      await checkoutPage.continueToOverview();

      await checkoutPage.verifyCheckoutOverview();
      await checkoutPage.finishCheckout();

      await checkoutPage.verifyOrderComplete();
    });

    test('should complete checkout with multiple items', async () => {
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
      
      await cartPage.proceedToCheckout();
      await checkoutPage.verifyCheckoutStepOne();
      
      await checkoutPage.fillShippingInformation(
        TestData.checkoutInfo.valid.firstName,
        TestData.checkoutInfo.valid.lastName,
        TestData.checkoutInfo.valid.postalCode
      );
      await checkoutPage.continueToOverview();
      
      await checkoutPage.verifyCheckoutOverview();
      await checkoutPage.finishCheckout();
      await checkoutPage.verifyOrderComplete();

      await checkoutPage.backToProducts();
      await inventoryPage.verifyPageLoaded();
    });
  });

  test.describe('Checkout Form Validation', () => {
    test.beforeEach(async () => {
      await inventoryPage.addItemToCart(TestData.products.backpack);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.verifyCheckoutStepOne();
    });

    TestData.checkoutInfo.invalid.forEach((invalidInfo, index) => {
      test(`should show error for invalid checkout info - Case ${index + 1}`, async () => {
        await checkoutPage.fillShippingInformation(
          invalidInfo.firstName,
          invalidInfo.lastName,
          invalidInfo.postalCode
        );
        await checkoutPage.continueToOverview();
        
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toContain(invalidInfo.expectedError);

        await checkoutPage.verifyCheckoutStepOne();
      });
    });

    test('should show error when all fields are empty', async () => {
      await checkoutPage.continueToOverview();
      
      const errorMessage = await checkoutPage.getErrorMessage();
      expect(errorMessage).toContain('First Name is required');
    });
  });

 
  test.describe('Checkout Overview Verification', () => {
    test('should display correct items and total in overview', async () => {
      const itemsToAdd = [TestData.products.backpack, TestData.products.bikeLight];

      for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item);
      }
      
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      
      await checkoutPage.fillShippingInformation(
        TestData.checkoutInfo.valid.firstName,
        TestData.checkoutInfo.valid.lastName,
        TestData.checkoutInfo.valid.postalCode
      );
      await checkoutPage.continueToOverview();

      await checkoutPage.verifyCheckoutOverview();
      const totalAmount = await checkoutPage.getTotalAmount();
      expect(totalAmount).toContain('Total: $');
    });
  });

  test.describe('Empty Cart Checkout', () => {
    test('should not allow checkout with empty cart', async () => {
      await inventoryPage.page.goto('/checkout-step-one.html');
      
      const currentUrl = inventoryPage.page.url();
      expect(currentUrl).toMatch(/\/(cart\.html|inventory\.html)$/);
    });
  });

  test.describe('Post-Checkout State', () => {
    test('should clear cart after successful checkout', async () => {
      await inventoryPage.addItemToCart(TestData.products.backpack);
      await inventoryPage.addItemToCart(TestData.products.bikeLight);
      
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      
      await checkoutPage.fillShippingInformation(
        TestData.checkoutInfo.valid.firstName,
        TestData.checkoutInfo.valid.lastName,
        TestData.checkoutInfo.valid.postalCode
      );
      await checkoutPage.continueToOverview();
      await checkoutPage.finishCheckout();
      await checkoutPage.verifyOrderComplete();

      await checkoutPage.backToProducts();
      await inventoryPage.verifyPageLoaded();
      expect(await inventoryPage.getCartItemCount()).toBe('0');
 
      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      expect(await cartPage.isCartEmpty()).toBeTruthy();
    });
  });
});