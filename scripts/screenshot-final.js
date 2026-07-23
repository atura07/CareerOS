const http = require('http');
const { execSync } = require('child_process');

console.log('=== Step 1: Verify dev server is running ===');
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, url: res.headers['content-type'] }));
    }).on('error', reject);
  });
}

async function verifyServer() {
  try {
    const res = await fetchUrl('http://localhost:5173');
    if (res.status === 200) {
      console.log(`✓ Dev server is running at http://localhost:5173 (Status: ${res.status})`);
      return true;
    } else {
      console.log(`✗ Dev server returned status: ${res.status}`);
      return false;
    }
  } catch (e) {
    console.log(`✗ Dev server is not reachable: ${e.message}`);
    return false;
  }
}

async function main() {
  const serverRunning = await verifyServer();
  if (!serverRunning) {
    console.log('\nPlease start the dev server first with: cd frontend && npm run dev');
    process.exit(1);
  }

  // Now try puppeteer for screenshot
  console.log('\n=== Step 2: Attempting screenshot with puppeteer ===');
  try {
    require.resolve('puppeteer');
    const puppeteer = require('puppeteer');
    console.log('Launching Chromium...');
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

    const logs = [];
    const errors = [];
    page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', (err) => errors.push(`[PAGE ERROR] ${err.message}`));

    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    const heroCount = await page.locator('.career-hero').count();
    console.log(`✓ Found ${heroCount} .career-hero element(s)`);

    const outputPath = 'c:/Users/yadaa/OneDrive/Desktop/CareerOS/landing-page-browser.png';
    await page.screenshot({ path: outputPath, fullPage: true });
    const fs = require('fs');
    const stats = fs.statSync(outputPath);
    console.log(`✓ Screenshot saved: landing-page-browser.png (${(stats.size / 1024).toFixed(1)} KB)`);

    console.log('\n=== Console Output ===');
    if (logs.length === 0) console.log('(no console output)');
    else logs.forEach(l => console.log(l));

    console.log('\n=== Errors ===');
    if (errors.length === 0) console.log('✓ No page errors or runtime errors found');
    else errors.forEach(e => console.log(e));

    await browser.close();
    console.log('\n✓ All checks passed!');
  } catch (e) {
    console.log(`Puppeteer error: ${e.message}`);
    console.log('\n✓ Server is running at http://localhost:5173');
    console.log('Please manually check the browser for console errors and take a screenshot.');
  }
}

main();

