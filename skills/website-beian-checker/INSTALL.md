# Installation Guide

## Prerequisites

1. **Node.js 22+** is required
2. **Chromium browser** for Puppeteer

## Installation Steps

### 1. Install npm dependencies

```bash
cd skills/website-beian-checker
npm install --omit=dev
```

### 2. Install Chromium for Puppeteer

**Important:** Puppeteer requires Chromium browser to run. Install it with:

```bash
npx puppeteer browsers install chrome
```

Or if you're using the skill in Clawdbot, run this from the Clawdbot root:

```bash
npx puppeteer browsers install chrome
```

This will download Chromium to `~/.cache/puppeteer/chrome/`.

### 3. Verify installation

Run the validation script to ensure everything is set up correctly:

```bash
npx tsx validate.ts
```

### 4. Quick test

Test with a real website:

```bash
npx tsx quick-test.ts
```

## Troubleshooting

### Error: "Failed to launch the browser process"

This means Chromium is not installed. Run:

```bash
npx puppeteer browsers install chrome
```

### Error: "Protocol error: Connection closed"

This can happen if:
- System is out of memory (reduce `concurrency`)
- Missing system dependencies (install Chrome dependencies)

On Linux, install Chrome dependencies:

```bash
# Debian/Ubuntu
sudo apt-get install -y chromium-browser

# Or install dependencies manually
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

### Verify Chromium is installed

```bash
ls -la ~/.cache/puppeteer/chrome/
```

You should see a Chrome directory like `linux-131.0.6778.204/`.

## First Use

After installation, the skill is ready to use in Clawdbot. Simply provide your website data:

```
帮我检查这些网站的备案：
1. https://example.com，网站名"示例"，备案号京ICP备12345678号
2. https://example2.com，网站名"示例2"，备案号京ICP备12345679号
```

Clawdbot will automatically call the `check_website_beian` tool.
