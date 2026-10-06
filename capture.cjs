const puppeteer = require('puppeteer');
const fs = require('fs');

if (!fs.existsSync('./SESA_REPORT_ASSETS')) {
    fs.mkdirSync('./SESA_REPORT_ASSETS');
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Login Page
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'SESA_REPORT_ASSETS/01_login.png' });

  // 2. Login as admin
  // Try to find inputs
  const inputs = await page.$$('input');
  if (inputs.length >= 2) {
    await inputs[0].type('admin');
    await inputs[1].type('Admin@123');
    await page.click('button');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  }
  
  // 3. Admin Dashboard
  await page.screenshot({ path: 'SESA_REPORT_ASSETS/02_dashboard.png' });

  // 4. Student Management
  await page.goto('http://localhost:5173/admin/students', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'SESA_REPORT_ASSETS/03_student_management.png' });

  // 5. Exam Management
  await page.goto('http://localhost:5173/admin/exams', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'SESA_REPORT_ASSETS/04_exam_management.png' });

  // 6. Hall Management
  await page.goto('http://localhost:5173/admin/halls', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'SESA_REPORT_ASSETS/05_hall_management.png' });

  // 7. Seating Arrangement Generation
  await page.goto('http://localhost:5173/admin/seating', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'SESA_REPORT_ASSETS/06_seating_generation.png' });

  await browser.close();
  console.log("Screenshots captured successfully!");
})();
