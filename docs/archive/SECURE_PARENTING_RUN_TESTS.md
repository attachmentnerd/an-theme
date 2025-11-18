# Quick Test Running Guide

## 🚀 Run Tests Locally (Not in Current Environment)

The current cloud environment blocks browser downloads. Run these on your local machine:

### Full Playwright Tests (Best Option)

```bash
# One-time setup
npm install -D @playwright/test
npx playwright install chromium

# Run all tests
npx playwright test test-secure-parenting.spec.js

# Run with visible browser
npx playwright test test-secure-parenting.spec.js --headed

# Run specific test
npx playwright test test-secure-parenting.spec.js -g "broken links"
```

### Simple HTTP Tests

```bash
# One-time setup
npm install axios cheerio

# Run tests
node test-secure-parenting-simple.js
```

## 📋 What Gets Tested

### ✅ Full Playwright Suite Tests:
1. **Login Flow** - Verifies login works with provided credentials
2. **Program Discovery** - Finds the Secure Parenting Program
3. **Broken Links** - Checks 50+ internal links for 404s
4. **Responsive Design** - Tests on Mobile (375px), Tablet (768px), Desktop (1920px)
5. **Console Errors** - Captures JavaScript errors
6. **Screenshots** - Takes pictures at each step

### ✅ Simple HTTP Tests:
1. **Login** - Attempts authentication
2. **Navigation** - Finds program URL
3. **Link Checking** - HTTP status codes for 30 links
4. **Basic Responsive** - Checks viewport meta, mobile menu, etc.

## 📊 Test Output

### Playwright generates:
- `test-report.json` - Detailed results
- `test-screenshots/` - Visual proof
  - login-page.png
  - after-login.png
  - program-page.png
  - responsive-mobile.png
  - responsive-tablet.png
  - responsive-desktop.png

### Simple tests generate:
- `test-results.json` - JSON report with findings
- Console output with color-coded results

## 🐛 Common Issues

### "Cannot find module '@playwright/test'"
```bash
npm install -D @playwright/test
```

### "Executable doesn't exist"
```bash
npx playwright install chromium
```

### "403 Forbidden" or "Access Denied"
- Site has Cloudflare/bot protection
- May need to adjust headers or use stealth mode
- Some tests may fail, but link checking should work

## 🔍 Reading Results

### Playwright Console Output:
```
✅ [1/5] Login and access Secure Parenting Program (2.3s)
✅ [2/5] Find and navigate to Secure Parenting Program (1.8s)
✅ [3/5] Check for broken links (12.4s)
❌ [4/5] Test responsive design (failed)
✅ [5/5] Check for console errors and warnings (3.1s)
```

### test-report.json Structure:
```json
{
  "brokenLinks": [
    { "url": "...", "status": 404, "text": "..." }
  ],
  "responsiveIssues": [
    { "viewport": "Mobile", "issue": "...", "details": "..." }
  ],
  "consoleErrors": [
    { "page": "...", "message": "..." }
  ]
}
```

## 🎯 Quick Manual Check (No Install Needed)

If you can't run automated tests, manually check:

1. **Login**: https://attachmentnerd.com/login
   - Email: trevorharwood+claude@gmail.com
   - Password: claudeskill

2. **Find Program**: Navigate to Library/Courses

3. **Click Around**: Test all buttons and links

4. **Mobile Test**:
   - F12 → Toggle device toolbar (Ctrl+Shift+M)
   - Set to iPhone SE (375px)
   - Navigate program

5. **Console Errors**:
   - F12 → Console tab
   - Look for red error messages

## 💡 Pro Tips

- Run in headless mode for speed: `--headed=false`
- Increase timeout for slow pages: `--timeout=60000`
- Run specific viewport: Edit test file viewports array
- Debug failing test: Add `await page.pause()` in test
- See what's happening: Use `--headed --slow-mo=1000`

## 📞 Need Help?

If tests fail or you see issues:
1. Check TESTING-GUIDE.md for manual checklist
2. Review test-report.json for details
3. Look at screenshots in test-screenshots/
4. Note exact error messages
5. Document steps to reproduce

---

**Files Created:**
- `test-secure-parenting.spec.js` - Full Playwright test suite
- `test-secure-parenting-simple.js` - HTTP-based checker
- `TESTING-GUIDE.md` - Comprehensive manual testing guide
- `RUN-TESTS.md` - This quick reference

**Status:** Tests ready to run in local environment (browser downloads blocked in current cloud environment)
