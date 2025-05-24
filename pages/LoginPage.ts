import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginLogo = page.locator('.login_logo');
  }

  async goto() {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.waitForPageLoad();
  }

  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent() || '';
    }
    return '';
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  async clearLoginForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  async verifyLoginPageElements() {
    await expect(this.loginLogo).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}