import { Page } from '@playwright/test';
import { common } from './common';

export class LoginPage extends common {
  private loginInput = this.page.getByTitle('Логин');
  private passwordInput = this.page.getByTitle('Пароль');
  private submitButton = this.page.locator('button[type="submit"]');

  constructor(page: Page) {
    super(page);
  };

  async login(username: string, password: string) { // Метод для авторизации
    await this.loginInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  };
};