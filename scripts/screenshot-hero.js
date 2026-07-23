const { chromium } = require('playwright');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    console.log('Browser launched');
    
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Collect console logs and errors
    const logs = [];
    const errors = [];
    page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', (err) => errors.push(`[PAGE ERROR] ${err.message}`));

    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded');

    // Wait a bit for animations to settle
    await page.waitForTimeout(3000);

    // Check for HeroSection presence
    const heroSectionCount = await page.locator('.career-hero').count();
    console.log(`Found ${heroSectionCount} .career-hero element(s)`);

    // Take a full-page screenshot - save absolute path
    const outputPath = 'c:/Users/yadaa/OneDrive/Desktop/CareerOS/landing-page-review.png';
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log('Screenshot saved to: ' + outputPath);

    // Print console logs
    console.log('\n=== CONSOLE OUTPUT ===');
    if (logs.length === 0) {
      console.log('(no console output - no warnings/errors)');
    } else {
      logs.forEach(l => console.log(l));
    }

    // Print errors
    console.log('\n=== ERRORS ===');
    if (errors.length === 0) {
      console.log('No page errors or runtime errors found ✓');
    } else {
      errors.forEach(e => console.log(e));
    }

    await browser.close();
    console.log('\nDone!');
    
    // Verify file exists
    const fs = require('fs');
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log('Screenshot file size: ' + (stats.size / 1024).toFixed(1) + ' KB');
    }
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();

