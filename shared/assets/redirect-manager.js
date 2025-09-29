/**
 * Redirect Manager for AN Theme
 * Handles page redirects based on URL patterns
 */

(function() {
  'use strict';
  
  // Configuration: Add your redirect rules here
  const redirectRules = [
    // Example redirects - uncomment and modify as needed
    
    // Exact match redirect
    // { from: '/old-page', to: '/new-page', type: 'exact' },
    
    // Pattern match redirect (contains)
    // { from: '/old-course', to: '/products/new-course', type: 'contains' },
    
    // Starts with redirect
    // { from: '/blog/old-', to: '/blog/new-', type: 'starts' },
    
    // Regex pattern redirect
    // { from: /\/course\/(\d+)/, to: '/product/$1', type: 'regex' },
    
    // Temporary redirect (302)
    // { from: '/sale', to: '/offers/black-friday', type: 'exact', permanent: false },
    
    // Redirect with query string preservation
    // { from: '/old-checkout', to: '/checkout', type: 'exact', preserveQuery: true },
    
    // Conditional redirect based on referrer
    // { from: '/landing', to: '/welcome', type: 'exact', condition: 'referrer', value: 'facebook.com' },
    
    // Time-based redirect (for limited offers)
    // { from: '/offer', to: '/expired', type: 'exact', expires: '2024-12-31' },
    
    // Device-specific redirect
    // { from: '/app', to: '/mobile-app', type: 'exact', condition: 'mobile' },
  ];
  
  // Advanced configuration
  const config = {
    enabled: true, // Master switch
    debugMode: false, // Set to true to log redirect attempts
    delay: 0, // Milliseconds to wait before redirect (0 = immediate)
    showMessage: false, // Show "Redirecting..." message
    messageText: 'Redirecting you to the right place...',
    excludePaths: ['/admin', '/editor'], // Never redirect these paths
  };
  
  // Don't run if disabled
  if (!config.enabled) return;
  
  // Get current page info
  const currentPath = window.location.pathname;
  const currentUrl = window.location.href;
  const queryString = window.location.search;
  const referrer = document.referrer;
  
  // Check if current path is excluded
  if (config.excludePaths.some(path => currentPath.includes(path))) {
    if (config.debugMode) console.log('Path excluded from redirects:', currentPath);
    return;
  }
  
  // Helper function to check mobile device
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // Helper function to check if date has expired
  function isExpired(expiryDate) {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    return now > expiry;
  }
  
  // Helper function to check condition
  function checkCondition(rule) {
    if (!rule.condition) return true;
    
    switch(rule.condition) {
      case 'referrer':
        return referrer.includes(rule.value);
      case 'mobile':
        return isMobile();
      case 'desktop':
        return !isMobile();
      case 'query':
        return queryString.includes(rule.value);
      default:
        return true;
    }
  }
  
  // Process redirect rules
  function processRedirect(rule) {
    let shouldRedirect = false;
    let targetUrl = rule.to;
    
    // Check if rule has expired
    if (rule.expires && isExpired(rule.expires)) {
      if (config.debugMode) console.log('Redirect rule expired:', rule);
      return;
    }
    
    // Check conditions
    if (!checkCondition(rule)) {
      if (config.debugMode) console.log('Condition not met:', rule);
      return;
    }
    
    // Check match type
    switch(rule.type) {
      case 'exact':
        shouldRedirect = currentPath === rule.from;
        break;
        
      case 'contains':
        shouldRedirect = currentPath.includes(rule.from);
        break;
        
      case 'starts':
        shouldRedirect = currentPath.startsWith(rule.from);
        if (shouldRedirect && rule.type === 'starts') {
          // Replace the matching part for dynamic redirects
          targetUrl = currentPath.replace(rule.from, rule.to);
        }
        break;
        
      case 'regex':
        const regex = rule.from;
        const match = currentPath.match(regex);
        shouldRedirect = !!match;
        if (shouldRedirect && match) {
          // Replace with captured groups
          targetUrl = rule.to;
          match.forEach((group, index) => {
            targetUrl = targetUrl.replace('$' + index, group);
          });
        }
        break;
        
      default:
        shouldRedirect = currentPath === rule.from;
    }
    
    // Perform redirect if matched
    if (shouldRedirect) {
      // Preserve query string if requested
      if (rule.preserveQuery && queryString) {
        targetUrl += queryString;
      }
      
      // Log redirect in debug mode
      if (config.debugMode) {
        console.log('Redirecting from:', currentPath, 'to:', targetUrl);
        console.log('Rule:', rule);
      }
      
      // Show message if configured
      if (config.showMessage) {
        document.body.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
            <div style="text-align: center;">
              <div style="font-size: 24px; color: #5E3BFF; margin-bottom: 10px;">${config.messageText}</div>
              <div style="font-size: 14px; color: #6B7280;">Please wait...</div>
            </div>
          </div>
        `;
      }
      
      // Perform the redirect
      setTimeout(() => {
        if (rule.permanent !== false) {
          // 301 permanent redirect (default)
          window.location.replace(targetUrl);
        } else {
          // 302 temporary redirect
          window.location.href = targetUrl;
        }
      }, config.delay);
      
      return true; // Stop processing other rules
    }
  }
  
  // Check all redirect rules
  for (const rule of redirectRules) {
    if (processRedirect(rule)) {
      break; // Stop after first matching rule
    }
  }
  
  // Debug mode: Log current path if no redirects matched
  if (config.debugMode && redirectRules.length > 0) {
    console.log('No redirect rules matched for:', currentPath);
  }
})();

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { redirectRules, config };
}