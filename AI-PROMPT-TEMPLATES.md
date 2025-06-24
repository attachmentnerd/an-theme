# AI Prompt Templates for AN Theme Pages

Use these templates to generate consistent, brand-aligned pages for the Attachment Nerd website.

## Brand Guidelines for All Prompts

Always include these brand elements:
- **Colors**: #5E3BFF (primary purple), #18D5E4 (teal), #FF8BCB (peach), #FFE86B (lemon), #E9E6FF (lavender background)
- **Font**: Inter font family
- **Tone**: Warm, professional, science-backed but approachable
- **Mission**: "Equip every caregiver with science-backed, relationship-building tools so children grow up feeling safe, seen, soothed, and secure."

## 1. About Page Template

```
Create a complete HTML about page for Attachment Nerd with these sections:

1. Hero Section:
   - Title: "Meet the Attachment Nerd"
   - Subtitle about the mission
   - Large founder image with <!--@id=founder_hero-->
   - Lavender (#E9E6FF) background

2. Story Section:
   - 2-column layout
   - Personal story of founder
   - Image of founder with family <!--@id=founder_family-->

3. Credentials Section:
   - Grid of certifications/qualifications
   - Icons for each credential <!--@id=cred_1_icon--> etc.
   - Include: PhD, certifications, years of experience

4. Values Section:
   - 3-4 core values with icons
   - Each value has icon <!--@id=value_1_icon--> etc.
   - Short description for each

5. Call to Action:
   - Invitation to join the community
   - Primary button to courses/resources

Use brand colors, Inter font, mobile responsive design.
Include inline CSS. Use Unsplash placeholder images.
```

## 2. Services/Programs Page Template

```
Create a complete HTML services page for parenting programs:

1. Hero Section:
   - Title: "Transform Your Parenting Journey"
   - Subtitle about available programs
   - Background image <!--@id=programs_hero-->

2. Featured Program:
   - Large showcase of signature program
   - Image <!--@id=signature_program-->
   - Benefits list
   - Enrollment CTA

3. Program Grid:
   - 3-column grid of programs
   - Each with image <!--@id=program_1_img--> etc.
   - Title, description, price
   - "Learn More" button

4. Comparison Table:
   - Compare program features
   - Checkmarks for included features
   - Highlight recommended option

5. FAQ Section:
   - Common questions about programs
   - Expandable answers

6. Consultation CTA:
   - Offer free consultation
   - Contact form or calendar link

Use AN brand colors, modern card designs with shadows.
Include hover effects and smooth transitions.
```

## 3. Testimonials/Success Stories Page

```
Create a complete HTML testimonials page showcasing parent success stories:

1. Hero Section:
   - Title: "Real Stories, Real Transformations"
   - Statistics bar (families helped, success rate, etc.)
   - Soft background color

2. Featured Story:
   - Video thumbnail <!--@id=featured_video-->
   - Large quote
   - Parent name and photo <!--@id=featured_parent-->
   - Before/after transformation story

3. Stories Grid:
   - 2-3 column masonry grid
   - Mix of text testimonials and photos
   - Parent photos <!--@id=parent_1_photo--> etc.
   - Star ratings
   - Program they completed

4. Category Filter:
   - Filter by: Challenge type, Age group, Program
   - Smooth filtering animation

5. Results Section:
   - Data visualization of outcomes
   - Charts/graphs showing improvements
   - Icons <!--@id=result_1_icon--> etc.

6. Your Story CTA:
   - Encourage visitors to start their journey
   - Link to programs or consultation

Use warm colors, authentic feel, varied card heights.
Include social proof elements (verified badges).
```

## 4. Resources/Blog Landing Page

