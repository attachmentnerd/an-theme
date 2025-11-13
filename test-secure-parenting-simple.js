/**
 * Simple test script for Secure Parenting Program
 * Tests login, link accessibility, and basic functionality
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://attachmentnerd.com';
const LOGIN_EMAIL = 'trevorharwood+claude@gmail.com';
const LOGIN_PASSWORD = 'claudeskill';

const results = {
  timestamp: new Date().toISOString(),
  login: { success: false, details: '' },
  navigation: { success: false, programUrl: '', details: '' },
  links: { total: 0, checked: 0, broken: [], warnings: [] },
  errors: []
};

// Create axios instance to maintain cookies
const client = axios.create({
  baseURL: BASE_URL,
  maxRedirects: 5,
  validateStatus: () => true, // Don't throw on any status
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; SecureParentingTest/1.0)'
  },
  timeout: 30000
});

console.log('🚀 Starting Secure Parenting Program Tests\n');
console.log('═'.repeat(60));

async function testLogin() {
  console.log('\n🔐 Testing Login...');
  console.log('─'.repeat(60));

  try {
    // First, get the login page to see if there's a CSRF token
    const loginPageResponse = await client.get('/login');
    const $ = cheerio.load(loginPageResponse.data);

    // Extract CSRF token if present
    let csrfToken = $('input[name="_csrf"]').val() ||
                    $('input[name="csrf_token"]').val() ||
                    $('meta[name="csrf-token"]').attr('content');

    console.log(`  Login page status: ${loginPageResponse.status}`);
    console.log(`  CSRF token found: ${csrfToken ? 'Yes' : 'No'}`);

    // Prepare login data
    const loginData = {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    };

    if (csrfToken) {
      loginData._csrf = csrfToken;
    }

    // Attempt login
    const loginResponse = await client.post('/login', loginData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': loginPageResponse.headers['set-cookie']?.join('; ') || ''
      }
    });

    // Check if login was successful
    const loginSuccess = loginResponse.status === 200 ||
                         loginResponse.status === 302 ||
                         loginResponse.status === 301;

    results.login.success = loginSuccess;
    results.login.details = `Status: ${loginResponse.status}, Redirected to: ${loginResponse.headers.location || 'N/A'}`;

    if (loginSuccess) {
      console.log('  ✅ Login successful');
      console.log(`  Redirect: ${loginResponse.headers.location || 'Same page'}`);

      // Store cookies for subsequent requests
      if (loginResponse.headers['set-cookie']) {
        client.defaults.headers.Cookie = loginResponse.headers['set-cookie'].join('; ');
      }
    } else {
      console.log('  ❌ Login failed');
      console.log(`  Status: ${loginResponse.status}`);
      results.errors.push(`Login failed with status ${loginResponse.status}`);
    }

    return loginSuccess;
  } catch (error) {
    console.log(`  ❌ Login error: ${error.message}`);
    results.login.details = `Error: ${error.message}`;
    results.errors.push(`Login error: ${error.message}`);
    return false;
  }
}

async function findSecureParentingProgram() {
  console.log('\n🔍 Finding Secure Parenting Program...');
  console.log('─'.repeat(60));

  const searchPaths = [
    '/library',
    '/courses',
    '/my-courses',
    '/dashboard',
    '/products'
  ];

  for (const path of searchPaths) {
    try {
      console.log(`  Checking: ${path}`);
      const response = await client.get(path);

      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        // Look for "Secure Parenting" in links
        const programLink = $('a').filter((i, el) => {
          const text = $(el).text().toLowerCase();
          return text.includes('secure') && text.includes('parenting');
        }).first();

        if (programLink.length > 0) {
          const href = programLink.attr('href');
          const fullUrl = href?.startsWith('http') ? href : `${BASE_URL}${href}`;

          console.log(`  ✅ Found program link: ${fullUrl}`);
          console.log(`  Link text: "${programLink.text().trim()}"`);

          results.navigation.success = true;
          results.navigation.programUrl = fullUrl;
          results.navigation.details = `Found at ${path}`;

          return fullUrl;
        }
      }
    } catch (error) {
      console.log(`  ⚠️  Could not access ${path}: ${error.message}`);
    }
  }

  console.log('  ⚠️  Could not automatically locate program');
  results.navigation.details = 'Program not found in common locations';
  return null;
}

async function checkLinks(url) {
  console.log('\n🔗 Checking Links...');
  console.log('─'.repeat(60));

  try {
    const response = await client.get(url);
    const $ = cheerio.load(response.data);

    const links = $('a[href]');
    results.links.total = links.length;

    console.log(`  Found ${links.length} links on page`);

    const checkedUrls = new Set();
    const linksToCheck = [];

    // Collect unique internal links
    links.each((i, el) => {
      const href = $(el).attr('href');

      // Skip anchors, javascript, mailto, tel
      if (!href || href.startsWith('#') || href.startsWith('javascript:') ||
          href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Make absolute
      let fullUrl = href;
      if (href.startsWith('/')) {
        fullUrl = `${BASE_URL}${href}`;
      }

      // Only check internal links
      if (fullUrl.startsWith(BASE_URL) && !checkedUrls.has(fullUrl)) {
        checkedUrls.add(fullUrl);
        linksToCheck.push({ url: fullUrl, text: $(el).text().trim() });
      }
    });

    console.log(`  Checking ${Math.min(linksToCheck.length, 30)} unique internal links...\n`);

    // Check links (limit to first 30 for performance)
    for (const link of linksToCheck.slice(0, 30)) {
      try {
        const linkResponse = await client.head(link.url).catch(() =>
          client.get(link.url)
        );

        results.links.checked++;

        if (linkResponse.status >= 400) {
          results.links.broken.push({
            url: link.url,
            status: linkResponse.status,
            text: link.text
          });
          console.log(`  ❌ [${linkResponse.status}] ${link.url}`);
        } else if (linkResponse.status >= 300) {
          results.links.warnings.push({
            url: link.url,
            status: linkResponse.status,
            redirect: linkResponse.headers.location
          });
          console.log(`  ⚠️  [${linkResponse.status}] ${link.url} → ${linkResponse.headers.location}`);
        } else {
          console.log(`  ✅ [${linkResponse.status}] ${link.url}`);
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.links.warnings.push({
          url: link.url,
          error: error.message
        });
        console.log(`  ⚠️  Error checking ${link.url}: ${error.message}`);
      }
    }

    console.log(`\n  📊 Summary: ${results.links.checked} checked, ${results.links.broken.length} broken, ${results.links.warnings.length} warnings`);
  } catch (error) {
    console.log(`  ❌ Error loading page: ${error.message}`);
    results.errors.push(`Link check error: ${error.message}`);
  }
}

async function checkResponsiveness(url) {
  console.log('\n📱 Checking Responsive Design Notes...');
  console.log('─'.repeat(60));

  try {
    const response = await client.get(url);
    const $ = cheerio.load(response.data);

    // Check for viewport meta tag
    const viewport = $('meta[name="viewport"]').attr('content');
    console.log(`  Viewport meta tag: ${viewport || '❌ Missing!'}`);

    // Check for mobile menu indicators
    const hasMobileMenu = $('.mobile-menu, .hamburger, [class*="mobile"], [class*="hamburger"]').length > 0;
    console.log(`  Mobile menu detected: ${hasMobileMenu ? '✅ Yes' : '⚠️  No'}`);

    // Check for responsive images
    const responsiveImages = $('img[srcset], picture').length;
    const totalImages = $('img').length;
    console.log(`  Responsive images: ${responsiveImages}/${totalImages} (${Math.round(responsiveImages/totalImages*100)}%)`);

    // Check for media queries in style tags
    const styles = $('style').text();
    const hasMediaQueries = styles.includes('@media');
    console.log(`  Media queries in styles: ${hasMediaQueries ? '✅ Yes' : '⚠️  No'}`);

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
}

async function runTests() {
  try {
    // Test 1: Login
    const loginSuccess = await testLogin();

    if (!loginSuccess) {
      console.log('\n❌ Cannot proceed without successful login');
      return;
    }

    // Test 2: Find program
    const programUrl = await findSecureParentingProgram();

    if (programUrl) {
      // Test 3: Check links
      await checkLinks(programUrl);

      // Test 4: Responsive design
      await checkResponsiveness(programUrl);
    } else {
      console.log('\n⚠️  Skipping link and responsive checks - program not found');

      // Try checking links from a common page instead
      console.log('\n📝 Checking links from library page instead...');
      await checkLinks('/library');
    }

    // Save results
    fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));

    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('📋 FINAL SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Login: ${results.login.success ? '✅ Success' : '❌ Failed'}`);
    console.log(`Program Found: ${results.navigation.success ? '✅ Yes' : '⚠️  No'}`);
    console.log(`Links Checked: ${results.links.checked}`);
    console.log(`Broken Links: ${results.links.broken.length}`);
    console.log(`Link Warnings: ${results.links.warnings.length}`);
    console.log(`Errors: ${results.errors.length}`);
    console.log('\n📄 Full report saved to: test-results.json');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
    results.errors.push(`Test suite error: ${error.message}`);
  }
}

// Run tests
runTests().then(() => {
  console.log('\n✨ Tests complete!\n');
  process.exit(results.errors.length > 0 ? 1 : 0);
}).catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
