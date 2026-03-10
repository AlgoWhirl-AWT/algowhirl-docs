---
name: youtube
description: Extract transcripts, subtitles, video information, and download videos from YouTube
user-invocable: true
metadata: {"clawdbot":{"emoji":"🎥","requires":{"bins":["python3","yt-dlp"]}}}
---

# YouTube Skill

Extract transcripts, subtitles, information, and download videos from YouTube for analysis and offline viewing.

## When to use this skill

Use this skill when users want to:
- Get transcript/subtitles from a YouTube video
- Summarize a YouTube video
- Extract video information (title, description, duration, etc.)
- **Download a YouTube video**
- **Download audio only from a YouTube video**
- "What's this YouTube video about?"
- "Transcribe this video"
- "Summarize this video: [URL]"
- "Download this YouTube video"
- "Download the audio from this video"

## Prerequisites

- Python 3
- yt-dlp (for video metadata)
- youtube-transcript-api (for transcripts)

## Usage

### Get Video Transcript
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --transcript
```

### Get Video Information
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --info
```

### Get Both Transcript and Info
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --transcript --info
```

### Specify Language
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --transcript --lang en
```

### Get Available Languages
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --list-languages
```

### Download Video (Best Quality)
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --download
```

### Download Video to Specific Directory
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --download --output-dir /path/to/output
```

### Download Audio Only (MP3)
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --download --quality audio
```

### Download Specific Quality
```bash
python3 {baseDir}/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --download --quality 720p
```

## Output Format

### For Transcript/Info Requests
Returns JSON with:
- `video_id`: YouTube video ID
- `title`: Video title
- `description`: Video description
- `duration`: Duration in seconds
- `view_count`: View count
- `uploader`: Channel name
- `transcript`: Full transcript text (if requested)
- `transcript_lines`: Array of transcript segments with timestamps (if requested)

### For Download Requests
Returns JSON with:
- `success`: Boolean indicating if download succeeded
- `file_path`: Path to downloaded file (if successful)
- `video_id`: YouTube video ID
- `message`: Success/error message
- `error`: Error details (if failed)

## Examples

**User: "Summarize this YouTube video: https://www.youtube.com/watch?v=dQw4w9WgXcQ"**

1. Get transcript:
```bash
python3 /root/clawdbot/skills/youtube/youtube.py --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --transcript --info
```

2. Use the transcript with the AI model to generate a summary

**User: "What's this video about?" (with YouTube link)**

Same workflow as above.

**User: "Transcribe this YouTube video"**

Get just the transcript without summarizing:
```bash
python3 /root/clawdbot/skills/youtube/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --transcript
```

**User: "Download this YouTube video: https://www.youtube.com/watch?v=dQw4w9WgXcQ"**

Download the video in best quality:
```bash
python3 /root/clawdbot/skills/youtube/youtube.py --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --download
```

**User: "Download the audio from this video"**

Download audio only as MP3:
```bash
python3 /root/clawdbot/skills/youtube/youtube.py --url "https://www.youtube.com/watch?v=VIDEO_ID" --download --quality audio
```

## Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`
- Video ID only: `VIDEO_ID`

## Language Codes

Common language codes for subtitles:
- `en` - English
- `zh` - Chinese (Simplified)
- `zh-Hans` - Chinese (Simplified)
- `zh-Hant` - Chinese (Traditional)
- `ja` - Japanese
- `ko` - Korean
- `es` - Spanish
- `fr` - French
- `de` - German

## Error Handling

- If transcript is not available: Returns error message
- If video is private/deleted: Returns error message
- If language not available: Falls back to auto-generated subtitles

## Tips

1. For long videos, extract transcript first and provide a summary
2. If user wants specific timestamps, parse the `transcript_lines` array
3. Use `--list-languages` to check available subtitle languages
4. Transcripts may include auto-generated captions if manual ones aren't available

## Integration with Other Skills

Works well with:
- **US3**: Upload transcript files to cloud storage
- **ffmpeg**: Process downloaded video files (if needed)
- AI models: Summarize, analyze, or answer questions about the video content