```
Create a complete HTML resources page for parenting articles and guides:

1. Hero Section:
   - Title: "Science-Backed Parenting Resources"
   - Search bar
   - Category navigation
   - Subtle background pattern

2. Featured Resource:
   - Large card with image <!--@id=featured_resource-->
   - Download count or read time
   - Author info

3. Resource Categories:
   - Icon grid of categories <!--@id=cat_1_icon--> etc.
   - Categories: Guides, Worksheets, Videos, Research
   - Number of resources in each

4. Recent Articles:
   - 3-column blog post grid
   - Thumbnail images <!--@id=article_1_thumb--> etc.
   - Title, excerpt, date
   - Author avatar <!--@id=author_1_avatar--> etc.

5. Free Resources:
   - Highlight downloadable resources
   - Email opt-in for access
   - Preview images <!--@id=resource_1_preview--> etc.

6. Newsletter Signup:
   - Weekly parenting tips signup
   - Benefit list
   - Simple form

Use clean, content-focused design.
Add reading time, category tags, share buttons.
```

## 5. Workshop/Event Page

```
Create a complete HTML page for a parenting workshop or course launch:

1. Hero Section:
   - Workshop title and date
   - Countdown timer
   - Speaker image <!--@id=speaker_photo-->
   - Register button
   - Video background or pattern

2. What You'll Learn:
   - 3-4 key outcomes with icons <!--@id=outcome_1_icon--> etc.
   - Specific, actionable benefits
   - Target audience description

3. Agenda/Schedule:
   - Timeline of workshop modules
   - Icons for each section <!--@id=module_1_icon--> etc.
   - Breaks and Q&A sessions marked

4. Instructor Bio:
   - Photo and credentials <!--@id=instructor_photo-->
   - Experience highlights
   - Personal connection to topic

5. Pricing Options:
   - Early bird vs regular pricing
   - Payment plan available
   - Money-back guarantee badge
   - Bonuses included

6. Testimonials Slider:
   - Previous workshop feedback
   - Participant photos <!--@id=testimonial_1_photo--> etc.
   - Specific results achieved

7. FAQ and Final CTA:
   - Address common concerns
   - Urgency element (limited seats)
   - Clear registration button

Use event-specific styling, countdown timer CSS.
Include trust badges and secure checkout indicators.
```

## 6. Book/Product Landing Page

```
Create a complete HTML page for a parenting book or digital product:

1. Hero Section:
   - Book cover image <!--@id=book_cover-->
   - Title and subtitle
   - Author name with photo <!--@id=author_photo-->
   - Buy buttons (multiple retailers)
   - Reader rating stars

2. Book Benefits:
   - What readers will gain
   - Icon list of benefits <!--@id=benefit_1_icon--> etc.
   - Target audience description

3. Look Inside:
   - Sample pages preview <!--@id=sample_1--> etc.
   - Table of contents
   - Chapter highlights

4. Reviews Section:
   - Editorial reviews with logos <!--@id=publisher_1_logo--> etc.
   - Reader reviews with photos <!--@id=reader_1_photo--> etc.
   - Amazon/Goodreads ratings

5. Author Section:
   - Extended bio
   - Other books/resources
   - Media appearances logos <!--@id=media_1_logo--> etc.

6. Bonus Content:
   - Free resources with book purchase
   - Workbook preview <!--@id=workbook_preview-->
   - Video content access

7. Purchase Options:
   - Format options (print, ebook, audio)
   - Retailer buttons
   - Bulk order information

Use book-focused design, emphasis on credibility.
Include "As seen in" media logos.
```

## General Tips for All Pages

1. **Image IDs**: Always use descriptive IDs with <!--@id=name--> format
2. **Accessibility**: Include descriptive alt text for all images
3. **Performance**: Use loading="lazy" on images below the fold
4. **Responsiveness**: Design mobile-first with desktop enhancements
5. **Consistency**: Follow AN brand colors and typography
6. **CTAs**: One primary CTA per viewport
7. **Trust Elements**: Include credentials, testimonials, guarantees

## Example Usage

1. Copy the appropriate template
2. Paste into your AI chat
3. Add any specific requirements
4. Save output to `llm-drafts/[pagename].html`
5. Run `npm run inject:drafts`
6. Export theme and upload to Kajabi