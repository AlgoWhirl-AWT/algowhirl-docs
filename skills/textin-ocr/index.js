#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration - must be set via environment variables
const APP_ID = process.env.TEXTIN_APP_ID;
const SECRET_CODE = process.env.TEXTIN_SECRET_CODE;

// Validate credentials
if (!APP_ID || !SECRET_CODE) {
  console.error('\n❌ Error: Missing Textin credentials!');
  console.error('\nPlease set the following environment variables:');
  console.error('  export TEXTIN_APP_ID="your_app_id"');
  console.error('  export TEXTIN_SECRET_CODE="your_secret_code"');
  console.error('\nYou can get your credentials from: https://www.textin.com\n');
  process.exit(1);
}

// API endpoints
const ENDPOINTS = {
  businessLicense: 'https://api.textin.com/robot/v1.0/api/business_license',
  idCard: 'https://api.textin.com/robot/v1.0/api/id_card',
  ocr: 'https://api.textin.com/ai/service/v2/recognize/multipage',
  parseDoc: 'https://api.textin.com/ai/service/v1/pdf_to_markdown'
};

/**
 * Make HTTP request to Textin API
 */
function makeRequest(endpoint, data, isFile = true, queryParams = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);

    // Add query parameters
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        url.searchParams.append(key, queryParams[key]);
      }
    });

    const options = {
      method: 'POST',
      headers: {
        'x-ti-app-id': APP_ID,
        'x-ti-secret-code': SECRET_CODE,
        'Content-Type': isFile ? 'application/octet-stream' : 'text/plain',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          if (jsonData.code === 200) {
            resolve(jsonData.result);
          } else {
            reject(new Error(`API Error ${jsonData.code}: ${jsonData.message}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(data);
    req.end();
  });
}

/**
 * Check if input is a URL
 */
function isURL(input) {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Read file or return URL
 */
function getInputData(input) {
  if (isURL(input)) {
    return { data: input, isFile: false };
  }

  if (!fs.existsSync(input)) {
    throw new Error(`File not found: ${input}`);
  }

  const data = fs.readFileSync(input);
  return { data, isFile: true };
}

/**
 * Business License Recognition
 */
async function recognizeBusinessLicense(imagePath) {
  console.log('🏢 Recognizing business license...\n');

  const { data, isFile } = getInputData(imagePath);
  const result = await makeRequest(ENDPOINTS.businessLicense, data, isFile);

  console.log(`Document Type: ${result.type}`);
  console.log(`Image Angle: ${result.image_angle}°`);
  console.log(`Dimensions: ${result.rotated_image_width}x${result.rotated_image_height}\n`);

  console.log('Extracted Information:');
  console.log('─'.repeat(80));

  result.item_list.forEach(item => {
    if (item.value && item.value.trim()) {
      console.log(`${item.description || item.key}: ${item.value}`);
    }
  });

  return result;
}

/**
 * ID Card Recognition
 */
async function recognizeIdCard(imagePath, options = {}) {
  console.log('🪪 Recognizing ID card...\n');

  const { data, isFile } = getInputData(imagePath);

  const queryParams = {
    is_gray: 1,
    crop_image: 1,
    head_portrait: 1,
    id_number_image: 1,
    confidence: 1
  };

  const result = await makeRequest(ENDPOINTS.idCard, data, isFile, queryParams);

  console.log(`Document Type: ${result.type_description || result.type}`);
  console.log(`Image Angle: ${result.image_angle}°`);
  console.log(`Dimensions: ${result.rotated_image_width}x${result.rotated_image_height}\n`);

  console.log('Extracted Information:');
  console.log('─'.repeat(80));

  result.item_list.forEach(item => {
    if (item.value && typeof item.value === 'string' && item.value.trim()) {
      const confidence = item.confidence ? ` (${(item.confidence * 100).toFixed(1)}%)` : '';
      console.log(`${item.description || item.key}: ${item.value}${confidence}`);
    }
  });

  return result;
}

/**
 * General OCR Recognition
 */
async function recognizeText(imagePath) {
  console.log('📄 Performing OCR recognition...\n');

  const { data, isFile } = getInputData(imagePath);

  const queryParams = {
    character: 0,
    straighten: 0
  };

  const result = await makeRequest(ENDPOINTS.ocr, data, isFile, queryParams);

  console.log(`Total Pages: ${result.pages.length}\n`);

  result.pages.forEach((page, pageIndex) => {
    console.log(`Page ${pageIndex + 1}:`);
    console.log(`  Angle: ${page.angle}°`);
    console.log(`  Dimensions: ${page.width}x${page.height}`);
    console.log(`  Lines: ${page.lines.length}\n`);

    console.log('Recognized Text:');
    console.log('─'.repeat(80));

    page.lines.forEach((line, lineIndex) => {
      const typeInfo = line.type !== 'text' ? ` [${line.type}]` : '';
      const handwritten = line.handwritten ? ' [handwritten]' : '';
      const score = ` (${(line.score * 100).toFixed(1)}%)`;
      console.log(`${lineIndex + 1}. ${line.text}${typeInfo}${handwritten}${score}`);
    });

    console.log('');
  });

  return result;
}

/**
 * Document Parsing
 */
async function parseDocument(filePath, options = {}) {
  console.log('📋 Parsing document to markdown...\n');

  const { data, isFile } = getInputData(filePath);

  const queryParams = {
    page_start: options.pageStart || 1,
    page_count: options.pageCount || 1000,
    parse_mode: 'scan',
    dpi: 144,
    table_flavor: 'md',
    get_image: 'none',
    markdown_details: 1,
    apply_document_tree: 1,
    formula_level: 0
  };

  const result = await makeRequest(ENDPOINTS.parseDoc, data, isFile, queryParams);

  console.log(`Successfully parsed ${result.success_count} page(s)\n`);

  console.log('Markdown Output:');
  console.log('═'.repeat(80));
  console.log(result.markdown);
  console.log('═'.repeat(80));

  // Save to file
  const outputPath = filePath.replace(/\.[^.]+$/, '') + '_parsed.md';
  if (!isURL(filePath)) {
    fs.writeFileSync(outputPath, result.markdown);
    console.log(`\n✅ Markdown saved to: ${outputPath}`);
  }

  return result;
}

/**
 * Main CLI handler
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Textin OCR Services

Usage:
  textin-ocr business-license <image_path_or_url>
  textin-ocr id-card <image_path_or_url>
  textin-ocr ocr <image_path_or_url>
  textin-ocr parse-doc <file_path_or_url> [--pages start,count]

Examples:
  textin-ocr business-license license.jpg
  textin-ocr id-card idcard_front.jpg
  textin-ocr ocr document.pdf
  textin-ocr parse-doc report.pdf --pages 1,5

Environment Variables:
  TEXTIN_APP_ID      - Your Textin App ID
  TEXTIN_SECRET_CODE - Your Textin Secret Code
`);
    process.exit(0);
  }

  const command = args[0];
  const input = args[1];

  if (!input) {
    console.error('Error: Please provide an image path or URL');
    process.exit(1);
  }

  try {
    switch (command) {
      case 'business-license':
        await recognizeBusinessLicense(input);
        break;

      case 'id-card':
        await recognizeIdCard(input);
        break;

      case 'ocr':
        await recognizeText(input);
        break;

      case 'parse-doc':
        const pageMatch = args.find(arg => arg.startsWith('--pages'));
        let pageOptions = {};
        if (pageMatch) {
          const pages = pageMatch.split('=')[1] || args[args.indexOf(pageMatch) + 1];
          const [start, count] = pages.split(',').map(Number);
          pageOptions = { pageStart: start, pageCount: count };
        }
        await parseDocument(input, pageOptions);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  recognizeBusinessLicense,
  recognizeIdCard,
  recognizeText,
  parseDocument
};
