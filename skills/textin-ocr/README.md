# Textin OCR Skill

A Claude Code skill for Textin OCR services, supporting:
- 🏢 Business License Recognition
- 🪪 ID Card Recognition
- 📄 General Text Recognition (OCR)
- 📋 Document Parsing to Markdown

## Installation

This skill is ready to use. Make sure you have Node.js installed (v12+).

## Configuration

**REQUIRED**: Set your Textin credentials as environment variables:

```bash
export TEXTIN_APP_ID="your_app_id"
export TEXTIN_SECRET_CODE="your_secret_code"
```

Get your credentials from [Textin Console](https://www.textin.com):
1. Go to 工作台 (Workspace)
2. Navigate to 账号设置 (Account Settings)
3. Find 开发者信息 (Developer Information)
4. Copy your App ID and Secret Code

**Security Note**: Never commit credentials to version control. Use `.env` file or environment variables.

## Usage

### Business License Recognition

```bash
node index.js business-license <image_path_or_url>
```

Recognizes Chinese business licenses and extracts:
- Company name
- Credit code
- Legal representative
- Registered capital
- Business scope
- And more...

### ID Card Recognition

```bash
node index.js id-card <image_path_or_url>
```

Recognizes Chinese ID cards (both front and back) and extracts:
- Name
- Gender
- Nationality
- Date of birth
- Address
- ID number
- Issuing authority
- Validity period

### General OCR

```bash
node index.js ocr <image_path_or_url>
```

Performs general text recognition on images or PDFs:
- Supports 52+ languages
- Mixed horizontal/vertical text
- Handwriting detection
- Stamp and formula recognition

### Document Parsing

```bash
node index.js parse-doc <file_path_or_url> [--pages start,count]
```

Parses documents (PDF, images) to Markdown format:
- Extracts text, tables, and structure
- Preserves document hierarchy
- Supports partial page parsing

Examples:
```bash
# Parse entire document
node index.js parse-doc report.pdf

# Parse pages 5-10 (6 pages total)
node index.js parse-doc report.pdf --pages 5,6
```

## Examples

```bash
# Recognize a business license from local file
node index.js business-license /path/to/license.jpg

# Recognize ID card from URL
node index.js id-card https://example.com/idcard.jpg

# OCR a document
node index.js ocr document.pdf

# Parse multi-page PDF
node index.js parse-doc annual_report.pdf
```

## API Reference

### Business License API
- **Endpoint**: `POST https://api.textin.com/robot/v1.0/api/business_license`
- **Formats**: JPG, PNG, BMP, PDF, TIFF, GIF
- **Max Size**: 10MB
- **Dimensions**: 20-10000 pixels

### ID Card API
- **Endpoint**: `POST https://api.textin.com/robot/v1.0/api/id_card`
- **Formats**: JPG, PNG, BMP, PDF, TIFF, GIF
- **Max Size**: 10MB
- **Dimensions**: 20-10000 pixels

### General OCR API
- **Endpoint**: `POST https://api.textin.com/ai/service/v2/recognize/multipage`
- **Formats**: JPG, PNG, BMP, PDF, TIFF, GIF
- **Max Size**: 500MB
- **Dimensions**: 20-10000 pixels

### Document Parsing API
- **Endpoint**: `POST https://api.textin.com/ai/service/v1/pdf_to_markdown`
- **Formats**: PDF, images
- **Max Size**: 500MB
- **Max Pages**: 1000

## Error Codes

- `40101`: Missing credentials
- `40102`: Invalid credentials
- `40003`: Insufficient balance
- `40301-40306`: File validation errors
- `40306`: QPS limit exceeded
- `500`: Server error

## Testing

Run the test script to verify all functions:

```bash
npm test
```

Or manually test with sample images.

## License

MIT
