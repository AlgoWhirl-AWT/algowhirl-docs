#!/usr/bin/env node

/**
 * Quick demo script for Textin OCR Skill
 * Tests with a simple text URL
 */

const { recognizeText } = require('./index.js');

console.log('═'.repeat(80));
console.log('Textin OCR - Quick Demo');
console.log('═'.repeat(80));
console.log('');

// Test with a sample image URL
const testUrl = 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400';

console.log('Testing with sample image URL...');
console.log('URL:', testUrl);
console.log('');

recognizeText(testUrl)
  .then(result => {
    console.log('\n✅ Demo completed successfully!');
    console.log('\nTotal text lines recognized:', result.pages.reduce((sum, p) => sum + p.lines.length, 0));
  })
  .catch(error => {
    console.error('\n❌ Demo failed:', error.message);
    console.log('\nNote: Make sure you have set TEXTIN_APP_ID and TEXTIN_SECRET_CODE');
    console.log('      and your account has sufficient balance.');
    process.exit(1);
  });
