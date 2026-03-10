# MetaSearch Skill (秘塔搜索)

A Claude Code skill for searching the web and reading web pages using MetaSearch API.

## Features

- **Web Search**: Search the web using MetaSearch API with customizable parameters
- **Web Reader**: Extract and read content from any web page
- **Chinese Support**: Full support for Chinese language queries and content

## Installation

1. Copy this skill directory to your Claude Code skills folder:
   ```bash
   ~/.claude/skills/metaso-search/
   ```

2. Set up your API key as an environment variable:
   ```bash
   export METASO_API_KEY="your-api-key-here"
   ```

   Or add it to your `~/.bashrc` or `~/.zshrc`:
   ```bash
   echo 'export METASO_API_KEY="your-api-key-here"' >> ~/.bashrc
   ```

## Usage

The skill can be invoked when you ask Claude to search the web or read web pages:

### Search Examples

```
Search for "谁是这个世界上最美丽的女人"
```

```
Find information about "AI development trends"
```

### Reader Examples

```
Read the content from https://example.com/article
```

## API Reference

### Search API

- **Endpoint**: `https://metaso.cn/api/v1/search`
- **Method**: POST
- **Parameters**:
  - `q`: Search query (required)
  - `scope`: Search scope (default: "webpage")
  - `includeSummary`: Include summary (default: false)
  - `size`: Number of results (default: "10", max: "10")
  - `includeRawContent`: Include raw content (default: false)
  - `conciseSnippet`: Use concise snippets (default: false)

### Reader API

- **Endpoint**: `https://metaso.cn/api/v1/reader`
- **Method**: POST
- **Parameters**:
  - `url`: The URL to read (required)

## Testing

Run the test script to verify the API is working:

```bash
./test.sh
```

## Environment Variables

- `METASO_API_KEY`: Your MetaSearch API key (required)

## License

This skill is provided as-is for use with Claude Code.
