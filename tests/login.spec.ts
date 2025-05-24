import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { TestData } from '../test-data/TestData';

test.describe('Login Feature Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

 test.describe('Successful Login Tests', () => {
  test('should login successfully with Standard User', async () => {
    await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
    await inventoryPage.verifyPageLoaded();
    await expect(loginPage.page.url()).toContain('/inventory.html');
  });
});

  test.describe('Failed Login Tests', () => {
    test('should fail login with locked out user', async () => {
      await loginPage.login(TestData.users.lockedOut.username, TestData.users.lockedOut.password);
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Sorry, this user has been locked out');
      expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    });

    TestData.invalidCredentials.forEach((credential, index) => {
      test(`should show error for invalid credentials - Case ${index + 1}`, async () => {
        await loginPage.login(credential.username, credential.password);
        
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(credential.expectedError);
        expect(await loginPage.isLoginFormVisible()).toBeTruthy();
      });
    });
  });

  test.describe('Logout Tests', () => {
    test('should logout successfully', async () => {

      await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
      await inventoryPage.verifyPageLoaded();

      await inventoryPage.logout();
      await loginPage.verifyLoginPageElements();
      expect(loginPage.page.url()).toContain('saucedemo.com');
    });
  });
});