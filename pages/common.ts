import { Page } from '@playwright/test';

export class common {
  constructor(protected page: Page) { }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async checkUrl(url: string) {
    await this.page.waitForURL(url)
  }

  async navigateTabs(tabName: string) { // Метод для перехода по разделам на главной странице
    await this.page.locator(`.b-sidebar-menu-text:has-text("${tabName}")`).click();
  };
}