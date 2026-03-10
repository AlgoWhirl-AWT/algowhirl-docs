---
name: file-server
description: Serve files via temporary HTTP URLs for download
user-invocable: true
metadata: {"clawdbot":{"emoji":"🌐","requires":{"bins":["node"]}}}
---

# File Server Skill

Provides temporary HTTP URLs for downloading files. This is useful when you need to share files that can't be uploaded to cloud storage or when you need quick, temporary download links.

## When to use this skill

Use this skill when:
- You need to provide a download link for a file
- File uploads to cloud storage (US3, S3, etc.) are failing or unavailable
- You need a quick temporary URL without authentication
- The user asks for a file download URL

## Usage

### Start Server and Serve a File
```bash
node {baseDir}/server.mjs --file /path/to/file.ext --port 8888 --bind 0.0.0.0
```

### Parameters
- `--file`: Path to the file to serve (required)
- `--port`: Port number (default: 8888)
- `--bind`: Bind address (default: 0.0.0.0, use 127.0.0.1 for localhost only)

## Output Format

Returns JSON with:
- `success`: Boolean indicating success
- `url`: Download URL (valid while server is running)
- `file_id`: Unique file identifier
- `file_name`: Original filename
- `file_size`: File size in bytes
- `message`: Status message

Example:
```json
{
  "success": true,
  "url": "http://127.0.0.1:8888/download/abc123xy/example.png",
  "file_id": "abc123xy",
  "file_name": "example.png",
  "file_size": 2097152,
  "message": "File server started. URL is valid while server is running."
}
```

## Important Notes

1. **Temporary URLs**: URLs are only valid while the server is running
2. **Process Management**: Server runs in background until stopped
3. **Network Access**: Use `--bind 0.0.0.0` to allow external access, `127.0.0.1` for local only
4. **Single File**: Each server instance serves one file; start multiple instances for multiple files
5. **No Authentication**: URLs are public if the server is accessible

## Stopping the Server

To stop a running file server, use `pkill` or kill the process by PID:
```bash
pkill -f "file-server/server.mjs"
```

## Examples

**Serve a downloaded YouTube video:**
```bash
node /root/clawdbot/skills/file-server/server.mjs --file "/path/to/video.mp4" --port 8888
```

**Serve an image file:**
```bash
node /root/clawdbot/skills/file-server/server.mjs --file "/tmp/image.png" --port 8889
```

## Integration with Other Skills

Works well with:
- **YouTube**: Serve downloaded videos/audio files
- **ffmpeg**: Serve processed media files
- **Any skill**: Provide download URLs for generated files
