/**
 * Kajabi API v2 Pre-Launch Checker
 * Using OAuth2 credentials to validate your site before going live
 */

const axios = require('axios');
const chalk = require('chalk');

class KajabiLaunchValidator {
  constructor() {
    // Your Kajabi OAuth credentials
    this.clientId = 'uZLFH27vxBqEZSfVuKxPcSSj';
    this.clientSecret = 'cGLWhfmhhozEd3qBB2rRFAoS';
    this.apiBase = 'https://kajabi.com/api/v2';
    this.siteUrl = 'https://attachmentnerd.mykajabi.com';
    this.accessToken = null;
    
    // Track results
    this.results = {
      critical: [],
      warnings: [],
      passed: [],
      info: []
    };
  }

  // Get OAuth token
  async authenticate() {
    try {
      console.log(chalk.blue('🔐 Authenticating with Kajabi API...'));
      
      const response = await axios.post('https://kajabi.com/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret
      });
      
      this.accessToken = response.data.access_token;
      console.log(chalk.green('✓ Authentication successful!\n'));
      return true;
    } catch (error) {
      console.error(chalk.red('✗ Authentication failed:', error.message));
      return false;
    }
  }

  // Make API request
  async apiRequest(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.apiBase}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json'
        },
        params
      });
      return response.data;
    } catch (error) {
      console.error(chalk.yellow(`Warning: Could not fetch ${endpoint}`));
      return null;
    }
  }

  // 1. Check Products
  async checkProducts() {
    console.log(chalk.cyan('\n📦 Checking Products...'));
    
    const data = await this.apiRequest('/products');
    if (!data) return;
    
    const products = data.products || [];
    
    if (products.length === 0) {
      this.results.critical.push('No products found!');
      return;
    }
    
    products.forEach(product => {
      // Check if published
      if (product.status !== 'published') {
        this.results.warnings.push(`Product "${product.title}" is not published`);
      }
      
      // Check for content
      if (!product.description || product.description.length < 50) {
        this.results.warnings.push(`Product "${product.title}" has minimal description`);
      }
      
      // Check for image
      if (!product.poster_url) {
        this.results.warnings.push(`Product "${product.title}" missing thumbnail`);
      }
      
      this.results.passed.push(`Product: ${product.title} (${product.enrollments_count || 0} enrolled)`);
    });
    
    // Look for Secure Parenting Program
    const mainProduct = products.find(p => 
      p.title.toLowerCase().includes('secure parenting') ||
      p.slug === 'secure-parenting-program'
    );
    
    if (!mainProduct) {
      this.results.critical.push('Main product (Secure Parenting Program) not found!');
    } else {
      this.results.info.push(`Main product ID: ${mainProduct.id}`);
    }
  }

  // 2. Check Offers
  async checkOffers() {
    console.log(chalk.cyan('\n💰 Checking Offers...'));
    
    const data = await this.apiRequest('/offers');
    if (!data) return;
    
    const offers = data.offers || [];
    
    if (offers.length === 0) {
      this.results.critical.push('No offers configured!');
      return;
    }
    
    offers.forEach(offer => {
      // Check status
      if (!offer.published) {
        this.results.critical.push(`Offer "${offer.title}" is not published`);
      }
      
      // Check pricing
      if (offer.price_in_cents === 0 && !offer.title.toLowerCase().includes('free')) {
        this.results.warnings.push(`Offer "${offer.title}" has $0 price`);
      }
      
      this.results.passed.push(`Offer: ${offer.title} ($${offer.price_in_cents / 100})`);
    });
    
    // Check for specific offers
    const mainOfferFound = offers.find(o => o.id === 'iWQFFjpH');
    const pwycOfferFound = offers.find(o => o.id === 'aLCCMYCf');
    
    if (!mainOfferFound) {
      this.results.critical.push('Main checkout offer (iWQFFjpH) not found!');
    }
    
    if (!pwycOfferFound) {
      this.results.warnings.push('PWYC offer (aLCCMYCf) not found');
    }
  }

  // 3. Check Forms
  async checkForms() {
    console.log(chalk.cyan('\n📝 Checking Forms...'));
    
    const data = await this.apiRequest('/forms');
    if (!data) return;
    
    const forms = data.forms || [];
    
    forms.forEach(form => {
      if (!form.published) {
        this.results.warnings.push(`Form "${form.title}" is not published`);
      }
      
      this.results.passed.push(`Form: ${form.title} (${form.submissions_count || 0} submissions)`);
    });
    
    if (forms.length === 0) {
      this.results.warnings.push('No forms found - consider adding opt-in forms');
    }
  }

  // 4. Check Coupons
  async checkCoupons() {
    console.log(chalk.cyan('\n🎫 Checking Coupons...'));
    
    const data = await this.apiRequest('/coupons');
    if (!data) return;
    
    const coupons = data.coupons || [];
    
    coupons.forEach(coupon => {
      if (coupon.active) {
        const discount = coupon.amount_off ? 
          `$${coupon.amount_off}` : 
          `${coupon.percent_off}%`;
        
        this.results.info.push(`Active coupon: ${coupon.code} (${discount} off)`);
        
        // Check for 50% launch discount
        if (coupon.percent_off === 50) {
          this.results.passed.push('50% launch discount configured!');
        }
      }
    });
  }

  // 5. Check Email Broadcasts
  async checkEmails() {
    console.log(chalk.cyan('\n📧 Checking Email Setup...'));
    
    const data = await this.apiRequest('/email_broadcasts');
    if (!data) return;
    
    const broadcasts = data.broadcasts || [];
    
    // Check for scheduled launch emails
    const scheduled = broadcasts.filter(b => b.status === 'scheduled');
    const drafts = broadcasts.filter(b => b.status === 'draft');
    
    if (scheduled.length > 0) {
      this.results.info.push(`${scheduled.length} emails scheduled`);
    }
    
    if (drafts.length > 0) {
      this.results.warnings.push(`${drafts.length} email drafts pending`);
    }
    
    // Check for recent sent emails
    const sent = broadcasts.filter(b => b.status === 'sent');
    if (sent.length > 0) {
      this.results.passed.push(`${sent.length} emails sent previously`);
    }
  }

  // 6. Check Webhooks
  async checkWebhooks() {
    console.log(chalk.cyan('\n🔗 Checking Webhooks...'));
    
    const data = await this.apiRequest('/webhooks');
    if (!data) return;
    
    const webhooks = data.webhooks || [];
    
    webhooks.forEach(webhook => {
      if (webhook.active) {
        this.results.passed.push(`Webhook: ${webhook.event_name} → ${webhook.endpoint_url}`);
      } else {
        this.results.warnings.push(`Inactive webhook: ${webhook.event_name}`);
      }
    });
    
    // Check for important webhooks
    const purchaseWebhook = webhooks.find(w => w.event_name === 'purchase.created');
    if (!purchaseWebhook) {
      this.results.info.push('No purchase webhook configured (optional)');
    }
  }

  // 7. Check Site Pages
  async checkPages() {
    console.log(chalk.cyan('\n📄 Checking Key Pages...'));
    
    const criticalPages = [
      { path: '/', name: 'Homepage' },
      { path: '/products/secure-parenting-program', name: 'Product page' },
      { path: '/offers/iWQFFjpH/checkout', name: 'Main checkout' },
      { path: '/offers/aLCCMYCf', name: 'PWYC checkout' },
      { path: '/login', name: 'Login' },
      { path: '/pages/terms', name: 'Terms' },
      { path: '/pages/privacy', name: 'Privacy' }
    ];
    
    for (const page of criticalPages) {
      try {
        const response = await axios.get(this.siteUrl + page.path, {
          timeout: 5000,
          validateStatus: () => true
        });
        
        if (response.status === 200) {
          this.results.passed.push(`Page accessible: ${page.name}`);
        } else if (response.status === 404) {
          this.results.critical.push(`Page not found: ${page.name} (${page.path})`);
        } else {
          this.results.warnings.push(`Page issue: ${page.name} (Status: ${response.status})`);
        }
      } catch (error) {
        this.results.critical.push(`Page error: ${page.name}`);
      }
    }
  }

  // 8. Check Domain & SSL
  async checkDomain() {
    console.log(chalk.cyan('\n🌐 Checking Domain & SSL...'));
    
    // Check SSL
    if (this.siteUrl.startsWith('https://')) {
      this.results.passed.push('SSL enabled');
    } else {
      this.results.critical.push('SSL not enabled!');
    }
    
    // Check custom domain
    if (this.siteUrl.includes('.mykajabi.com')) {
      this.results.info.push('Using Kajabi subdomain (consider custom domain)');
    } else {
      this.results.passed.push('Custom domain configured');
    }
  }

  // Generate Report
  generateReport() {
    console.log(chalk.bold.white('\n' + '='.repeat(60)));
    console.log(chalk.bold.white('📊  KAJABI PRE-LAUNCH REPORT'));
    console.log(chalk.bold.white('='.repeat(60)));
    console.log(chalk.gray(`Site: ${this.siteUrl}`));
    console.log(chalk.gray(`Time: ${new Date().toLocaleString()}`));
    console.log(chalk.bold.white('='.repeat(60)));
    
    // Critical Issues
    if (this.results.critical.length > 0) {
      console.log(chalk.bold.red('\n🚨 CRITICAL ISSUES (Must Fix):'));
      this.results.critical.forEach(issue => {
        console.log(chalk.red(`  ✗ ${issue}`));
      });
    }
    
    // Warnings
    if (this.results.warnings.length > 0) {
      console.log(chalk.bold.yellow('\n⚠️  WARNINGS (Should Review):'));
      this.results.warnings.forEach(warning => {
        console.log(chalk.yellow(`  ⚠ ${warning}`));
      });
    }
    
    // Passed
    if (this.results.passed.length > 0) {
      console.log(chalk.bold.green('\n✅ PASSED CHECKS:'));
      this.results.passed.forEach(pass => {
        console.log(chalk.green(`  ✓ ${pass}`));
      });
    }
    
    // Info
    if (this.results.info.length > 0) {
      console.log(chalk.bold.blue('\n🔵 INFORMATION:'));
      this.results.info.forEach(info => {
        console.log(chalk.blue(`  • ${info}`));
      });
    }
    
    // Summary
    console.log(chalk.bold.white('\n' + '='.repeat(60)));
    console.log(chalk.bold.white('SUMMARY:'));
    console.log(chalk.red(`  Critical Issues: ${this.results.critical.length}`));
    console.log(chalk.yellow(`  Warnings: ${this.results.warnings.length}`));
    console.log(chalk.green(`  Passed: ${this.results.passed.length}`));
    
    if (this.results.critical.length === 0) {
      console.log(chalk.bold.green('\n🎉 READY FOR LAUNCH! No critical issues found.'));
    } else {
      console.log(chalk.bold.red('\n❗ ADDRESS CRITICAL ISSUES before launching.'));
    }
    console.log(chalk.bold.white('='.repeat(60) + '\n'));
  }

  // Run all checks
  async runAllChecks() {
    console.log(chalk.bold.cyan('\n🚀 Starting Kajabi Pre-Launch Validation...\n'));
    
    // Authenticate first
    const authenticated = await this.authenticate();
    if (!authenticated) {
      console.error(chalk.red('Failed to authenticate. Please check credentials.'));
      return;
    }
    
    // Run all checks
    await this.checkProducts();
    await this.checkOffers();
    await this.checkForms();
    await this.checkCoupons();
    await this.checkEmails();
    await this.checkWebhooks();
    await this.checkPages();
    await this.checkDomain();
    
    // Generate report
    this.generateReport();
  }
}

// Run the checker
if (require.main === module) {
  const validator = new KajabiLaunchValidator();
  validator.runAllChecks().catch(error => {
    console.error(chalk.red('Error:', error.message));
  });
}

module.exports = KajabiLaunchValidator;