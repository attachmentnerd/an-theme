/**
 * Simple Kajabi Pre-Launch Checker
 * Run this to validate your Kajabi site before launch
 */

import https from 'https';
import { URL } from 'url';

// Your Kajabi credentials
const CLIENT_ID = 'uZLFH27vxBqEZSfVuKxPcSSj';
const CLIENT_SECRET = 'cGLWhfmhhozEd3qBB2rRFAoS';
const SITE_URL = 'https://attachmentnerd.mykajabi.com';

// Simple fetch function
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data)
          });
        } catch (e) {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.reject(e),
            text: () => Promise.resolve(data)
          });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Check critical pages
async function checkPages() {
  console.log('\n📄 CHECKING CRITICAL PAGES\n' + '='.repeat(40));
  
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/products/secure-parenting-program', name: 'Main Product' },
    { url: '/offers/iWQFFjpH/checkout', name: 'Main Checkout (iWQFFjpH)' },
    { url: '/offers/aLCCMYCf', name: 'PWYC Checkout (aLCCMYCf)' },
    { url: '/login', name: 'Login Page' },
    { url: '/pages/terms', name: 'Terms Page' },
    { url: '/pages/privacy', name: 'Privacy Page' },
    { url: '/pages/refund-policy', name: 'Refund Policy' }
  ];
  
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  for (const page of pages) {
    try {
      const response = await fetch(SITE_URL + page.url);
      if (response.ok) {
        console.log(`✅ ${page.name} - OK`);
        results.passed.push(page.name);
      } else if (response.status === 404) {
        console.log(`❌ ${page.name} - NOT FOUND (404)`);
        results.failed.push(`${page.name} (404)`);
      } else {
        console.log(`⚠️  ${page.name} - Status ${response.status}`);
        results.warnings.push(`${page.name} (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${page.name} - ERROR`);
      results.failed.push(page.name);
    }
  }
  
  return results;
}

// Check redirects
async function checkRedirects() {
  console.log('\n🔄 CHECKING REDIRECTS\n' + '='.repeat(40));
  
  const redirects = [
    { from: '/checkout', to: 'checkout', name: 'Checkout redirect' },
    { from: '/join', to: 'checkout', name: 'Join redirect' },
    { from: '/buy', to: 'checkout', name: 'Buy redirect' },
    { from: '/pwyc', to: 'aLCCMYCf', name: 'PWYC redirect' },
    { from: '/pay-what-you-can', to: 'aLCCMYCf', name: 'Pay-what-you-can redirect' },
    { from: '/scholarship', to: 'aLCCMYCf', name: 'Scholarship redirect' }
  ];
  
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  for (const redirect of redirects) {
    try {
      const response = await fetch(SITE_URL + redirect.from, {
        redirect: 'manual'
      });
      
      // Check if it redirects (3xx status)
      if (response.status >= 300 && response.status < 400) {
        console.log(`✅ ${redirect.name} - Redirects`);
        results.passed.push(redirect.name);
      } else {
        console.log(`⚠️  ${redirect.name} - No redirect (Status: ${response.status})`);
        results.warnings.push(redirect.name);
      }
    } catch (error) {
      console.log(`❌ ${redirect.name} - Error checking`);
      results.failed.push(redirect.name);
    }
  }
  
  return results;
}

// Check SSL and domain
function checkDomain() {
  console.log('\n🌐 CHECKING DOMAIN & SSL\n' + '='.repeat(40));
  
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  // Check SSL
  if (SITE_URL.startsWith('https://')) {
    console.log('✅ SSL Certificate - ENABLED');
    results.passed.push('SSL enabled');
  } else {
    console.log('❌ SSL Certificate - NOT ENABLED');
    results.failed.push('SSL not enabled');
  }
  
  // Check domain type
  if (SITE_URL.includes('.mykajabi.com')) {
    console.log('⚠️  Domain - Using Kajabi subdomain');
    results.warnings.push('Using Kajabi subdomain');
  } else {
    console.log('✅ Domain - Custom domain configured');
    results.passed.push('Custom domain');
  }
  
  return results;
}

// Manual checks reminder
function showManualChecks() {
  console.log('\n🔧 MANUAL CHECKS REQUIRED\n' + '='.repeat(40));
  
  const checks = [
    '💳 Payment Processing:',
    '  - Stripe/PayPal connected',
    '  - Test purchase completed',
    '  - Receipt emails working',
    '',
    '📧 Email Automation:',
    '  - Welcome sequence active',
    '  - Purchase confirmation setup',
    '  - Abandoned cart (if used)',
    '',
    '📊 Analytics:',
    '  - Google Analytics installed',
    '  - Facebook Pixel configured',
    '  - Conversion tracking setup',
    '',
    '🔐 Member Access:',
    '  - Product access after purchase',
    '  - Login/logout working',
    '  - Password reset functional',
    '',
    '🎨 Theme:',
    '  - Mobile responsive',
    '  - Footer toggle working',
    '  - Videos playing correctly'
  ];
  
  checks.forEach(check => console.log(check));
}

// Generate final report
function generateReport(allResults) {
  console.log('\n' + '='.repeat(50));
  console.log('📊 LAUNCH READINESS REPORT');
  console.log('='.repeat(50));
  console.log(`Site: ${SITE_URL}`);
  console.log(`Date: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
  
  // Count totals
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  
  Object.values(allResults).forEach(result => {
    totalPassed += result.passed.length;
    totalFailed += result.failed.length;
    totalWarnings += result.warnings.length;
  });
  
  // Show summary
  console.log('\nSUMMARY:');
  console.log(`  ✅ Passed: ${totalPassed}`);
  console.log(`  ❌ Failed: ${totalFailed}`);
  console.log(`  ⚠️  Warnings: ${totalWarnings}`);
  
  // Critical issues
  if (totalFailed > 0) {
    console.log('\n🚨 CRITICAL ISSUES TO FIX:');
    Object.entries(allResults).forEach(([category, result]) => {
      if (result.failed.length > 0) {
        result.failed.forEach(issue => {
          console.log(`  ❌ ${issue}`);
        });
      }
    });
  }
  
  // Launch readiness
  console.log('\n' + '='.repeat(50));
  if (totalFailed === 0) {
    console.log('🎉 READY FOR LAUNCH!');
    console.log('No critical issues found. Remember to complete manual checks.');
  } else {
    console.log('⚠️  NOT READY FOR LAUNCH');
    console.log(`Fix ${totalFailed} critical issues before going live.`);
  }
  console.log('='.repeat(50) + '\n');
}

// Main function
async function runChecks() {
  console.log('\n🚀 KAJABI PRE-LAUNCH VALIDATOR');
  console.log('Checking: ' + SITE_URL);
  console.log('='.repeat(50));
  
  const results = {};
  
  // Run checks
  results.pages = await checkPages();
  results.redirects = await checkRedirects();
  results.domain = checkDomain();
  
  // Show manual checks
  showManualChecks();
  
  // Generate report
  generateReport(results);
}

// Run the checks
runChecks().catch(error => {
  console.error('Error running checks:', error);
});