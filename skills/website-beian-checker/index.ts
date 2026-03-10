import puppeteer, { type Browser, type Page } from 'puppeteer';
import { stringify } from 'csv-stringify/sync';
import { writeFile, appendFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import pLimit from 'p-limit';
import type { SkillDefinition } from 'clawdbot/plugin-sdk';

interface WebsiteCheck {
  url: string;
  expectedName: string;
  filingNumber: string;
}

interface CheckResult {
  url: string;
  accessible: boolean;
  titleMatch: boolean;
  filingNumberDisplayed: boolean;
  filingLinkCorrect: boolean;
  error?: string;
  // Debug info
  actualTitle?: string;
  foundFilingNumber?: string;
  method?: 'puppeteer' | 'curl';
}

interface CheckOptions {
  concurrency?: number;
  timeout?: number;
  retries?: number;
  startFrom?: number;
  batchSize?: number;
}

/**
 * Extract the main body filing number without suffix
 * e.g., "京ICP备12345678号-1" -> "京ICP备12345678号"
 */
function extractMainFilingNumber(filingNumber: string): string {
  return filingNumber.replace(/-\d+$/, '');
}

/**
 * Check if text contains the filing number pattern
 * Returns the found filing number or null
 * Only uses the main body filing number from input parameter
 */
function findFilingNumber(text: string, expectedFilingNumber: string): string | null {
  const mainNumber = extractMainFilingNumber(expectedFilingNumber);
  // Escape special regex characters
  const escaped = mainNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match main number or main number with suffix (-1, -2, etc.)
  const pattern = new RegExp(escaped + '(?:-\\d+)?', 'i');
  const match = text.match(pattern);
  return match ? match[0] : null;
}

/**
 * Check if text contains the filing number pattern
 */
function hasFilingNumber(text: string, filingNumber: string): boolean {
  return findFilingNumber(text, filingNumber) !== null;
}

/**
 * Check if URL links to beian.miit.gov.cn
 */
function isBeianLink(url: string): boolean {
  return /beian\.miit\.gov\.cn/i.test(url);
}

/**
 * Check a single website for beian compliance using a shared browser
 */
async function checkWebsite(
  browser: Browser,
  check: WebsiteCheck,
  timeout: number = 30000
): Promise<CheckResult> {
  const result: CheckResult = {
    url: check.url,
    accessible: false,
    titleMatch: false,
    filingNumberDisplayed: false,
    filingLinkCorrect: false,
  };

  let page: Page | null = null;
  try {
    // Create a new page in the shared browser
    page = await browser.newPage();

    // Set user agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to the website
    const response = await page.goto(check.url, {
      waitUntil: 'networkidle2',
      timeout,
    });

    // Check accessibility (HTTP 200)
    if (response && response.status() === 200) {
      result.accessible = true;
    }

    // Check title match
    const title = await page.title();
    result.actualTitle = title;
    if (title && title.includes(check.expectedName)) {
      result.titleMatch = true;
    }

    // Mark method used
    result.method = 'puppeteer';

    // Deep DOM analysis for filing information
    const pageData = await page.evaluate(() => {
      const data = {
        allLinks: [] as { href: string; text: string }[],
        bodyText: '',
      };

      // Get full body text
      const body = document.querySelector('body');
      if (body instanceof HTMLElement) {
        data.bodyText = body.innerText;
      }

      // Extract all links
      const links = document.querySelectorAll('a');
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        const text = link.innerText.trim();
        if (href || text) {
          data.allLinks.push({ href, text });
        }
      }

      return data;
    });

    // Check filing number display in full body text
    const foundFiling = findFilingNumber(pageData.bodyText, check.filingNumber);
    if (foundFiling) {
      result.filingNumberDisplayed = true;
      result.foundFilingNumber = foundFiling;
    }

    // Check filing link correctness
    for (const link of pageData.allLinks) {
      // Check if link points to beian.miit.gov.cn
      if (isBeianLink(link.href)) {
        result.filingLinkCorrect = true;
        break;
      }

      // Also check if the link text contains filing number and hrefs to beian site
      if (hasFilingNumber(link.text, check.filingNumber) && isBeianLink(link.href)) {
        result.filingLinkCorrect = true;
        break;
      }
    }

  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  } finally {
    if (page) {
      await page.close();
    }
  }

  return result;
}

/**
 * Check a website with retry logic
 */
async function checkWebsiteWithRetry(
  browser: Browser,
  check: WebsiteCheck,
  timeout: number,
  retries: number
): Promise<CheckResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await checkWebsite(browser, check, timeout);
      // If no error, return immediately
      if (!result.error) {
        return result;
      }
      // If it's the last attempt, return the result with error
      if (attempt === retries) {
        return result;
      }
      // Otherwise, retry
      lastError = new Error(result.error);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === retries) {
        return {
          url: check.url,
          accessible: false,
          titleMatch: false,
          filingNumberDisplayed: false,
          filingLinkCorrect: false,
          error: lastError.message,
        };
      }
    }
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Should never reach here, but TypeScript needs this
  return {
    url: check.url,
    accessible: false,
    titleMatch: false,
    filingNumberDisplayed: false,
    filingLinkCorrect: false,
    error: lastError?.message || 'Unknown error',
  };
}

