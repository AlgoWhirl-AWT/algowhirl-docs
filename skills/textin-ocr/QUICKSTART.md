# Textin OCR Skill - Quick Start Guide

## Setup (First Time Only)

### 1. Set Environment Variables

**Option A: Using the setup script (recommended)**
```bash
./setup.sh
```

**Option B: Manual setup**
```bash
export TEXTIN_APP_ID="your_app_id_here"
export TEXTIN_SECRET_CODE="your_secret_code_here"
```

**Option C: Using .env file**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your credentials
nano .env

# Then load the variables
source .env
```

### 2. Validate Installation

```bash
node validate.js
```

You should see:
- ✅ Configuration verified
- ✅ Node.js version compatible
- ✅ All files present
- ✅ API accessible

## Usage Examples

### 🏢 Business License Recognition

```bash
export TEXTIN_APP_ID="your_id"
export TEXTIN_SECRET_CODE="your_secret"

node index.js business-license /path/to/license.jpg
```

**Supported formats**: JPG, PNG, BMP, PDF, TIFF, GIF (max 10MB)

**Extracted fields**:
- Company name (名称)
- Credit code (统一社会信用代码)
- Legal representative (法定代表人)
- Registered capital (注册资本)
- Business scope (经营范围)
- Address (住所)
- And more...

### 🪪 ID Card Recognition

```bash
node index.js id-card /path/to/idcard_front.jpg
```

**Supported formats**: JPG, PNG, BMP, PDF, TIFF, GIF (max 10MB)

**Extracted fields**:
- Name (姓名)
- Gender (性别)
- Nationality (民族)
- Date of birth (出生)
- Address (住址)
- ID number (公民身份号码)
- Issuing authority (签发机关)
- Validity period (有效期限)

### 📄 General OCR

```bash
node index.js ocr /path/to/document.pdf
```

**Supported formats**: JPG, PNG, BMP, PDF, TIFF, GIF (max 500MB)

**Features**:
- 52+ languages support
- Mixed horizontal/vertical text
- Handwriting detection
- Stamp and formula recognition
- Multi-page support

### 📋 Document Parsing

```bash
# Parse entire document
node index.js parse-doc /path/to/report.pdf

# Parse specific pages (e.g., pages 5-10)
node index.js parse-doc /path/to/report.pdf --pages 5,6
```

**Output**: Markdown file saved as `{filename}_parsed.md`

**Features**:
- Text extraction
- Table parsing (Markdown format)
- Document structure preservation
- Heading hierarchy
- Image extraction (optional)

## Testing

### Quick Test with Sample Images

```bash
# Test OCR with your image
node test.js --ocr /path/to/test_image.jpg

# Test all functions
node test.js \
  --business-license /path/to/license.jpg \
  --id-card /path/to/idcard.jpg \
  --ocr /path/to/document.jpg \
  --parse-doc /path/to/report.pdf
```

### Using URLs

All commands support URLs instead of local files:

```bash
node index.js ocr https://example.com/image.jpg
```

## Common Issues

### "Missing Textin credentials"
Make sure you've set the environment variables:
```bash
export TEXTIN_APP_ID="your_id"
export TEXTIN_SECRET_CODE="your_secret"
```

### "API Error 40102: Invalid credentials"
Your credentials are incorrect. Check your App ID and Secret Code.

### "API Error 40003: Insufficient balance"
Your Textin account has insufficient balance. Please top up.

### "API Error 40306: QPS limit exceeded"
You've exceeded the rate limit. Wait a moment and try again.

### "File not found"
Check the file path is correct and the file exists.

## File Structure

```
textin-ocr/
├── index.js          # Main implementation
├── test.js           # Test suite
├── validate.js       # Configuration validator
├── setup.sh          # Setup helper script
├── demo.js           # Quick demo
├── skill.json        # Skill configuration
├── package.json      # Node.js package info
├── README.md         # Full documentation
├── TESTING.md        # Testing guide
├── QUICKSTART.md     # This file
├── .env.example      # Environment template
└── .gitignore        # Git ignore rules
```

## Security Best Practices

✅ **DO**:
- Use environment variables for credentials
- Keep credentials in `.env` file (gitignored)
- Use `setup.sh` for easy configuration

❌ **DON'T**:
- Commit credentials to git
- Share credentials in code
- Hardcode API keys in files

## Next Steps

1. ✅ Set up credentials (use `./setup.sh`)
2. ✅ Validate setup (run `node validate.js`)
3. ✅ Prepare test images
4. ✅ Run tests (use `node test.js --ocr your_image.jpg`)
5. ✅ Integrate into your workflow

## Getting Help

- API Documentation: https://www.textin.com/document
- Issues: Check error messages carefully
- Support: Contact Textin support at https://www.textin.com

## License

MIT
