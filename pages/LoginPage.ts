import { Page, Locator } from '@playwright/test';
import { AutoHealHelper } from '../helpers/AutoHealHelper';

export class LoginPage {
  private page: Page;
  private autoHeal: any;

  constructor(page: Page) {
    this.page = page;
    this.autoHeal = AutoHealHelper.getAutoHeal(page);
  }

  async goto(): Promise<void> {
    // Use '/' to go to the baseURL we set in playwright.config.ts
    // If baseURL is 'https://www.saucedemo.com', this goes to that URL
    // If you change baseURL later, you don't need to update this code!
    await this.page.goto('/');
  }

  async getUsernameInput(): Promise<Locator> {
    // INTENTIONALLY WRONG LOCATOR to demonstrate AI healing!
    return await this.autoHeal.find(
      this.page,
      this.page.locator('#wrong-username-id'),  // ❌ This is wrong!
      'Username input field'                     // ✅ AI will use this to find it
    );
  }

  async getPasswordInput(): Promise<Locator> {
    return await this.autoHeal.find(
      this.page,
      this.page.locator('#password'),
      'Password input field'
    );
  }

  async getLoginButton(): Promise<Locator> {
    return await this.autoHeal.find(
      this.page,
      this.page.locator('#login-button'),
      'Login submit button'
    );
  }

  async login(username: string, password: string): Promise<void> {
    const usernameInput = await this.getUsernameInput();
    const passwordInput = await this.getPasswordInput();
    const loginButton = await this.getLoginButton();

    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await loginButton.click();
  }
}