/**
 * Generate CSV header
 */
function getCsvHeader(): string {
  return stringify(
    [
      {
        URL: '',
        '网站可访问性': '',
        '标题匹配': '',
        '备案号显示': '',
        '备案链接': '',
        '错误信息': '',
        '实际标题': '',
        '找到的备案号': '',
        '检测方法': '',
      },
    ],
    { header: true, bom: true }
  ).split('\n')[0] + '\n';
}

/**
 * Generate CSV row from a single result
 */
function generateCsvRow(result: CheckResult): string {
  const record = {
    URL: result.url,
    '网站可访问性': result.accessible ? 'true' : 'false',
    '标题匹配': result.titleMatch ? 'true' : 'false',
    '备案号显示': result.filingNumberDisplayed ? 'true' : 'false',
    '备案链接': result.filingLinkCorrect ? 'true' : 'false',
    '错误信息': result.error || '',
    '实际标题': result.actualTitle || '',
    '找到的备案号': result.foundFilingNumber || '',
    '检测方法': result.method || 'puppeteer',
  };

  return stringify([record], { header: false });
}

/**
 * Generate full CSV output from results
 */
function generateCsv(results: CheckResult[]): string {
  const records = results.map((r) => ({
    URL: r.url,
    '网站可访问性': r.accessible ? 'true' : 'false',
    '标题匹配': r.titleMatch ? 'true' : 'false',
    '备案号显示': r.filingNumberDisplayed ? 'true' : 'false',
    '备案链接': r.filingLinkCorrect ? 'true' : 'false',
    '错误信息': r.error || '',
    '实际标题': r.actualTitle || '',
    '找到的备案号': r.foundFilingNumber || '',
    '检测方法': r.method || 'puppeteer',
  }));

  return stringify(records, {
    header: true,
    bom: true,
  });
}

/**
 * Format results as readable text (limit output for large batches)
 */
function formatResults(results: CheckResult[], maxShow: number = 20): string {
  const lines: string[] = [];
  const total = results.length;
  const passed = results.filter(r => r.accessible && r.titleMatch && r.filingNumberDisplayed && r.filingLinkCorrect).length;
  const failed = total - passed;

  lines.push('## 网站备案检查结果');
  lines.push(`\n📊 总计: ${total} | ✓ 通过: ${passed} | ✗ 失败: ${failed}\n`);

  // Show first N results
  const showCount = Math.min(maxShow, results.length);
  for (let i = 0; i < showCount; i++) {
    const result = results[i];
    lines.push(`### ${i + 1}. ${result.url}`);
    lines.push(`- 网站可访问性: ${result.accessible ? '✓ true' : '✗ false'}`);
    lines.push(`- 标题匹配: ${result.titleMatch ? '✓ true' : '✗ false'}`);
    lines.push(`- 备案号显示: ${result.filingNumberDisplayed ? '✓ true' : '✗ false'}`);
    lines.push(`- 备案链接: ${result.filingLinkCorrect ? '✓ true' : '✗ false'}`);

    // Show debug info for failures
    if (!result.titleMatch && result.actualTitle) {
      lines.push(`  ℹ️  实际标题: ${result.actualTitle}`);
    }
    if (!result.filingNumberDisplayed && result.accessible) {
      lines.push(`  ℹ️  找到的备案号: ${result.foundFilingNumber || '未找到'}`);
    }
    if (result.error) {
      lines.push(`  ⚠️  错误: ${result.error}`);
    }

    lines.push('');
  }

  if (results.length > maxShow) {
    lines.push(`\n... 还有 ${results.length - maxShow} 条结果，请查看CSV文件获取完整数据\n`);
  }

  return lines.join('\n');
}

