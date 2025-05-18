import { test, expect } from '@playwright/test';
import { adminCred, pageTabs } from 'fixtures/constants'
import { LoginPage } from 'pages/login-page';

test('Соответствие модуля предусловию', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // # Переходим на базовый url (https://test-aqa.demo.case.one/)
  await loginPage.navigateTo('');

  // # Запускаем отслеживание ответа на авторизацию
  const authResponsePromise = page.waitForResponse(response =>
    response.url().includes('authentication/account/login') &&
    response.status() === 200
  );

  // # Авторизуемся
  await loginPage.login(adminCred.login, adminCred.password);

  // * Ждем ответа и проверяем статус
  const authResponse = await authResponsePromise;
  expect(authResponse.status()).toBe(200);

  // * Проверка перехода на первый задел
  await page.waitForURL(/custom/);

  // # Запускаем отслеживание ответа на список приложений
  const appListResponsePromise = page.waitForResponse(response =>
    response.url().includes('api/Install/GetGroups') &&
    response.status() === 200
  );

  // # Нажимаем на раздел Администрирование
  await loginPage.navigateTabs(pageTabs.administrating);

  // * Ждем ответа и проверяем статус
  const appListResponse = await appListResponsePromise;
  expect(appListResponse.status()).toBe(200);

  // * Проверка перехода в раздел администрирования
  await page.waitForURL(/admin/);

  // * Проверяем соответствие модуля УД предусловию
  await page.locator('.b-shell_applications-description:has-text("Версия 6\\.0\\.35 / Управляй \\(делами\\) \\(УД\\)")').waitFor();
});