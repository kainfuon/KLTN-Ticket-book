import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test('Đăng ký và đăng nhập tài khoản', async ({ page }) => {
    const email = `test${Date.now()}@example.com`;
    const password = '12345678';

    // Đăng ký
    await page.goto(`${BASE_URL}/signup`);
    await page.fill('input[name="name"]', 'Nguyen Van A');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(`${BASE_URL}/login`);

    // Đăng nhập
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Kiểm tra chuyển trang thành công
    await expect(page).not.toHaveURL(`${BASE_URL}/login`); // Đảm bảo không ở lại login

    // Cập nhật nếu bạn có route cụ thể sau khi login
    await expect(page).toHaveURL(/.*home|tickets|profile/);
});

test('Đăng nhập thất bại', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[type="email"]', 'fuon@example.com');
    await page.fill('input[type="password"]', 'sai-mat-khau');
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('p.text-red-500');
    await expect(errorMessage).toContainText('Invalid email or password'); // hoặc 'Sai email hoặc mật khẩu'
});

test('Điền thiếu email thì input không hợp lệ', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // Nhập password nhưng không nhập email
  await page.fill('input[type="password"]', '123456');

  // Click submit để trigger validation
  await page.click('button[type="submit"]');

  // Kiểm tra input email không hợp lệ
  const isValid = await page.$eval('input[type="email"]', el =>
    (el as HTMLInputElement).checkValidity()
  );
  
  // ⚠️ Sửa lại kỳ vọng, nếu input bị thiếu thì checkValidity sẽ là false
  expect(isValid).toBe(false);
});
