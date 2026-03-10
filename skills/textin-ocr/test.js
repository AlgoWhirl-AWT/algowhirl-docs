#!/usr/bin/env node

/**
 * Test script for Textin OCR Skill
 *
 * This script tests all four OCR functions with sample images.
 * You can provide your own test images or use URLs.
 */

const {
  recognizeBusinessLicense,
  recognizeIdCard,
  recognizeText,
  parseDocument
} = require('./index.js');

async function runTests() {
  console.log('═'.repeat(80));
  console.log('Textin OCR Skill Test Suite');
  console.log('═'.repeat(80));
  console.log('');

  // Check if test images are provided as arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
To test this skill, provide paths to test images:

Usage:
  node test.js --business-license <path> --id-card <path> --ocr <path> --parse-doc <path>

Or test individual functions:
  node test.js --business-license sample_license.jpg
  node test.js --id-card sample_idcard.jpg
  node test.js --ocr sample_document.jpg
  node test.js --parse-doc sample.pdf

You can also use URLs:
  node test.js --ocr https://example.com/image.jpg

Example with all tests:
  node test.js \\
    --business-license ./samples/license.jpg \\
    --id-card ./samples/idcard.jpg \\
    --ocr ./samples/document.jpg \\
    --parse-doc ./samples/report.pdf
`);
    process.exit(0);
  }

  // Parse arguments
  const testImages = {};
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i].replace('--', '');
    const path = args[i + 1];
    testImages[flag] = path;
  }

  let passed = 0;
  let failed = 0;

  // Test Business License Recognition
  if (testImages['business-license']) {
    try {
      console.log('\n' + '='.repeat(80));
      console.log('TEST 1: Business License Recognition');
      console.log('='.repeat(80));
      await recognizeBusinessLicense(testImages['business-license']);
      console.log('\n✅ Business License test PASSED');
      passed++;
    } catch (error) {
      console.error(`\n❌ Business License test FAILED: ${error.message}`);
      failed++;
    }
  }

  // Test ID Card Recognition
  if (testImages['id-card']) {
    try {
      console.log('\n' + '='.repeat(80));
      console.log('TEST 2: ID Card Recognition');
      console.log('='.repeat(80));
      await recognizeIdCard(testImages['id-card']);
      console.log('\n✅ ID Card test PASSED');
      passed++;
    } catch (error) {
      console.error(`\n❌ ID Card test FAILED: ${error.message}`);
      failed++;
    }
  }

  // Test General OCR
  if (testImages['ocr']) {
    try {
      console.log('\n' + '='.repeat(80));
      console.log('TEST 3: General OCR');
      console.log('='.repeat(80));
      await recognizeText(testImages['ocr']);
      console.log('\n✅ OCR test PASSED');
      passed++;
    } catch (error) {
      console.error(`\n❌ OCR test FAILED: ${error.message}`);
      failed++;
    }
  }

  // Test Document Parsing
  if (testImages['parse-doc']) {
    try {
      console.log('\n' + '='.repeat(80));
      console.log('TEST 4: Document Parsing');
      console.log('='.repeat(80));
      await parseDocument(testImages['parse-doc'], { pageStart: 1, pageCount: 2 });
      console.log('\n✅ Document Parsing test PASSED');
      passed++;
    } catch (error) {
      console.error(`\n❌ Document Parsing test FAILED: ${error.message}`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(80));
  console.log('Test Summary');
  console.log('═'.repeat(80));
  console.log(`Total Tests: ${passed + failed}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log('═'.repeat(80));

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
