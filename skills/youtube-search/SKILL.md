# YouTube Search Skill

Search and discover YouTube videos using the YouTube Data API v3.

## Commands

### 1. Search Videos

Search YouTube videos by keywords.

```bash
python3 {baseDir}/search.py search "AI technology" --max-results 10 --order viewCount
```

**Parameters:**
- `query` (required): Search keywords
- `--max-results`: Number of results (1-50, default: 10)
- `--order`: Sort order
  - `relevance` (default): Most relevant
  - `viewCount`: Most viewed
  - `date`: Most recent
  - `rating`: Highest rated
- `--region`: Region code (default: US)

**Output:**
```json
{
  "query": "AI technology",
  "total_results": 10,
  "videos": [
    {
      "video_id": "abc123",
      "title": "Video Title",
      "channel": "Channel Name",
      "channel_id": "UC...",
      "description": "Video description...",
      "published_at": "2025-01-20T12:00:00Z",
      "thumbnail": "https://...",
      "url": "https://www.youtube.com/watch?v=abc123"
    }
  ]
}
```

### 2. Get Popular Videos

Get trending/popular videos.

```bash
python3 {baseDir}/search.py popular --category 28 --max-results 10 --region US
```

**Parameters:**
- `--category`: Category ID (optional)
  - 1: Film & Animation
  - 10: Music
  - 15: Pets & Animals
  - 17: Sports
  - 20: Gaming
  - 22: People & Blogs
  - 23: Comedy
  - 24: Entertainment
  - 25: News & Politics
  - 28: Science & Technology
- `--max-results`: Number of results (1-50, default: 10)
- `--region`: Region code (default: US)

**Output:**
```json
{
  "category_id": "28",
  "region_code": "US",
  "total_results": 10,
  "videos": [
    {
      "video_id": "abc123",
      "title": "Video Title",
      "channel": "Channel Name",
      "view_count": 1000000,
      "like_count": 50000,
      "comment_count": 5000,
      "url": "https://www.youtube.com/watch?v=abc123"
    }
  ]
}
```

### 3. List Video Categories

Get available video categories.

```bash
python3 {baseDir}/search.py categories --region US
```

**Output:**
```json
{
  "1": "Film & Animation",
  "10": "Music",
  "28": "Science & Technology"
}
```

### 4. Get Channel Videos

Get videos from a specific channel.

```bash
python3 {baseDir}/search.py channel UC_x5XG1OV2P6uZZ5FSM9Ttw --max-results 20 --order date
```

**Parameters:**
- `channel_id` (required): YouTube channel ID
- `--max-results`: Number of results (1-50, default: 20)
- `--order`: Sort order (date, viewCount, rating)

## When to Use

Use this skill when you need to:

- **Search for videos** by keywords or topics
- **Discover trending content** in specific categories
- **Find popular videos** by region or category
- **Explore channel content** from specific creators
- **Get video recommendations** based on search queries

## Integration with Other Skills

### With existing `youtube` skill:

1. Use `youtube-search` to find videos
2. Use `youtube` to extract transcripts
3. Generate summaries with AI

**Example workflow:**
```bash
# Step 1: Search for AI news videos
python3 search.py search "AI news" --max-results 5 --order viewCount

# Step 2: Extract transcript for top video
python3 ../youtube/youtube.py --url "VIDEO_URL" --transcript

# Step 3: AI generates summary
```

## Examples

**Find most viewed Python tutorials:**
```bash
python3 {baseDir}/search.py search "Python tutorial" --order viewCount --max-results 5
```

**Get trending tech videos:**
```bash
python3 {baseDir}/search.py popular --category 28 --region US --max-results 10
```

**Explore a specific channel:**
```bash
python3 {baseDir}/search.py channel UCXuqSBlHAE6Xw-yeJA0Tunw --max-results 10
```

## Region Codes

Common region codes:
- `US` - United States
- `GB` - United Kingdom
- `JP` - Japan
- `CN` - China
- `IN` - India
- `DE` - Germany
- `FR` - France
- `KR` - South Korea

## API Quota

This skill uses YouTube Data API v3 with the following quota costs:
- Search: 100 units per request
- Videos (popular): 1 unit per request
- Categories: 1 unit per request

Daily quota: 10,000 units (enough for ~100 searches per day)

## Requirements

- Python 3.9+
- google-api-python-client

Install dependencies:
```bash
pip install google-api-python-client
```

## Configuration

**Required Environment Variable:**

This skill requires a YouTube Data API v3 key. Set it as an environment variable:

```bash
export YOUTUBE_API_KEY="your-api-key-here"
```

**How to get an API key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key and set it as the environment variable above
