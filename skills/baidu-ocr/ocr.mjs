#!/usr/bin/env node

/**
 * Baidu OCR - Extract text from images
 * Supports both image URLs and local files
 */

import { parseArgs } from "node:util";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const TOKEN_ENDPOINT = "https://aip.baidubce.com/oauth/2.0/token";
const OCR_ENDPOINT = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";

// Parse command line arguments
const { values } = parseArgs({
  options: {
    url: { type: "string" },
    file: { type: "string" },
    "detect-direction": { type: "string", default: "false" },
    "detect-language": { type: "string", default: "false" },
  },
});

const apiKey = process.env.BAIDU_OCR_API_KEY;
const secretKey = process.env.BAIDU_OCR_SECRET_KEY;

if (!apiKey || !secretKey) {
  console.error(JSON.stringify({
    error: "missing_credentials",
    message: "BAIDU_OCR_API_KEY and BAIDU_OCR_SECRET_KEY environment variables must be set. Get credentials from https://ai.baidu.com/"
  }, null, 2));
  process.exit(1);
}

if (!values.url && !values.file) {
  console.error(JSON.stringify({
    error: "missing_input",
    message: "Please provide either --url or --file parameter"
  }, null, 2));
  process.exit(1);
}

if (values.url && values.file) {
  console.error(JSON.stringify({
    error: "invalid_input",
    message: "Cannot use both --url and --file at the same time"
  }, null, 2));
  process.exit(1);
}

// Check if file exists when using file mode
if (values.file && !existsSync(values.file)) {
  console.error(JSON.stringify({
    error: "file_not_found",
    message: `File not found: ${values.file}`
  }, null, 2));
  process.exit(1);
}

/**
 * Get access token (cached for 29 days in production)
 */
async function getAccessToken() {
  const tokenUrl = `${TOKEN_ENDPOINT}?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;

  try {
    const response = await fetch(tokenUrl);
    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error(`No access token in response: ${JSON.stringify(data)}`);
    }

    return data.access_token;
  } catch (error) {
    console.error(JSON.stringify({
      error: "token_request_failed",
      message: error.message
    }, null, 2));
    process.exit(1);
  }
}

/**
 * Perform OCR
 */
async function performOCR(accessToken) {
  const ocrUrl = `${OCR_ENDPOINT}?access_token=${accessToken}`;

  const detectDirection = values["detect-direction"] === "true";
  const detectLanguage = values["detect-language"] === "true";

  try {
    let body;

    if (values.url) {
      // Method A: Using image URL
      const params = new URLSearchParams({
        url: values.url,
      });

      if (detectDirection) {
        params.append("detect_direction", "true");
      }
      if (detectLanguage) {
        params.append("detect_language", "true");
      }

      body = params.toString();
    } else {
      // Method B: Using local file (Base64 encoded)
      const imageBuffer = await readFile(values.file);
      const base64Image = imageBuffer.toString("base64");

      const params = new URLSearchParams({
        image: base64Image,
      });

      if (detectDirection) {
        params.append("detect_direction", "true");
      }
      if (detectLanguage) {
        params.append("detect_language", "true");
      }

      body = params.toString();
    }

    const response = await fetch(ocrUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(JSON.stringify({
        error: "ocr_request_failed",
        status: response.status,
        statusText: response.statusText,
        message: errorText,
      }, null, 2));
      process.exit(1);
    }

    const data = await response.json();

    // Check for API errors
    if (data.error_code) {
      console.error(JSON.stringify({
        error: "ocr_api_error",
        error_code: data.error_code,
        error_msg: data.error_msg,
      }, null, 2));
      process.exit(1);
    }

    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: "ocr_failed",
      message: error.message,
    }, null, 2));
    process.exit(1);
  }
}

// Main execution
(async () => {
  const accessToken = await getAccessToken();
  await performOCR(accessToken);
})();