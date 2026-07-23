// Alternative: use the built-in Vite fetch to verify the app loads, and then prompt user manually
const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Verifying the application is running at http://localhost:5173...\n');
  
  try {
    const res = await fetchUrl('http://localhost:5173');
    console.log(`Status: ${res.status} ${res.status === 200 ? '✓ OK' : '✗ ERROR'}`);
    
    // Check for basic HTML structure
    if (res.data.includes('<div id="root">
