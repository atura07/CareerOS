const { execSync } = require('child_process');

// Check if puppeteer is available locally
try {
  require.resolve('puppeteer');
} catch (e) {
  console.log('Installing puppeteer...');
  execSync('npm install puppeteer', { stdio: 'inherit', cwd: __dirname + '/..' });
}

(async () => {
  const puppeteer = require('puppeteer');
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Viewport: 1440 × 900, 100% zoom (deviceScaleFactor 1)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Collect console logs and errors
  const logs = [];
  const errors = [];
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => errors.push(`[PAGE ERROR] ${err.message}`));

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for animations to settle
  await new Promise(r => setTimeout(r, 3000));

  // Verify Hero section exists
  const heroSectionCount = await page.locator('.career-hero').count();
  console.log(`Found ${heroSectionCount} .career-hero element(s)`);

  // Take full-page screenshot
  const outputPath = 'c:/Users/yadaa/OneDrive/Desktop/CareerOS/landing-page-browser.png';
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log('Screenshot saved to: ' + outputPath);

  // Print console logs
  console.log('\n=== CONSOLE OUTPUT ===');
  logs.forEach(l => console.log(l));
  if (logs.length === 0) console.log('(no console output)');

  // Print errors
  console.log('\n=== ERRORS ===');
  errors.forEach(e => console.log(e));
  if (errors.length === 0) console.log('No page errors or runtime errors found ✓');

  // Show file size
  const fs = require('fs');
  const stats = fs.statSync(outputPath);
  console.log(`\nScreenshot file size: ${(stats.size / 1024).toFixed(1)} KB`);

  await browser.close();
  console.log('\nDone!');
})();

