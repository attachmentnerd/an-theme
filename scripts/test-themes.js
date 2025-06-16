const fs = require('fs-extra');
const path = require('path');

const REQUIRED_FILES = {
  all: [
    'config/settings_schema.json',
    'config/settings_data.json',
    'assets/styles.scss.liquid'
  ],
  website: [
    'layouts/theme.liquid',
    'templates/index.liquid',
    'templates/404.liquid',
    'templates/about.liquid',
    'templates/blog.liquid',
    'templates/blog_post.liquid',
    'templates/categories.liquid',
    'templates/category.liquid',
    'templates/contact.liquid',
    'templates/library.liquid',
    'templates/page.liquid',
    'templates/post.liquid'
  ],
  landing: [
    'templates/index.liquid'
  ],
  product: [
    'layouts/theme.liquid',
    'templates/sales_page.liquid',
    'templates/thank_you.liquid'
  ],
  email: [
    'templates/email.liquid'
  ]
};

function testTheme(type) {
  console.log(`\nTesting ${type} theme...`);
  const themePath = path.join(__dirname, '..', 'themes', type);
  
  if (!fs.existsSync(themePath)) {
    console.error(`✗ Theme directory not found: ${themePath}`);
    return false;
  }

  let passed = true;

  // Check common required files
  for (const file of REQUIRED_FILES.all) {
    const filePath = path.join(themePath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`✗ Missing required file: ${file}`);
      passed = false;
    } else {
      console.log(`✓ Found ${file}`);
    }
  }

  // Check type-specific files
  if (REQUIRED_FILES[type]) {
    for (const file of REQUIRED_FILES[type]) {
      const filePath = path.join(themePath, file);
      if (!fs.existsSync(filePath)) {
        console.error(`✗ Missing required file: ${file}`);
        passed = false;
      } else {
        console.log(`✓ Found ${file}`);
      }
    }
  }

  // Check settings_validatable
  const schemaPath = path.join(themePath, 'config', 'settings_schema.json');
  if (fs.existsSync(schemaPath)) {
    try {
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      const themeInfo = schema.find(s => s.name === 'theme_info');
      if (!themeInfo || !themeInfo.settings_validatable) {
        console.error('✗ Missing settings_validatable: true in theme_info');
        passed = false;
      } else {
        console.log('✓ settings_validatable: true');
      }
    } catch (e) {
      console.error('✗ Invalid settings_schema.json:', e.message);
      passed = false;
    }
  }

  // Check for forbidden syntax
  const checkForbiddenSyntax = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('_')) {
        checkForbiddenSyntax(filePath);
      } else if (file.endsWith('.liquid')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('{% render ')) {
          console.error(`✗ Found {% render %} in ${filePath} - use {% include %} instead`);
          passed = false;
        }
      }
    }
  };

  checkForbiddenSyntax(themePath);

  return passed;
}

// Test all themes
const types = ['website', 'landing', 'product'];
let allPassed = true;

for (const type of types) {
  if (!testTheme(type)) {
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n✓ All themes passed validation!');
} else {
  console.error('\n✗ Some themes failed validation');
  process.exit(1);
}