const skill: SkillDefinition = {
  name: 'website-beian-checker',
  description: 'Website ICP beian (filing) compliance checker with high-performance batch processing',
  tools: [
    {
      name: 'check_website_beian',
      description: 'Check website ICP beian compliance status using Puppeteer with parallel processing',
      input_schema: {
        type: 'object',
        properties: {
          websites: {
            type: 'array',
            description: 'Array of websites to check',
            items: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Website URL',
                },
                expectedName: {
                  type: 'string',
                  description: 'Expected website name from filing records',
                },
                filingNumber: {
                  type: 'string',
                  description: 'Main body filing number (主体备案号)',
                },
              },
              required: ['url', 'expectedName', 'filingNumber'],
            },
          },
          outputCsv: {
            type: 'boolean',
            description: 'Generate CSV output (auto-enabled for 20+ records)',
          },
          concurrency: {
            type: 'number',
            description: 'Number of concurrent checks (default: 5, max: 20)',
          },
          timeout: {
            type: 'number',
            description: 'Timeout per website in milliseconds (default: 30000)',
          },
          retries: {
            type: 'number',
            description: 'Number of retries on failure (default: 1)',
          },
          startFrom: {
            type: 'number',
            description: 'Start checking from index (for resuming)',
          },
        },
        required: ['websites'],
      },
      handler: async (params: any) => {
        // Explicit parameter extraction with validation
        const {
          websites,
          outputCsv = false,
          concurrency = 5,
          timeout = 30000,
          retries = 1,
          startFrom = 0
        } = params || {};

        // Validate websites parameter
        if (!websites) {
          throw new Error('Parameter "websites" is required');
        }
        if (!Array.isArray(websites)) {
          throw new Error('Parameter "websites" must be an array');
        }
        if (websites.length === 0) {
          throw new Error('At least one website must be provided');
        }

        // Validate each website object
        for (let i = 0; i < websites.length; i++) {
          const site = websites[i];
          if (!site.url) {
            throw new Error(`Website at index ${i} is missing "url" field`);
          }
          if (!site.expectedName) {
            throw new Error(`Website at index ${i} is missing "expectedName" field`);
          }
          if (!site.filingNumber) {
            throw new Error(`Website at index ${i} is missing "filingNumber" field`);
          }
        }

        // Validate parameters
        const maxConcurrency = Math.min(Math.max(1, concurrency), 20);
        const timeoutMs = Math.max(5000, Math.min(timeout, 120000)); // 5s to 120s
        const maxRetries = Math.max(0, Math.min(retries, 3)); // 0 to 3
        const startIndex = Math.max(0, Math.min(startFrom, websites.length - 1));

        console.log(`\n🚀 Starting batch check with ${maxConcurrency} concurrent workers`);
        console.log(`⚙️  Timeout: ${timeoutMs}ms | Retries: ${maxRetries} | Starting from: ${startIndex}\n`);

        // Determine if CSV output is needed
        const shouldOutputCsv = outputCsv || websites.length >= 20;
        let csvFilepath: string | null = null;

        // Create CSV file with header if needed
        if (shouldOutputCsv) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `beian-check-${timestamp}.csv`;
          csvFilepath = join(process.cwd(), filename);

          // Write CSV header
          const header = getCsvHeader();
          await writeFile(csvFilepath, header, 'utf-8');
          console.log(`📄 CSV file created: ${filename}\n`);
        }

        const results: CheckResult[] = [];
        let browser: Browser | null = null;

        try {
          console.log('🌐 Launching Puppeteer browser...');

          // Launch shared browser
          browser = await puppeteer.launch({
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
            ],
          });

          console.log('✅ Browser launched successfully\n');

          // Create concurrency limiter
          const limit = pLimit(maxConcurrency);

          // Slice websites to check (for resume support)
          const websitesToCheck = websites.slice(startIndex);
          const totalCount = websitesToCheck.length;
          let completedCount = 0;

          // Create concurrent check tasks
          const checkPromises = websitesToCheck.map((website, index) =>
            limit(async () => {
              const absoluteIndex = startIndex + index;
              const result = await checkWebsiteWithRetry(browser!, website, timeoutMs, maxRetries);
              results.push(result);
              completedCount++;

              // Progress report
              const progress = ((completedCount / totalCount) * 100).toFixed(1);
              const status = result.error ? '✗' : '✓';
              console.log(
                `[${progress}%] ${status} ${completedCount}/${totalCount} | ${website.url}`
              );

              // Write to CSV incrementally if enabled
              if (csvFilepath) {
                const csvRow = generateCsvRow(result);
                await appendFile(csvFilepath, csvRow, 'utf-8');
              }

              return result;
            })
          );

          // Wait for all checks to complete
          await Promise.all(checkPromises);

          console.log(`\n✅ Batch check completed: ${completedCount}/${totalCount} websites checked\n`);

        } catch (error) {
          console.error('\n❌ Fatal error during batch check:');
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            console.error(`Stack: ${error.stack}`);
          } else {
            console.error(String(error));
          }

          // If we have partial results, still save them
          if (results.length > 0 && csvFilepath) {
            console.log(`\n⚠️  Partial results (${results.length} websites) saved to CSV`);
          }

          throw new Error(`Batch check failed: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          // Close browser
          if (browser) {
            console.log('🔒 Closing browser...');
            await browser.close();
            console.log('✅ Browser closed');
          }
        }

        // Format output
        let output = formatResults(results, shouldOutputCsv ? 10 : 20);

        if (csvFilepath) {
          output += `\n\n📄 Complete CSV report saved to: ${csvFilepath.split('/').pop()}`;
          output += `\n📊 Total checked: ${results.length} websites`;
        }

        return output;
      },
    },
  ],
};

export default skill;
