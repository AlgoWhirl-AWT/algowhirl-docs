#!/bin/bash

# Setup script for Textin OCR Skill
# This script helps you configure your environment variables

echo "════════════════════════════════════════════════════════════════════════════════"
echo "Textin OCR Skill - Setup"
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""

# Check if .env file exists
if [ -f .env ]; then
  echo "⚠️  Warning: .env file already exists"
  read -p "Do you want to overwrite it? (y/N): " overwrite
  if [[ ! $overwrite =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 0
  fi
fi

# Get credentials from user
echo "Please enter your Textin credentials"
echo "(Get them from: https://www.textin.com -> 工作台 -> 账号设置 -> 开发者信息)"
echo ""

read -p "Textin App ID: " app_id
read -p "Textin Secret Code: " secret_code

# Validate input
if [ -z "$app_id" ] || [ -z "$secret_code" ]; then
  echo ""
  echo "❌ Error: Both App ID and Secret Code are required!"
  exit 1
fi

# Create .env file
cat > .env << EOF
# Textin API Credentials
# DO NOT commit this file to version control!

TEXTIN_APP_ID=$app_id
TEXTIN_SECRET_CODE=$secret_code
EOF

echo ""
echo "✅ Configuration saved to .env file"
echo ""
echo "To use these credentials, run:"
echo "  source .env  # Or use a tool like dotenv"
echo ""
echo "Or set them directly in your shell:"
echo "  export TEXTIN_APP_ID=\"$app_id\""
echo "  export TEXTIN_SECRET_CODE=\"$secret_code\""
echo ""
echo "Next steps:"
echo "1. Run: node validate.js (to test configuration)"
echo "2. Prepare test images"
echo "3. Run: node test.js --ocr your_image.jpg"
echo ""
