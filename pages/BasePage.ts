import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly hamburgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hamburgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickHamburgerMenu() {
    await this.hamburgerMenu.click();
  }

  async logout() {
    await this.clickHamburgerMenu();
    await this.logoutLink.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getCartItemCount(): Promise<string> {
    if (await this.cartBadge.isVisible()) {
      return await this.cartBadge.textContent() || '0';
    }
    return '0';
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}