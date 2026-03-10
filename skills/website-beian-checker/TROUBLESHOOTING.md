# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Task ends with "我来帮您批量检查这些网站的备案合规性..."

**Symptom:** The task starts but immediately fails without any results.

**Cause:** Chromium browser not installed for Puppeteer.

**Solution:**
```bash
npx puppeteer browsers install chrome
```

**Verification:**
```bash
ls ~/.cache/puppeteer/chrome/
# Should show: linux-131.0.6778.204/ or similar
```

---

### Issue 2: "Failed to launch the browser process"

**Symptom:** Error when trying to launch Puppeteer.

**Cause:** Missing Chromium or missing system dependencies.

**Solution:**

1. Install Chromium:
```bash
npx puppeteer browsers install chrome
```

2. On Linux, install system dependencies:
```bash
sudo apt-get install -y ca-certificates fonts-liberation libappindicator3-1 \
  libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
  libgbm1 libgtk-3-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxrandr2 libxss1 libxtst6 xdg-utils
```

---

### Issue 3: High failure rate (> 20%)

**Symptom:** Many websites fail to check with timeouts or errors.

**Causes:**
- Timeout too short
- Too many concurrent workers
- Network issues
- Websites actually down

**Solutions:**

1. Increase timeout:
```typescript
{
  timeout: 30000  // 30 seconds instead of 15
}
```

2. Reduce concurrency:
```typescript
{
  concurrency: 5  // Instead of 10 or 20
}
```

3. Enable retries:
```typescript
{
  retries: 2  // Retry failed checks
}
```

---

### Issue 4: Out of memory

**Symptom:** Process crashes or system freezes.

**Cause:** Too many concurrent browser pages.

**Solution:** Reduce concurrency:
```typescript
{
  concurrency: 3  // Start with low number
}
```

---

### Issue 5: Too slow (taking too long)

**Symptom:** Checking thousands of websites takes days.

**Solutions:**

1. Increase concurrency:
```typescript
{
  concurrency: 15  // Or up to 20
}
```

2. Reduce timeout:
```typescript
{
  timeout: 10000  // 10 seconds
}
```

3. Use two-pass strategy:
```typescript
// Pass 1: Fast scan
check_website_beian({
  websites: allSites,
  concurrency: 20,
  timeout: 10000,
  retries: 0
})

// Pass 2: Re-check only failures
check_website_beian({
  websites: failedSites,
  concurrency: 5,
  timeout: 30000,
  retries: 2
})
```

---

### Issue 6: "备案号显示" always false

**Symptom:** Tool reports filing number not displayed even though it exists on the page.

**Possible causes:**
1. Filing number is in an iframe
2. Filing number loaded by JavaScript after page load
3. Filing number format doesn't match regex
4. Filing number in image/screenshot (not text)

**Solutions:**

1. Check the actual website HTML manually
2. Increase timeout to allow JavaScript to load:
```typescript
{
  timeout: 30000
}
```

3. Use browser DevTools to verify the filing number is in text form
4. Check if the filing number matches the pattern (主体备案号 or with -1, -2 suffix)

---

### Issue 7: Progress stuck at certain percentage

**Symptom:** Progress stops at X% and doesn't continue.

**Cause:** A website is hanging (not responding, not timing out properly).

**Solution:**

1. Kill the process (Ctrl+C)
2. Resume from where it stopped:
```typescript
{
  websites: allSites,
  startFrom: 3847  // Resume from this index
}
```

3. Reduce timeout for next run:
```typescript
{
  timeout: 15000  // Shorter timeout
}
```

---

### Issue 8: CSV file empty or incomplete

**Symptom:** CSV file created but has no data or partial data.

**Cause:** Process terminated before completion.

**Good news:** With incremental writing, partial results are saved!

**Solution:**

1. Check the CSV file - it should have all completed entries
2. Count how many were completed:
```bash
wc -l beian-check-*.csv
```

3. Resume from last position:
```typescript
{
  startFrom: 1234  // Last completed index + 1
}
```

---

### Issue 9: "Parameter validation error"

**Symptom:** Tool rejects your input with validation error.

**Cause:** Missing required fields in website objects.

**Solution:** Ensure each website has all three fields:
```typescript
{
  url: "https://example.com",        // Required
  expectedName: "网站名称",            // Required
  filingNumber: "京ICP备12345678号"  // Required
}
```

---

### Issue 10: Browser uses too much CPU

**Symptom:** CPU at 100%, system slow.

**Cause:** Puppeteer is CPU-intensive, especially with high concurrency.

**Solutions:**

1. Reduce concurrency:
```typescript
{
  concurrency: 5  // Or lower
}
```

2. Run during off-peak hours
3. This is expected behavior - Puppeteer renders full web pages

---

## Debugging Tips

### Enable verbose logging

Check the console output - the tool already logs:
- Browser launch status
- Progress percentage
- Each URL being checked
- Errors and warnings

### Test with one website first

Before checking thousands:
```typescript
{
  websites: [
    { url: "https://www.baidu.com", expectedName: "百度", filingNumber: "京ICP证030173号" }
  ]
}
```

### Check Chromium installation

```bash
ls -la ~/.cache/puppeteer/chrome/
```

### Verify skill structure

```bash
npx tsx validate.ts
```

### Run quick test

```bash
npx tsx quick-test.ts
```

---

## Performance Tuning

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed performance optimization guide.

## Getting Help

If you encounter issues not covered here:

1. Check the console output for error messages
2. Verify Chromium is installed
3. Test with a single website first
4. Check network connectivity
5. Review [INSTALL.md](./INSTALL.md) for setup requirements
