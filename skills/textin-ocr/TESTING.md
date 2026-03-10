# Textin OCR Skill - Testing Guide

## Quick Test

To quickly test the skill with a sample image, you can use public test URLs:

### Test OCR with a Sample Image

```bash
# Test with a simple text image (you'll need to provide your own)
node index.js ocr your_test_image.jpg

# Or use a URL
node index.js ocr https://your-image-url.com/sample.jpg
```

## Comprehensive Testing

### 1. Prepare Test Images

You'll need the following test images:
- `test_license.jpg` - A Chinese business license image
- `test_idcard_front.jpg` - A Chinese ID card (front side)
- `test_idcard_back.jpg` - A Chinese ID card (back side)
- `test_document.jpg` or `.pdf` - Any document with text
- `test_parse.pdf` - A multi-page PDF document

### 2. Run Individual Tests

```bash
# Test business license recognition
node index.js business-license test_license.jpg

# Test ID card recognition
node index.js id-card test_idcard_front.jpg

# Test general OCR
node index.js ocr test_document.jpg

# Test document parsing
node index.js parse-doc test_parse.pdf
```

### 3. Run All Tests

```bash
node test.js \
  --business-license test_license.jpg \
  --id-card test_idcard_front.jpg \
  --ocr test_document.jpg \
  --parse-doc test_parse.pdf
```

## Expected Output

### Business License Recognition
```
🏢 Recognizing business license...

Document Type: business_license
Image Angle: 0°
Dimensions: 1200x900

Extracted Information:
────────────────────────────────────────────────────────────────────────────────
统一社会信用代码: 91110000XXXXXXXXXX
名称: 示例科技有限公司
类型: 有限责任公司
法定代表人: 张三
注册资本: 1000万元人民币
...
```

### ID Card Recognition
```
🪪 Recognizing ID card...

Document Type: 身份证正面
Image Angle: 0°
Dimensions: 1200x800

Extracted Information:
────────────────────────────────────────────────────────────────────────────────
姓名: 张三 (99.8%)
性别: 男 (99.9%)
民族: 汉 (99.7%)
出生: 1990年01月01日 (99.6%)
...
```

### General OCR
```
📄 Performing OCR recognition...

Total Pages: 1

Page 1:
  Angle: 0°
  Dimensions: 1200x1600
  Lines: 25

Recognized Text:
────────────────────────────────────────────────────────────────────────────────
1. Title of Document (98.5%)
2. This is the first line of text (99.2%)
3. 这是中文文本 (99.8%)
...
```

### Document Parsing
```
📋 Parsing document to markdown...

Successfully parsed 5 page(s)

Markdown Output:
════════════════════════════════════════════════════════════════════════════════
# Document Title

## Section 1
Content here...

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
...
════════════════════════════════════════════════════════════════════════════════

✅ Markdown saved to: test_parse_parsed.md
```

## Troubleshooting

### Error: File not found
Make sure the file path is correct and the file exists.

### Error: API Error 40102
Invalid credentials. Check your TEXTIN_APP_ID and TEXTIN_SECRET_CODE.

### Error: API Error 40003
Insufficient account balance. Top up your Textin account.

### Error: API Error 40306
QPS limit exceeded. Wait a moment and try again.

## Environment Setup

Set environment variables if you want to use different credentials:

```bash
export TEXTIN_APP_ID="your_app_id_here"
export TEXTIN_SECRET_CODE="your_secret_code_here"
```

## Sample Test Images

You can download sample test images from:
- Textin official documentation
- Your own scanned documents
- Public domain test images

**Note**: Make sure you have permission to process any images you use.
