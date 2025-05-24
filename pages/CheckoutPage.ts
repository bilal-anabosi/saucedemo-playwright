import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly summaryInfo: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('#finish');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('#back-to-products');
    this.summaryInfo = page.locator('.summary_info');
    this.totalLabel = page.locator('.summary_total_label');
  }

  async verifyCheckoutStepOne() {
    await expect(this.pageTitle).toContainText('Checkout: Your Information');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
  }

  async fillShippingInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
    await this.waitForPageLoad();
  }

  async verifyCheckoutOverview() {
    await expect(this.pageTitle).toContainText('Checkout: Overview');
    await expect(this.finishButton).toBeVisible();
    await expect(this.summaryInfo).toBeVisible();
  }

  async finishCheckout() {
    await this.finishButton.click();
    await this.waitForPageLoad();
  }

  async verifyOrderComplete() {
    await expect(this.completeHeader).toContainText('Thank you for your order!');
    await expect(this.completeText).toBeVisible();
    await expect(this.backHomeButton).toBeVisible();
  }

  async backToProducts() {
    await this.backHomeButton.click();
    await this.waitForPageLoad();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
    await this.waitForPageLoad();
  }

  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent() || '';
    }
    return '';
  }

  async getTotalAmount(): Promise<string> {
    return await this.totalLabel.textContent() || '';
  }
}