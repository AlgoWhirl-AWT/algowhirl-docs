# website-beian-checker

Website ICP beian (filing) compliance checker tool. Uses Puppeteer for full browser simulation with high-performance batch processing support.

## check_website_beian

Check website ICP beian (filing) compliance status with parallel processing.

**Parameters:**
- `websites` (array, required): Array of website objects to check, each containing:
  - `url` (string): Website URL
  - `expectedName` (string): Expected website name from filing records
  - `filingNumber` (string): Main body filing number (主体备案号)
- `outputCsv` (boolean, optional): Generate CSV output. Auto-enabled for 20+ records. Default: auto
- `concurrency` (number, optional): Number of concurrent checks. Default: 5, Max: 20
- `timeout` (number, optional): Timeout per website in milliseconds. Default: 30000, Range: 5000-120000
- `retries` (number, optional): Number of retries on failure. Default: 1, Max: 3
- `startFrom` (number, optional): Start checking from index (for resuming). Default: 0

**Output Format:**
Each website returns:
- `url`: Website URL
- `accessible`: true/false - Website accessible with HTTP 200
- `titleMatch`: true/false - Page title contains expected website name
- `filingNumberDisplayed`: true/false - Footer displays filing number (matches main body number pattern)
- `filingLinkCorrect`: true/false - Filing number links to beian.miit.gov.cn

**Performance Features:**
- Shared browser instance for all checks
- Concurrent processing with configurable workers (default: 5)
- Automatic retry on failure
- Real-time progress reporting
- Incremental CSV writing (no memory overflow)
- Resume support via `startFrom` parameter

**CSV Output:**
When checking 20+ websites or when `outputCsv: true`, generates a CSV file with all results.

**Usage Examples:**

Check single website:
```typescript
{
  "websites": [{
    "url": "https://example.com",
    "expectedName": "示例网站",
    "filingNumber": "京ICP备12345678号"
  }]
}
```

Check with custom concurrency and timeout:
```typescript
{
  "websites": [...],
  "concurrency": 10,
  "timeout": 15000,
  "retries": 2
}
```

Resume from index 500:
```typescript
{
  "websites": [...],
  "startFrom": 500
}
```

**Performance Estimates (10000 websites):**
- Concurrency: 5, Timeout: 30s, Success rate: 90% → ~15-18 hours
- Concurrency: 10, Timeout: 15s, Success rate: 90% → ~4-6 hours
- Concurrency: 20, Timeout: 10s, Success rate: 85% → ~2-3 hours

**Implementation Details:**
- Uses Puppeteer for full browser rendering
- Deep DOM traversal to find footer/copyright sections
- Extracts innerText from all elements
- Checks all anchor tags for beian.miit.gov.cn links
- Uses regex to match filing number patterns (主体备案号 or 网站备案号 with -1, -2, -3 suffix)
- Shared browser with multiple pages for efficiency
- Progress displayed as: `[Progress%] Status CompletedCount/Total | URL`
