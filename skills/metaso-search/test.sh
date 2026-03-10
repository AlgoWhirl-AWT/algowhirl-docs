#!/bin/bash

# Test script for MetaSearch API

echo "=== Testing MetaSearch API ==="
echo ""

# Check if API key is set
if [ -z "$METASO_API_KEY" ]; then
    echo "Error: METASO_API_KEY environment variable is not set"
    echo "Please set it with: export METASO_API_KEY=\"your-api-key\""
    exit 1
fi

echo "API Key is set: ${METASO_API_KEY:0:10}..."
echo ""

echo "1. Testing Search API..."
echo "Query: 谁是这个世界上最美丽的女人"
echo ""

SEARCH_RESULT=$(curl -s --location 'https://metaso.cn/api/v1/search' \
--header "Authorization: Bearer $METASO_API_KEY" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data '{"q":"谁是这个世界上最美丽的女人","scope":"webpage","includeSummary":false,"size":"10","includeRawContent":false,"conciseSnippet":false}')

echo "Search Result:"
echo "$SEARCH_RESULT" | python3 -m json.tool 2>/dev/null || echo "$SEARCH_RESULT"
echo ""
echo "---"
echo ""

echo "2. Testing Reader API..."
echo "URL: https://www.163.com/news/article/K56809DQ000189FH.html"
echo ""

READER_RESULT=$(curl -s --location 'https://metaso.cn/api/v1/reader' \
--header "Authorization: Bearer $METASO_API_KEY" \
--header 'Accept: text/plain' \
--header 'Content-Type: application/json' \
--data '{"url":"https://www.163.com/news/article/K56809DQ000189FH.html"}')

echo "Reader Result (first 500 chars):"
echo "$READER_RESULT" | head -c 500
echo ""
echo "..."
echo ""
echo "=== Test Complete ==="
