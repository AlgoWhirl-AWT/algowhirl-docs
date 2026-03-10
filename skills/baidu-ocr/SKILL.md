---
name: baidu-ocr
description: Extract text from images using Baidu AI OCR (supports Chinese and English)
user-invocable: true
metadata: {"clawdbot":{"emoji":"🔍","requires":{"env":["BAIDU_OCR_API_KEY","BAIDU_OCR_SECRET_KEY"]},"primaryEnv":"BAIDU_OCR_API_KEY","homepage":"https://ai.baidu.com/"}}
---

# Baidu OCR Skill

Use Baidu AI OCR (Optical Character Recognition) to extract text from images.

## When to use this skill

Use this skill when:
- The user wants to extract text from an image
- You need to recognize Chinese or English text in pictures
- You have an image URL or local image file path
- You need to convert images to text for further processing

## Prerequisites

- Baidu AI API credentials from https://ai.baidu.com/
- Set environment variables:
  - `BAIDU_OCR_API_KEY` - API Key (client_id)
  - `BAIDU_OCR_SECRET_KEY` - Secret Key (client_secret)

## Usage

Call the OCR script with an image URL or file path:

```bash
# Method 1: Using image URL (recommended)
node /root/clawdbot/skills/baidu-ocr/ocr.mjs --url "https://example.com/image.png"

# Method 2: Using local file path
node /root/clawdbot/skills/baidu-ocr/ocr.mjs --file "/path/to/image.jpg"
```

### Parameters

- `--url` (optional): Image URL (http/https)
- `--file` (optional): Local image file path
- `--detect-direction` (optional): Detect image orientation (true/false, default: false)
- `--detect-language` (optional): Detect language (true/false, default: false)

Note: Must provide either `--url` or `--file`, not both.

### Examples

```bash
# OCR from URL
node /root/clawdbot/skills/baidu-ocr/ocr.mjs --url "https://www.ucloud.cn/static/images/common/logo.png"

# OCR from local file
node /root/clawdbot/skills/baidu-ocr/ocr.mjs --file "/tmp/screenshot.png"

# OCR with direction detection
node /root/clawdbot/skills/baidu-ocr/ocr.mjs --url "https://example.com/rotated.jpg" --detect-direction true

# OCR with language detection
node /root/clawdbot/skills/baidu-ocr/ocr.mjs --file "/tmp/multilingual.png" --detect-language true
```

## Output

Returns JSON with OCR results:
- `words_result` - Array of recognized text blocks
  - `words` - Extracted text
- `words_result_num` - Number of text blocks found
- `log_id` - Request log ID
- Optional fields (if enabled):
  - `direction` - Image orientation (0/1/2/3 for 0°/90°/180°/270°)
  - `language` - Detected language code

## Supported Image Formats

- JPG
- PNG
- BMP
- GIF (first frame)

## Limitations

- Image size: < 4MB
- Image resolution: min 15px × 15px, max 4096px × 4096px
- Base64 encoded image size: < 4MB

## Notes

- The API automatically caches access tokens for 29 days
- Supports Chinese, English, and mixed Chinese-English text
- Best for general document OCR (receipts, cards, forms, screenshots)
- For specialized scenarios (ID cards, bank cards, licenses), use dedicated endpoints