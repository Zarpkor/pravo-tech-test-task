import { test, expect } from '@playwright/test';
import { adminCred, pageTabs } from 'fixtures/constants'
import { generateAffairName } from 'utils';
import { LoginPage } from 'pages/login-page';
import { SubscriptionsPage } from 'pages/subscription-page';

test('Создание нового дела', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const subscriptionsPage = new SubscriptionsPage(page);

  // # Переходим на базовый url (https://test-aqa.demo.case.one/)
  await loginPage.navigateTo('');

  // # Авторизуемся
  await loginPage.login(adminCred.login, adminCred.password);

  // * Проверка перехода на первый раздел
  await page.waitForURL(/custom/);

  // # Нажимаем на раздел Подписки
  await subscriptionsPage.navigateTabs(pageTabs.subscriptions);

  // * Проверяем, что оказались в нужном разделе
  await page.waitForURL(/4841314f-005d-4809-7bbc-08db35d7338a/);

  // # Генерируем случайную строку для названия дела
  const affairName = generateAffairName();

  // # Создаём новое дело
  await subscriptionsPage.createNewAffair(affairName);

  const page2Promise = page.waitForEvent('popup');

  const page2 = await page2Promise;

  // * Проверяем, что в блоке СОЮ поля не заполнены
  await expect(page2.getByRole('textbox', { name: 'ИНН' })).toBeEmpty();
  await expect(page2.getByRole('textbox', { name: 'ОГРН' })).toBeEmpty();

  // # Выбираем организацию для отслеживания
  await page2.getByRole('textbox', { name: 'Организация для отслеживания' }).click();
  await page2.locator('div').filter({ hasText: /^ООО "ЯНДЕКС"$/ }).nth(1).click();

  // # Проверяем поля ИНН и ОГРН
  await expect(page2.getByRole('textbox', { name: 'ИНН' })).toHaveValue('7736207543');
  await expect(page2.getByRole('textbox', { name: 'ОГРН' })).toHaveValue('1027700229193');

  // # Проставляем чекбоксы
  await page2.locator('label').filter({ hasText: 'Является истцом' }).click();
  await page2.locator('label').filter({ hasText: 'Является ответчиком' }).click();
  await page2.locator('label').filter({ hasText: 'Любой иной тип участия' }).click();

  // # Запускаем отслеживание ответа на авторизацию
  const saveResponsePromise = page2.waitForResponse(response =>
    response.url().includes('api/Projects/UpdateProjectSummary') &&
    response.status() === 200
  );

  // # Нажимаем сохранить
  await page2.locator('common-floating-button div').nth(1).click();

  // * Ждем ответа и проверяем статус
  const authResponse = await saveResponsePromise;
  expect(authResponse.status()).toBe(200);

  // # Меняем статус дела
  await page2.getByText('Поставлено на мониторинг').click();

  // # Нажимаем сохранить
  await page2.locator('common-floating-button div').nth(1).click();

  // * Проверяем статус ответа сохранения
  expect(authResponse.status()).toBe(200);

  // # Переходим на вкладку сохранить
  await page2.locator('common-more-menu-component').getByRole('link', { name: 'События' }).click();

  // # Разворачиваем последнее событие
  await page2.locator('common-link-catch').first().click();

  await page2.locator('div').filter({ hasText: /^Поставлено на мониторинг$/ }).first().click();
});