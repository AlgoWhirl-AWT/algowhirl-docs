# Test Example for Website Beian Checker

## How to Use in Clawdbot

1. **启动 Clawdbot** with the skill loaded
2. **Call the tool** with your website list

## Example 1: Single Website Check

```
使用 website-beian-checker 检查以下网站：
- URL: https://www.example.com
- 网站名称: 示例网站
- 备案号: 京ICP备12345678号
```

## Example 2: Multiple Websites

```
检查以下网站的备案情况：
1. https://www.site1.com，网站名"网站一"，备案号京ICP备11111111号
2. https://www.site2.com，网站名"网站二"，备案号沪ICP备22222222号
3. https://www.site3.com，网站名"网站三"，备案号粤ICP备33333333号
```

## Example 3: Large Batch (CSV Output)

```
批量检查25个网站的备案信息，生成CSV报告
```

## Expected Output Format

```
## 网站备案检查结果

### https://www.example.com
- 网站可访问性: ✓ true
- 标题匹配: ✓ true
- 备案号显示: ✓ true
- 备案链接: ✓ true

### https://www.site2.com
- 网站可访问性: ✗ false
- 标题匹配: ✗ false
- 备案号显示: ✗ false
- 备案链接: ✗ false
- ⚠️  错误: net::ERR_NAME_NOT_RESOLVED

📄 CSV report saved to: beian-check-2026-01-29T10-30-45-123Z.csv
```

## CSV Output Format

| URL | 网站可访问性 | 标题匹配 | 备案号显示 | 备案链接 | 错误信息 |
|-----|------------|---------|-----------|---------|---------|
| https://www.example.com | true | true | true | true | |
| https://www.site2.com | false | false | false | false | net::ERR_NAME_NOT_RESOLVED |

## Notes

- CSV is automatically generated for 20+ websites
- Use `outputCsv: true` to force CSV generation
- Each check includes a 1-second delay to avoid rate limiting
- Timeout: 30 seconds per website
