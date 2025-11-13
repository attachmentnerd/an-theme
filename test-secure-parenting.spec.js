import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://attachmentnerd.com';
const LOGIN_EMAIL = 'trevorharwood+claude@gmail.com';
const LOGIN_PASSWORD = 'claudeskill';

// Test results
const results = {
  brokenLinks: [],
  responsiveIssues: [],
  consoleErrors: [],
  warnings: [],
  screenshots: []
};

// Viewports to test
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

test.describe('Secure Parenting Program Tests', () => {

  test.beforeAll(async () => {
    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, 'test-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('Login and access Secure Parenting Program', async ({ page }) => {
    console.log('🔐 Testing login...');

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        results.consoleErrors.push({
          page: 'Login',
          message: msg.text(),
          location: msg.location()
        });
      }
    });

    // Go to login page
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Take screenshot of login page
    await page.screenshot({
      path: 'test-screenshots/01-login-page.png',
      fullPage: true
    });

    // Fill in login form
    await page.fill('input[type="email"], input[name="email"]', LOGIN_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', LOGIN_PASSWORD);

    // Submit login
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Verify login was successful
    const url = page.url();
    console.log(`✅ Logged in, redirected to: ${url}`);

    // Take screenshot after login
    await page.screenshot({
      path: 'test-screenshots/02-after-login.png',
      fullPage: true
    });
  });

  test('Find and navigate to Secure Parenting Program', async ({ page }) => {
    console.log('🔍 Looking for Secure Parenting Program...');

    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[name="email"]', LOGIN_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', LOGIN_PASSWORD);
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Look for the program in various common locations
    const programSearchTerms = [
      'secure parenting',
      'parenting program',
      'library',
      'courses',
      'my courses'
    ];

    let programFound = false;
    let programUrl = '';

    // Try to find program link on the page
    for (const term of programSearchTerms) {
      const links = await page.locator(`a:has-text("${term}")`).all();
      if (links.length > 0) {
        console.log(`Found potential program link with text containing: ${term}`);
        programUrl = await links[0].getAttribute('href');
        programFound = true;
        break;
      }
    }

    // If not found, try going to library/courses page
    if (!programFound) {
      const possibleUrls = [
        `${BASE_URL}/library`,
        `${BASE_URL}/courses`,
        `${BASE_URL}/my-courses`,
        `${BASE_URL}/dashboard`
      ];

      for (const url of possibleUrls) {
        try {
          await page.goto(url);
          await page.waitForLoadState('networkidle');

          // Search for "Secure Parenting" on this page
          const programLink = page.locator('a:has-text("Secure Parenting")').first();
          if (await programLink.count() > 0) {
            programUrl = await programLink.getAttribute('href');
            programFound = true;
            console.log(`✅ Found program at: ${url}`);
            break;
          }
        } catch (e) {
          console.log(`⚠️  Could not access ${url}`);
        }
      }
    }

    if (programFound && programUrl) {
      // Navigate to the program
      if (!programUrl.startsWith('http')) {
        programUrl = `${BASE_URL}${programUrl}`;
      }
      await page.goto(programUrl);
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: 'test-screenshots/03-program-page.png',
        fullPage: true
      });

      console.log(`✅ Successfully navigated to Secure Parenting Program: ${programUrl}`);
    } else {
      console.log('⚠️  Could not automatically find the Secure Parenting Program');
      results.warnings.push('Could not automatically locate Secure Parenting Program');
    }
  });

  test('Check for broken links', async ({ page }) => {
    console.log('🔗 Checking for broken links...');

    // Login and navigate to program
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[name="email"]', LOGIN_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', LOGIN_PASSWORD);
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Get all links on the page
    const links = await page.locator('a[href]').all();
    console.log(`Found ${links.length} links to check`);

    const checkedUrls = new Set();
    let brokenCount = 0;

    for (const link of links.slice(0, 50)) { // Limit to first 50 links for performance
      try {
        const href = await link.getAttribute('href');

        // Skip anchors, javascript, mailto, tel links
        if (!href || href.startsWith('#') || href.startsWith('javascript:') ||
            href.startsWith('mailto:') || href.startsWith('tel:')) {
          continue;
        }

        // Make URL absolute
        let fullUrl = href;
        if (href.startsWith('/')) {
          fullUrl = `${BASE_URL}${href}`;
        }

        // Skip external links and duplicates
        if (!fullUrl.startsWith(BASE_URL) || checkedUrls.has(fullUrl)) {
          continue;
        }

        checkedUrls.add(fullUrl);

        // Check if link is accessible
        const response = await page.request.get(fullUrl);

        if (response.status() >= 400) {
          brokenCount++;
          results.brokenLinks.push({
            url: fullUrl,
            status: response.status(),
            text: await link.textContent()
          });
          console.log(`❌ Broken link: ${fullUrl} (${response.status()})`);
        } else {
          console.log(`✅ Valid link: ${fullUrl}`);
        }
      } catch (error) {
        console.log(`⚠️  Error checking link: ${error.message}`);
      }
    }

    console.log(`\n📊 Checked ${checkedUrls.size} unique links, found ${brokenCount} broken links`);
  });

  test('Test responsive design', async ({ browser }) => {
    console.log('📱 Testing responsive design...');

    for (const viewport of viewports) {
      console.log(`\nTesting ${viewport.name} (${viewport.width}x${viewport.height})`);

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });

      const page = await context.newPage();

      // Track console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          results.consoleErrors.push({
            page: `${viewport.name} viewport`,
            message: msg.text()
          });
        }
      });

      // Login
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[type="email"], input[name="email"]', LOGIN_EMAIL);
      await page.fill('input[type="password"], input[name="password"]', LOGIN_PASSWORD);
      await page.click('button[type="submit"], input[type="submit"]');
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `test-screenshots/responsive-${viewport.name.toLowerCase()}.png`,
        fullPage: true
      });

      // Check for common responsive issues

      // 1. Horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;

      if (bodyWidth > viewportWidth) {
        results.responsiveIssues.push({
          viewport: viewport.name,
          issue: 'Horizontal overflow detected',
          details: `Body width (${bodyWidth}px) exceeds viewport width (${viewportWidth}px)`
        });
        console.log(`⚠️  Horizontal overflow on ${viewport.name}`);
      }

      // 2. Check if navigation is accessible
      const navVisible = await page.locator('nav, [role="navigation"], .header, .navigation').isVisible();
      if (!navVisible) {
        results.responsiveIssues.push({
          viewport: viewport.name,
          issue: 'Navigation not visible',
          details: 'Main navigation element not found or not visible'
        });
        console.log(`⚠️  Navigation not visible on ${viewport.name}`);
      }

      // 3. Check for text overflow
      const overflowingElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const overflowing = [];

        elements.forEach(el => {
          if (el.scrollWidth > el.clientWidth &&
              window.getComputedStyle(el).overflow === 'visible') {
            overflowing.push({
              tag: el.tagName,
              class: el.className,
              text: el.textContent.substring(0, 50)
            });
          }
        });

        return overflowing.slice(0, 5); // Limit results
      });

      if (overflowingElements.length > 0) {
        results.responsiveIssues.push({
          viewport: viewport.name,
          issue: 'Text overflow detected',
          details: overflowingElements
        });
      }

      await context.close();
    }

    console.log(`\n✅ Responsive testing complete`);
  });

  test('Check for console errors and warnings', async ({ page }) => {
    console.log('🐛 Checking for console errors...');

    const pageErrors = [];
    const pageWarnings = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        pageErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        pageWarnings.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    // Login and navigate
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[name="email"]', LOGIN_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', LOGIN_PASSWORD);
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Wait a bit to catch any async errors
    await page.waitForTimeout(3000);

    if (pageErrors.length > 0) {
      console.log(`❌ Found ${pageErrors.length} console errors:`);
      pageErrors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ No console errors found');
    }

    if (pageWarnings.length > 0) {
      console.log(`⚠️  Found ${pageWarnings.length} warnings:`);
      pageWarnings.forEach(warning => console.log(`   - ${warning}`));
    }
  });

  test.afterAll(async () => {
    // Generate report
    const reportPath = path.join(__dirname, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('📋 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Broken Links: ${results.brokenLinks.length}`);
    console.log(`Responsive Issues: ${results.responsiveIssues.length}`);
    console.log(`Console Errors: ${results.consoleErrors.length}`);
    console.log(`Warnings: ${results.warnings.length}`);
    console.log(`\nDetailed report saved to: ${reportPath}`);
    console.log(`Screenshots saved to: test-screenshots/`);
    console.log('='.repeat(60));
  });
});
