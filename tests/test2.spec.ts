import { test, expect } from '@playwright/test';
import { adminCred, pageTabs } from 'fixtures/constants'
import { LoginPage } from 'pages/login-page';

test('Проверка разделов', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // # Переходим на базовый url (https://test-aqa.demo.case.one/)
  await loginPage.navigateTo('');

  // # Авторизуемся
  await loginPage.login(adminCred.login, adminCred.password);

  // * Проверка перехода на первый задел
  await page.waitForURL(/custom/);

  // # Находим нужные разделы внутри бокового меню
  const menuItemLocators = page.locator('.b-sidebar-menu  .b-sidebar-menu-list-item');

  // # Получаем количество разделов
  const itemCount = await menuItemLocators.count();

  // * Проверяем, что количество равно 13
  await expect(itemCount).toBe(13);

  // # Получаем массив значений разделов из JSON
  const expectedOrder = Object.values(pageTabs);

  // # Получаем массив строк из локаторов
  const menuItemElements = await menuItemLocators.all();

  // * Сравниваем кол-во элементов в массиве полученных локаторов и кол-во элементов из json
  await expect(menuItemElements.length).toBe(expectedOrder.length);

  // * Сравниваем текст элемента массива с заданным списком
  for (let i = 0; i < expectedOrder.length; i++) {
    const menuItemText = await menuItemElements[i].textContent();
    await expect(menuItemText).toBe(expectedOrder[i]);
  };

  // # Объявляем Локатор для элемента "Настройки"
  const settingsLocator = page.locator('b-sidebar-menu b-sidebar-menu-list-item:has-text("Настройки")');

  // * Проверяем, что элемент не виден
  await expect(settingsLocator).not.toBeVisible();
});