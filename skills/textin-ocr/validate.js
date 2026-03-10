#!/usr/bin/env node

/**
 * Validation script for Textin OCR Skill
 * Checks configuration and API connectivity
 */

const https = require('https');

const APP_ID = process.env.TEXTIN_APP_ID;
const SECRET_CODE = process.env.TEXTIN_SECRET_CODE;

console.log('═'.repeat(80));
console.log('Textin OCR Skill - Configuration Validator');
console.log('═'.repeat(80));
console.log('');

// Check configuration
console.log('✓ Configuration Check:');
if (!APP_ID || !SECRET_CODE) {
  console.error('  ❌ Missing credentials!');
  console.error('  Please set environment variables:');
  console.error('    export TEXTIN_APP_ID="your_app_id"');
  console.error('    export TEXTIN_SECRET_CODE="your_secret_code"');
  console.error('');
  process.exit(1);
}

console.log(`  App ID: ${APP_ID.substring(0, 8)}...${APP_ID.substring(APP_ID.length - 4)}`);
console.log(`  Secret Code: ${SECRET_CODE.substring(0, 8)}...${SECRET_CODE.substring(SECRET_CODE.length - 4)}`);
console.log('');

// Check Node.js version
const nodeVersion = process.version;
console.log('✓ Node.js Version:', nodeVersion);

const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 12) {
  console.error('  ⚠️  Warning: Node.js 12+ recommended');
} else {
  console.log('  ✅ Version compatible');
}
console.log('');

// Check files
const fs = require('fs');
const requiredFiles = [
  'index.js',
  'test.js',
  'package.json',
  'skill.json',
  'README.md',
  'TESTING.md'
];

console.log('✓ File Check:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${file}`);
  if (!exists) allFilesExist = false;
});
console.log('');

if (!allFilesExist) {
  console.error('❌ Some required files are missing!');
  process.exit(1);
}

// Test API connectivity with a simple request
console.log('✓ API Connectivity Test:');
console.log('  Testing connection to Textin API...');

const testUrl = 'https://api.textin.com/robot/v1.0/api/business_license';
const url = new URL(testUrl);

const options = {
  method: 'POST',
  headers: {
    'x-ti-app-id': APP_ID,
    'x-ti-secret-code': SECRET_CODE,
    'Content-Type': 'text/plain',
    'Content-Length': 0
  }
};

const req = https.request(url, options, (res) => {
  console.log(`  Response Status: ${res.statusCode}`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log(`  Response Code: ${response.code}`);
      console.log(`  Response Message: ${response.message}`);

      if (response.code === 40101 || response.code === 40102) {
        console.log('  ❌ Authentication failed - Please check your credentials');
      } else if (response.code === 40003) {
        console.log('  ⚠️  Warning: Insufficient account balance');
      } else {
        console.log('  ✅ API is accessible');
      }
    } catch (error) {
      console.log('  ⚠️  Could not parse response');
    }

    console.log('');
    console.log('═'.repeat(80));
    console.log('Validation Complete!');
    console.log('═'.repeat(80));
    console.log('');
    console.log('Next steps:');
    console.log('1. Prepare test images (license, ID card, document, PDF)');
    console.log('2. Run: node test.js --ocr your_image.jpg');
    console.log('3. See TESTING.md for detailed testing instructions');
    console.log('');
  });
});

req.on('error', (error) => {
  console.log(`  ❌ Connection failed: ${error.message}`);
  console.log('  Check your internet connection');
});

req.end();
