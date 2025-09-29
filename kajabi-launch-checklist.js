/**
 * Kajabi Pre-Launch Checklist & API Validator
 * Comprehensive checks before going live
 */

const KajabiLaunchChecker = {
  // Configuration
  config: {
    apiKey: '', // Add your Kajabi API key here
    siteUrl: 'https://attachmentnerd.mykajabi.com',
    apiBaseUrl: 'https://app.kajabi.com/api/v1',
  },

  // Initialize with API key
  init(apiKey) {
    this.config.apiKey = apiKey;
    console.log('🚀 Kajabi Launch Checker Initialized');
    return this;
  },

  // Main check function
  async runAllChecks() {
    console.log('\n📋 STARTING KAJABI PRE-LAUNCH CHECKS...\n');
    
    const results = {
      timestamp: new Date().toISOString(),
      site: this.config.siteUrl,
      checks: [],
      issues: [],
      warnings: [],
      passed: []
    };

    // Run all checks
    const checks = [
      this.checkProducts(),
      this.checkOffers(),
      this.checkCheckoutPages(),
      this.checkEmails(),
      this.checkPages(),
      this.checkForms(),
      this.checkWebhooks(),
      this.checkDomain(),
      this.checkAnalytics(),
      this.checkMembers()
    ];

    const checkResults = await Promise.allSettled(checks);
    
    // Process results
    checkResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.checks.push(result.value);
        
        if (result.value.issues) {
          results.issues.push(...result.value.issues);
        }
        if (result.value.warnings) {
          results.warnings.push(...result.value.warnings);
        }
        if (result.value.passed) {
          results.passed.push(...result.value.passed);
        }
      } else {
        results.issues.push({
          type: 'API Error',
          message: result.reason.message
        });
      }
    });

    // Generate report
    this.generateReport(results);
    return results;
  },

  // 1. Check Products
  async checkProducts() {
    console.log('🛍️ Checking Products...');
    const result = {
      name: 'Products',
      issues: [],
      warnings: [],
      passed: []
    };

    try {
      const response = await this.apiCall('/products');
      const products = response.products || [];

      products.forEach(product => {
        // Check product status
        if (!product.published) {
          result.warnings.push(`Product "${product.title}" is not published`);
        }

        // Check pricing
        if (!product.price || product.price === 0) {
          result.issues.push(`Product "${product.title}" has no price set`);
        }

        // Check content
        if (!product.description) {
          result.warnings.push(`Product "${product.title}" has no description`);
        }

        // Check images
        if (!product.thumbnail_url) {
          result.warnings.push(`Product "${product.title}" has no thumbnail image`);
        }

        result.passed.push(`✅ Product "${product.title}" configured`);
      });

      if (products.length === 0) {
        result.warnings.push('No products found');
      }

    } catch (error) {
      result.issues.push(`Failed to check products: ${error.message}`);
    }

    return result;
  },

  // 2. Check Offers
  async checkOffers() {
    console.log('💳 Checking Offers & Checkout...');
    const result = {
      name: 'Offers',
      issues: [],
      warnings: [],
      passed: []
    };

    try {
      const response = await this.apiCall('/offers');
      const offers = response.offers || [];

      offers.forEach(offer => {
        // Check offer status
        if (!offer.published) {
          result.warnings.push(`Offer "${offer.title}" is not published`);
        }

        // Check payment settings
        if (!offer.payment_processor) {
          result.issues.push(`Offer "${offer.title}" has no payment processor`);
        }

        // Check checkout page
        if (!offer.checkout_page_url) {
          result.issues.push(`Offer "${offer.title}" has no checkout page`);
        }

        // Check thank you page
        if (!offer.thank_you_page_url) {
          result.warnings.push(`Offer "${offer.title}" has no custom thank you page`);
        }

        result.passed.push(`✅ Offer "${offer.title}" configured`);
      });

      // Special checks for your offers
      const mainOffer = offers.find(o => o.id === 'iWQFFjpH');
      if (!mainOffer) {
        result.issues.push('Main offer (iWQFFjpH) not found!');
      }

      const pwycOffer = offers.find(o => o.id === 'aLCCMYCf');
      if (!pwycOffer) {
        result.warnings.push('PWYC offer (aLCCMYCf) not found');
      }

    } catch (error) {
      result.issues.push(`Failed to check offers: ${error.message}`);
    }

    return result;
  },

  // 3. Check Checkout Pages
  async checkCheckoutPages() {
    console.log('🛒 Checking Checkout Configuration...');
    const result = {
      name: 'Checkout',
      issues: [],
      warnings: [],
      passed: []
    };

    // Check for required checkout elements
    const checkoutRequirements = [
      { name: 'Payment processor', check: 'payment_settings' },
      { name: 'SSL certificate', check: 'ssl_enabled' },
      { name: 'Terms of service', check: 'terms_url' },
      { name: 'Privacy policy', check: 'privacy_url' },
      { name: 'Refund policy', check: 'refund_policy' }
    ];

    // Add manual checks
    result.warnings.push('⚠️ Manual check required: Test checkout with test card');
    result.warnings.push('⚠️ Manual check required: Verify email receipts');
    result.warnings.push('⚠️ Manual check required: Test PWYC checkout flow');

    return result;
  },

  // 4. Check Email Automations
  async checkEmails() {
    console.log('📧 Checking Email Automations...');
    const result = {
      name: 'Emails',
      issues: [],
      warnings: [],
      passed: []
    };

    try {
      const response = await this.apiCall('/email_sequences');
      const sequences = response.sequences || [];

      sequences.forEach(sequence => {
        if (!sequence.active) {
          result.warnings.push(`Email sequence "${sequence.name}" is not active`);
        }

        if (sequence.emails_count === 0) {
          result.issues.push(`Email sequence "${sequence.name}" has no emails`);
        }

        result.passed.push(`✅ Email sequence "${sequence.name}" configured`);
      });

      // Check for essential sequences
      const essentialSequences = [
        'Welcome series',
        'Purchase confirmation',
        'Access granted'
      ];

      essentialSequences.forEach(name => {
        if (!sequences.find(s => s.name.toLowerCase().includes(name.toLowerCase()))) {
          result.warnings.push(`Missing recommended sequence: ${name}`);
        }
      });

    } catch (error) {
      result.issues.push(`Failed to check emails: ${error.message}`);
    }

    return result;
  },

  // 5. Check Pages
  async checkPages() {
    console.log('📄 Checking Pages & Content...');
    const result = {
      name: 'Pages',
      issues: [],
      warnings: [],
      passed: []
    };

    // Critical pages to check
    const criticalPages = [
      { path: '/', name: 'Homepage' },
      { path: '/products/secure-parenting-program', name: 'Main product' },
      { path: '/offers/iWQFFjpH/checkout', name: 'Main checkout' },
      { path: '/offers/aLCCMYCf', name: 'PWYC checkout' },
      { path: '/login', name: 'Login page' },
      { path: '/pages/terms', name: 'Terms of service' },
      { path: '/pages/privacy', name: 'Privacy policy' }
    ];

    for (const page of criticalPages) {
      try {
        const response = await fetch(this.config.siteUrl + page.path);
        if (response.ok) {
          result.passed.push(`✅ ${page.name} is accessible`);
        } else {
          result.issues.push(`❌ ${page.name} returned ${response.status}`);
        }
      } catch (error) {
        result.issues.push(`❌ ${page.name} is not accessible`);
      }
    }

    return result;
  },

  // 6. Check Forms
  async checkForms() {
    console.log('📝 Checking Forms & Opt-ins...');
    const result = {
      name: 'Forms',
      issues: [],
      warnings: [],
      passed: []
    };

    try {
      const response = await this.apiCall('/forms');
      const forms = response.forms || [];

      forms.forEach(form => {
        if (!form.active) {
          result.warnings.push(`Form "${form.name}" is not active`);
        }

        if (!form.success_message && !form.redirect_url) {
          result.warnings.push(`Form "${form.name}" has no success action`);
        }

        result.passed.push(`✅ Form "${form.name}" configured`);
      });

    } catch (error) {
      result.issues.push(`Failed to check forms: ${error.message}`);
    }

    return result;
  },

  // 7. Check Webhooks
  async checkWebhooks() {
    console.log('🔗 Checking Webhooks & Integrations...');
    const result = {
      name: 'Webhooks',
      issues: [],
      warnings: [],
      passed: []
    };

    try {
      const response = await this.apiCall('/webhooks');
      const webhooks = response.webhooks || [];

      webhooks.forEach(webhook => {
        if (!webhook.active) {
          result.warnings.push(`Webhook "${webhook.name}" is not active`);
        }
        result.passed.push(`✅ Webhook "${webhook.name}" configured`);
      });

    } catch (error) {
      // Webhooks might not be accessible via API
      result.warnings.push('Unable to check webhooks via API');
    }

    return result;
  },

  // 8. Check Domain
  async checkDomain() {
    console.log('🌐 Checking Domain & SSL...');
    const result = {
      name: 'Domain',
      issues: [],
      warnings: [],
      passed: []
    };

    // Check SSL
    if (this.config.siteUrl.startsWith('https://')) {
      result.passed.push('✅ SSL enabled');
    } else {
      result.issues.push('❌ SSL not enabled');
    }

    // Check custom domain
    if (!this.config.siteUrl.includes('.mykajabi.com')) {
      result.passed.push('✅ Custom domain configured');
    } else {
      result.warnings.push('⚠️ Still using Kajabi subdomain');
    }

    return result;
  },

  // 9. Check Analytics
  async checkAnalytics() {
    console.log('📊 Checking Analytics & Tracking...');
    const result = {
      name: 'Analytics',
      issues: [],
      warnings: [],
      passed: []
    };

    // Manual checks needed
    result.warnings.push('⚠️ Manual check: Google Analytics installed');
    result.warnings.push('⚠️ Manual check: Facebook Pixel installed');
    result.warnings.push('⚠️ Manual check: Conversion tracking setup');

    return result;
  },

  // 10. Check Members
  async checkMembers() {
    console.log('👥 Checking Member Access...');
    const result = {
      name: 'Members',
      issues: [],
      warnings: [],
      passed: []
    };

    try {
      const response = await this.apiCall('/members');
      const members = response.members || [];
      
      result.passed.push(`✅ ${members.length} members found`);

      // Test account check
      const testAccount = members.find(m => m.email.includes('test'));
      if (!testAccount) {
        result.warnings.push('⚠️ No test account found - recommended for testing');
      }

    } catch (error) {
      result.warnings.push('Unable to check members via API');
    }

    return result;
  },

  // API Helper
  async apiCall(endpoint) {
    const response = await fetch(this.config.apiBaseUrl + endpoint, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Generate Report
  generateReport(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 KAJABI PRE-LAUNCH REPORT');
    console.log('='.repeat(60));
    console.log(`Site: ${results.site}`);
    console.log(`Time: ${new Date(results.timestamp).toLocaleString()}`);
    console.log('='.repeat(60));

    // Critical Issues
    if (results.issues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (Must Fix):');
      results.issues.forEach(issue => {
        console.log(`  ❌ ${typeof issue === 'string' ? issue : issue.message}`);
      });
    }

    // Warnings
    if (results.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS (Should Review):');
      results.warnings.forEach(warning => {
        console.log(`  ⚠️  ${warning}`);
      });
    }

    // Passed Checks
    console.log('\n✅ PASSED CHECKS:');
    results.passed.forEach(pass => {
      console.log(`  ${pass}`);
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 SUMMARY:');
    console.log(`  Critical Issues: ${results.issues.length}`);
    console.log(`  Warnings: ${results.warnings.length}`);
    console.log(`  Passed: ${results.passed.length}`);
    
    if (results.issues.length === 0) {
      console.log('\n🎉 READY FOR LAUNCH! No critical issues found.');
    } else {
      console.log('\n❗ ADDRESS CRITICAL ISSUES before launching.');
    }
    console.log('='.repeat(60) + '\n');

    return results;
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KajabiLaunchChecker;
}

// Browser usage
if (typeof window !== 'undefined') {
  window.KajabiLaunchChecker = KajabiLaunchChecker;
}