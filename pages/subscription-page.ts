import { Page } from '@playwright/test';
import { common } from './common';

export class SubscriptionsPage extends common {
  constructor(page: Page) {
    super(page);
  };

  async createNewAffair(affairName: string) { // Метод для создания дела
  // # Нажимаем на кнопку "плюс"
  await this.page.locator('.b-floating_button-el').click();

  // # Нажимаем на кнопку "создать новое дело"
  await this.page.locator('.b-floating_button-icon_list-item-content').first().click();

  // # Заполняем название дела
  await this.page.getByRole('textbox', { name: 'Название дела' }).fill(affairName);

  // # Выбираем тип дела
  await this.page.getByRole('textbox', { name: 'Тип дела' }).click();
  await this.page.getByText('Подписка на дела судов общей юрисдикции').click();

  // # Нажимаем на кнопку Добавить
  await this.page.getByRole('button', { name: 'Добавить' }).click();
  };
};