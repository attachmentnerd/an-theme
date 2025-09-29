# 🚀 Attachment Nerd - Kajabi Launch Checklist

## 🔴 CRITICAL (Must Complete Before Launch)

### 💳 Payment & Checkout
- [ ] Stripe/PayPal connected and verified
- [ ] Test purchase with test credit card
- [ ] Main offer checkout works: `/offers/iWQFFjpH/checkout`
- [ ] PWYC checkout works: `/offers/aLCCMYCf`
- [ ] Receipt emails sending correctly
- [ ] Thank you page configured
- [ ] Refund policy page exists and linked

### 🔐 Access & Delivery
- [ ] Product access granted automatically after purchase
- [ ] Login page working
- [ ] Password reset working
- [ ] Member dashboard accessible
- [ ] Course content accessible to enrolled members
- [ ] Test with a real test purchase

### 📄 Legal Pages
- [ ] Terms of Service page live
- [ ] Privacy Policy page live
- [ ] Refund Policy page live
- [ ] GDPR/Cookie notice if needed
- [ ] Links in footer working

### 🌐 Domain & SSL
- [ ] SSL certificate active (https://)
- [ ] Custom domain configured (if not using .mykajabi.com)
- [ ] Domain DNS properly configured
- [ ] No mixed content warnings

## 🟡 IMPORTANT (Should Complete)

### 📧 Email Automations
- [ ] Welcome email sequence active
- [ ] Purchase confirmation email configured
- [ ] Access granted email configured
- [ ] Abandoned cart sequence (if using)
- [ ] Test all email flows with test purchase
- [ ] Email footer has unsubscribe link
- [ ] From email address verified

### 📊 Analytics & Tracking
- [ ] Google Analytics installed
- [ ] Google Tag Manager configured
- [ ] Facebook Pixel installed
- [ ] Conversion tracking for purchases
- [ ] Test conversion tracking
- [ ] UTM parameters working

### 🎨 Theme & Design
- [ ] Homepage loads correctly
- [ ] Mobile responsive testing done
- [ ] Navigation menu working
- [ ] Footer displaying correctly (or hidden where needed)
- [ ] All images optimized and loading
- [ ] Favicon uploaded
- [ ] Social sharing images configured

### 🔗 Redirects
- [ ] `/checkout` → main offer
- [ ] `/pay-what-you-can` → PWYC offer
- [ ] `/pwyc` → PWYC offer
- [ ] `/join` → main offer
- [ ] `/book` → Amazon link
- [ ] Social shortcuts working (/instagram, /youtube, etc.)

## 🔵 NICE TO HAVE (Can Do After Launch)

### 📝 Forms & Opt-ins
- [ ] Newsletter signup form working
- [ ] Lead magnet delivery automated
- [ ] Two-step opt-in configured
- [ ] Pop-ups/slide-ins timed correctly
- [ ] Form success messages configured
- [ ] VideoAsk widget installed (first visit only)

### 🔍 SEO
- [ ] Page titles optimized
- [ ] Meta descriptions written
- [ ] Open Graph tags configured
- [ ] XML sitemap submitted
- [ ] Robots.txt configured
- [ ] Schema markup added

### 📢 Social Proof
- [ ] Testimonials displayed
- [ ] Trust badges visible
- [ ] Social media links working
- [ ] Reviews/ratings showing
- [ ] Case studies published

### 🔧 Testing
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile device testing (iPhone, Android)
- [ ] Tablet testing
- [ ] Page speed optimized (< 3 seconds)
- [ ] Broken link check completed
- [ ] 404 page configured

## 🧑 Test Scenarios to Run

### Purchase Flow Test
1. [ ] Visit homepage
2. [ ] Click "Join" or "Buy" button
3. [ ] Land on checkout page
4. [ ] Fill out checkout form
5. [ ] Complete test purchase
6. [ ] Receive confirmation email
7. [ ] Access thank you page
8. [ ] Login to member area
9. [ ] Access course content
10. [ ] Logout and login again

### PWYC Flow Test
1. [ ] Visit PWYC page
2. [ ] Select $0 option
3. [ ] Complete checkout
4. [ ] Verify full access granted
5. [ ] Check email confirmation

### Mobile Test
1. [ ] Homepage loads properly
2. [ ] Navigation menu works
3. [ ] Checkout form usable
4. [ ] Videos play correctly
5. [ ] Text is readable

## 💡 Quick Fixes for Common Issues

### Footer Won't Hide
- Upload latest theme version (v33.5.0+)
- Check page settings for footer toggle
- Clear Kajabi cache

### Checkout Not Working
- Verify Stripe is connected
- Check offer is published
- Ensure checkout page is published
- Test in incognito mode

### Emails Not Sending
- Check email is verified in Kajabi
- Review automation triggers
- Check spam folder
- Verify DKIM/SPF records

### Videos Not Playing
- Check video processing status
- Verify permissions settings
- Test in different browser
- Check bandwidth/connection

## 📢 Launch Day Tasks

1. [ ] Remove any "coming soon" pages
2. [ ] Activate all email sequences
3. [ ] Enable payment processing (if in test mode)
4. [ ] Post on social media
5. [ ] Send launch email to list
6. [ ] Monitor for any issues
7. [ ] Check analytics are tracking
8. [ ] Test purchase one more time
9. [ ] Celebrate! 🎉

## 📞 Support Contacts

- Kajabi Support: support@kajabi.com
- Stripe Support: support.stripe.com
- Domain Registrar: [Your registrar support]
- Email Service: [If using external email]

## 📅 Post-Launch Week 1

- [ ] Monitor conversion rates
- [ ] Check for customer support issues
- [ ] Review abandoned carts
- [ ] Analyze traffic sources
- [ ] Gather initial feedback
- [ ] Fix any reported bugs
- [ ] Optimize based on data

---

**Last Updated:** September 28, 2025
**Theme Version:** v33.5.0
**Ready for Launch:** ☐ (Check all critical items first!)