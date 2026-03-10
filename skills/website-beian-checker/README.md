# Website Beian Checker

A high-performance Clawdbot skill for checking website ICP beian (filing) compliance using Puppeteer with parallel processing support.

## Features

- **Full Browser Simulation**: Uses Puppeteer for accurate website rendering
- **High-Performance Batch Processing**: Concurrent checks with configurable workers (up to 20)
- **Shared Browser Instance**: Efficient resource usage across all checks
- **Deep DOM Analysis**: Traverses entire DOM tree to find filing information
- **Smart Detection**: Checks footer, copyright sections, and all anchor tags
- **Flexible Matching**: Supports both main filing numbers (主体备案号) and website filing numbers (with -1, -2 suffixes)
- **Auto-Retry**: Configurable retry logic for failed checks
- **Real-time Progress**: Live progress reporting during batch processing
- **Incremental CSV Writing**: No memory overflow for large datasets
- **Resume Support**: Continue from any position if interrupted
- **CSV Export**: Automatically generates CSV for 20+ websites

## Installation

**Important:** This skill requires Chromium browser for Puppeteer. See [INSTALL.md](./INSTALL.md) for detailed setup instructions.

### Quick Start

```bash
# Install dependencies
npm install --omit=dev

# Install Chromium for Puppeteer
npx puppeteer browsers install chrome

# Verify installation
npx tsx validate.ts
```

See [INSTALL.md](./INSTALL.md) for troubleshooting and system dependencies.

## Usage

### Basic Check

```typescript
check_website_beian({
  websites: [{
    url: "https://example.com",
    expectedName: "示例网站",
    filingNumber: "京ICP备12345678号"
  }]
})
```

### High-Performance Batch Check

```typescript
check_website_beian({
  websites: [...], // Array of 10000 websites
  concurrency: 10,  // 10 concurrent workers
  timeout: 15000,   // 15 second timeout per site
  retries: 2        // Retry failed checks twice
})
```

### Resume Interrupted Check

```typescript
check_website_beian({
  websites: [...],
  startFrom: 5000   // Continue from website #5000
})
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `websites` | array | required | Array of website objects to check |
| `outputCsv` | boolean | auto | Force CSV output (auto for 20+ sites) |
| `concurrency` | number | 5 | Concurrent workers (max: 20) |
| `timeout` | number | 30000 | Timeout per site in ms (5000-120000) |
| `retries` | number | 1 | Retry attempts on failure (max: 3) |
| `startFrom` | number | 0 | Start from index (for resuming) |

## Performance Benchmarks

**For 10,000 websites:**

| Config | Time Estimate | Notes |
|--------|---------------|-------|
| Default (concurrency: 5, timeout: 30s) | 15-18 hours | Most stable |
| Balanced (concurrency: 10, timeout: 15s) | 4-6 hours | Recommended |
| Fast (concurrency: 20, timeout: 10s) | 2-3 hours | May have higher failure rate |

**Actual time depends on:**
- Website response times
- Network conditions
- Success rate
- Number of retries triggered

## Check Criteria

The tool validates four compliance aspects:

1. **网站可访问性 (Accessibility)**: Website returns HTTP 200 status
2. **标题匹配 (Title Match)**: Page title contains the expected website name
3. **备案号显示 (Filing Number Display)**: Filing number is displayed on the page (checks for main body number with optional suffix)
4. **备案链接 (Filing Link)**: Filing number links to beian.miit.gov.cn

## Output Format

### Console Progress

```
🚀 Starting batch check with 10 concurrent workers
⚙️  Timeout: 15000ms | Retries: 2 | Starting from: 0

📄 CSV file created: beian-check-2026-01-29T10-30-45-123Z.csv

[2.5%] ✓ 250/10000 | https://example1.com
[5.0%] ✗ 500/10000 | https://example2.com
...

✅ Batch check completed: 10000/10000 websites checked
```

### Summary Output

```
## 网站备案检查结果

📊 总计: 10000 | ✓ 通过: 8500 | ✗ 失败: 1500

### 1. https://example1.com
- 网站可访问性: ✓ true
- 标题匹配: ✓ true
- 备案号显示: ✓ true
- 备案链接: ✓ true

... (first 10 results shown)

... 还有 9990 条结果，请查看CSV文件获取完整数据
```

### CSV Output

```csv
URL,网站可访问性,标题匹配,备案号显示,备案链接,错误信息
https://example.com,true,true,true,true,
https://example2.com,false,false,false,false,net::ERR_NAME_NOT_RESOLVED
```

## Stability for Large Datasets

### 10,000+ Websites

✅ **Stable Features:**
- Shared browser instance (not creating 10k browsers)
- Incremental CSV writing (results written immediately)
- Concurrent processing with p-limit (controlled parallelism)
- Automatic retry for transient failures
- Resume support (can restart from any position)

✅ **Resource Usage:**
- Memory: ~500MB-2GB (depending on concurrency)
- CPU: Moderate (scales with concurrency)
- Disk: Minimal (incremental CSV writing)

✅ **Recommendations:**
- Use `concurrency: 10` for balanced speed/stability
- Set `timeout: 15000` (15s) for faster processing
- Monitor progress and adjust if too many failures
- Use `startFrom` to resume if interrupted

## Implementation Details

- **Puppeteer Configuration**: Runs headless with bot detection avoidance
- **Text Extraction**: Uses `innerText` for clean text content
- **Link Detection**: Checks all `<a>` tags for href attributes
- **Regex Matching**: Uses flexible regex to match filing numbers with optional suffixes
- **Error Handling**: Captures and reports errors for individual websites
- **Progress Tracking**: Real-time console output with percentage and status

## Troubleshooting

### High Failure Rate
- Reduce `concurrency` (try 5 or less)
- Increase `timeout` (try 30000 or more)
- Check network connectivity

### Out of Memory
- Reduce `concurrency` to 3-5
- Should not happen with current implementation (incremental CSV)

### Taking Too Long
- Increase `concurrency` to 15-20
- Reduce `timeout` to 10000-15000
- Note: This may increase failure rate

## Examples

See `examples.ts` and `test-example.md` for more usage examples.
