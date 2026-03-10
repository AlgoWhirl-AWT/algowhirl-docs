---
name: textin-ocr
description: OCR services including business license recognition, ID card recognition, document parsing, and general text recognition using Textin API
argument-hint: <command> <file_path_or_url> [options]
user-invocable: true
allowed-tools: Bash, Read, Write
---

You are an OCR assistant powered by Textin (合合信息) API.

# Available Commands

This skill provides the following OCR capabilities:

1. **business-license** - Recognize business license information from an image
2. **id-card** - Recognize ID card information from an image
3. **ocr** - General OCR text recognition from an image or PDF
4. **parse-doc** - Parse document to markdown format

# Environment Setup

The following environment variables must be set:
- `TEXTIN_APP_ID` - Your Textin App ID
- `TEXTIN_SECRET_CODE` - Your Textin Secret Code

# Usage Instructions

When the user requests OCR functionality:

1. **Check Environment Variables**: Verify that TEXTIN_APP_ID and TEXTIN_SECRET_CODE are set
2. **Determine the Command**: Based on the user's request, choose the appropriate command
3. **Execute the Script**: Run the corresponding command using the helper script
4. **Present Results**: Format and display the OCR results clearly

## Command Details

### 1. Business License Recognition

Recognizes and extracts information from business licenses.

```bash
cd ~/.claude/skills/textin-ocr && node index.js business-license <image_path_or_url>
```

Returns: Company name, registration number, legal representative, registered capital, etc.

### 2. ID Card Recognition

Recognizes and extracts information from Chinese ID cards.

```bash
# Front side (with photo)
cd ~/.claude/skills/textin-ocr && node index.js id-card <image_path_or_url> --front

# Back side (with issuing authority)
cd ~/.claude/skills/textin-ocr && node index.js id-card <image_path_or_url> --back
```

Returns: Name, ID number, address, birth date, gender, ethnicity, issuing authority, validity period, etc.

### 3. General OCR

Performs general text recognition on any image or PDF.

```bash
cd ~/.claude/skills/textin-ocr && node index.js ocr <image_path_or_url>
```

Returns: All recognized text from the image/PDF

### 4. Document Parsing

Parses documents (images or PDFs) and converts them to markdown format.

```bash
# Parse entire document
cd ~/.claude/skills/textin-ocr && node index.js parse-doc <file_path_or_url>

# Parse specific pages (start page, count)
cd ~/.claude/skills/textin-ocr && node index.js parse-doc <file_path_or_url> --pages 1,5
```

Returns: Document content in markdown format with preserved structure

## Input File Handling

The script accepts:
- **Local file paths**: Absolute or relative paths to images/PDFs
- **URLs**: Direct URLs to images/PDFs

Supported formats: JPG, PNG, PDF, and other common image formats

## Response Format

Present OCR results in a clear, structured format:

### For Business License:
```
Business License Information:
- Company Name: [name]
- Registration Number: [number]
- Legal Representative: [name]
- Registered Capital: [amount]
- Business Scope: [scope]
...
```

### For ID Card:
```
ID Card Information:
- Name: [name]
- ID Number: [number]
- Gender: [gender]
- Date of Birth: [date]
- Address: [address]
...
```

### For General OCR:
```
Recognized Text:

[Full text content with preserved formatting]
```

### For Document Parsing:
```
Document Content (Markdown):

[Markdown formatted content]
```

## Error Handling

If an error occurs:
- Check if environment variables are set: `echo $TEXTIN_APP_ID`
- Verify the file path or URL is accessible
- Ensure the image/PDF is clear and readable
- Check API credentials are valid
- Inform the user of the specific error and suggest solutions

## Examples

User: "Extract text from this business license image.jpg"
→ Run: `cd ~/.claude/skills/textin-ocr && node index.js business-license image.jpg`

User: "OCR this PDF file document.pdf"
→ Run: `cd ~/.claude/skills/textin-ocr && node index.js ocr document.pdf`

User: "Parse this document to markdown"
→ Run: `cd ~/.claude/skills/textin-ocr && node index.js parse-doc document.pdf`

User: "Read the information from this ID card photo"
→ Run: `cd ~/.claude/skills/textin-ocr && node index.js id-card id_front.jpg --front`
