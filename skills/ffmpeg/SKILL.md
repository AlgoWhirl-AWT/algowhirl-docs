---
name: ffmpeg
description: Full-featured video, audio and image processing using ffmpeg
user-invocable: true
metadata: {"clawdbot":{"emoji":"🎬","requires":{"bins":["ffmpeg","ffprobe"]},"install":[{"id":"brew","kind":"brew","formula":"ffmpeg","bins":["ffmpeg","ffprobe"],"label":"Install ffmpeg (brew)"}]}}
---

# FFmpeg Skill

Complete ffmpeg capabilities for video, audio, and image processing tasks.

## When to use this skill

Use this skill when users need to:
- Convert video/audio formats
- Extract audio from video
- Compress or resize videos
- Create GIFs from videos
- Extract frames or thumbnails
- Trim, cut, or merge videos
- Add watermarks or overlays
- Adjust video quality, bitrate, or frame rate
- Process live streams
- Extract metadata from media files
- **Convert, resize, crop, or process images**
- **Create thumbnails or image sequences**
- **Apply filters and effects to images**
- Any other ffmpeg operations

## Prerequisites

- ffmpeg installed and available in PATH
- ffprobe (usually comes with ffmpeg)

## Common Operations

### Video Conversion
```bash
# Convert video format
ffmpeg -i input.mp4 output.webm

# Convert with quality control
ffmpeg -i input.mp4 -crf 23 output.mp4
```

### Video Compression
```bash
# Compress video (lower CRF = higher quality, 18-28 is typical)
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 output.mp4

# Resize video
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4

# Reduce bitrate
ffmpeg -i input.mp4 -b:v 1M output.mp4
```

### Audio Operations
```bash
# Extract audio from video
ffmpeg -i input.mp4 -vn -acodec copy output.aac

# Convert audio format
ffmpeg -i input.wav output.mp3

# Adjust audio bitrate
ffmpeg -i input.mp3 -b:a 192k output.mp3

# Remove audio from video
ffmpeg -i input.mp4 -an output.mp4

# Add audio to video
ffmpeg -i video.mp4 -i audio.mp3 -c copy -map 0:v:0 -map 1:a:0 output.mp4
```

### Image Processing
```bash
# Convert image format
ffmpeg -i input.jpg output.png
ffmpeg -i input.png output.webp

# Resize image (maintain aspect ratio)
ffmpeg -i input.jpg -vf scale=800:-1 output.jpg

# Resize to specific dimensions
ffmpeg -i input.jpg -vf scale=1920:1080 output.jpg

# Crop image (width:height:x:y)
ffmpeg -i input.jpg -vf crop=800:600:100:50 output.jpg

# Convert to grayscale
ffmpeg -i input.jpg -vf hue=s=0 output.jpg

# Adjust brightness and contrast
ffmpeg -i input.jpg -vf eq=contrast=1.5:brightness=0.1 output.jpg

# Rotate image (90° clockwise)
ffmpeg -i input.jpg -vf transpose=1 output.jpg

# Flip image horizontally
ffmpeg -i input.jpg -vf hflip output.jpg

# Apply blur
ffmpeg -i input.jpg -vf boxblur=5:1 output.jpg

# Sharpen image
ffmpeg -i input.jpg -vf unsharp=5:5:1.0 output.jpg

# Create thumbnail
ffmpeg -i input.jpg -vf scale=200:-1 thumbnail.jpg

# Compress image with quality control
ffmpeg -i input.png -q:v 5 output.jpg  # q:v range: 1 (best) to 31 (worst)

# Convert multiple images to video
ffmpeg -framerate 1 -pattern_type glob -i '*.jpg' -c:v libx264 -pix_fmt yuv420p output.mp4

# Add watermark to image
ffmpeg -i input.jpg -i logo.png -filter_complex "overlay=10:10" output.jpg

# Batch convert images
for f in *.png; do ffmpeg -i "$f" "${f%.png}.jpg"; done

# Create image from solid color
ffmpeg -f lavfi -i color=c=blue:s=1920x1080:d=1 output.png

# Extract EXIF metadata
ffprobe -v quiet -print_format json -show_format input.jpg
```


### Frame Extraction
```bash
# Extract first frame
ffmpeg -i input.mp4 -vframes 1 frame.jpg

# Extract frame at specific time
ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 frame.jpg

# Extract all frames
ffmpeg -i input.mp4 frame%04d.png

# Extract one frame per second
ffmpeg -i input.mp4 -vf fps=1 frame%04d.jpg
```

### Create GIF
```bash
# Create GIF from video
ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos" output.gif

# Create GIF from specific time range
ffmpeg -ss 00:00:05 -t 3 -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos" output.gif
```

### Video Trimming and Cutting
```bash
# Cut video (start at 10s, duration 30s)
ffmpeg -ss 00:00:10 -t 00:00:30 -i input.mp4 -c copy output.mp4

# Cut video (from 10s to 40s)
ffmpeg -ss 00:00:10 -to 00:00:40 -i input.mp4 -c copy output.mp4

# Fast seek (less accurate but faster)
ffmpeg -ss 00:00:10 -i input.mp4 -t 30 -c copy output.mp4
```

### Video Concatenation
```bash
# Merge videos (create list.txt first)
# list.txt content:
# file 'video1.mp4'
# file 'video2.mp4'
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4

# Quick merge (same format)
ffmpeg -i "concat:video1.mp4|video2.mp4" -c copy output.mp4
```

### Add Watermark/Overlay
```bash
# Add image watermark
ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=10:10" output.mp4

# Add text watermark
ffmpeg -i input.mp4 -vf "drawtext=text='My Text':fontsize=24:x=10:y=10:fontcolor=white" output.mp4
```

### Video Speed
```bash
# Speed up 2x (video)
ffmpeg -i input.mp4 -filter:v "setpts=0.5*PTS" output.mp4

# Slow down 0.5x (video)
ffmpeg -i input.mp4 -filter:v "setpts=2.0*PTS" output.mp4

# Speed up with audio
ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" output.mp4
```

### Media Information
```bash
# Get detailed media info
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4

# Get duration
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4

# Get resolution
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 input.mp4
```

### Advanced Operations
```bash
# Create thumbnail sprite (contact sheet)
ffmpeg -i input.mp4 -vf "select='not(mod(n,30))',scale=160:90,tile=10x10" sprite.jpg

# Add subtitles
ffmpeg -i input.mp4 -vf subtitles=subtitle.srt output.mp4

# Rotate video (90° clockwise)
ffmpeg -i input.mp4 -vf "transpose=1" output.mp4

# Mirror/flip video
ffmpeg -i input.mp4 -vf hflip output.mp4  # horizontal flip
ffmpeg -i input.mp4 -vf vflip output.mp4  # vertical flip

# Denoise video
ffmpeg -i input.mp4 -vf "hqdn3d" output.mp4

# Stabilize video
ffmpeg -i input.mp4 -vf vidstabdetect=shakiness=10:accuracy=15 -f null -
ffmpeg -i input.mp4 -vf vidstabtransform=smoothing=30 output.mp4
```

### Live Streaming
```bash
# Stream to RTMP server
ffmpeg -re -i input.mp4 -c copy -f flv rtmp://server/live/stream

# Capture screen and stream
ffmpeg -f x11grab -s 1920x1080 -i :0.0 -f flv rtmp://server/live/stream
```

### Batch Processing
```bash
# Convert all MP4 to WebM in current directory
for f in *.mp4; do ffmpeg -i "$f" "${f%.mp4}.webm"; done

# Compress all videos
for f in *.mp4; do ffmpeg -i "$f" -crf 28 "compressed_${f}"; done
```

## Common Options

- `-i input.mp4` - Input file
- `-c copy` or `-codec copy` - Copy streams without re-encoding (fast)
- `-c:v libx264` - Use H.264 video codec
- `-c:a aac` - Use AAC audio codec
- `-crf 23` - Constant Rate Factor (quality, 0-51, lower=better, 23=default)
- `-b:v 1M` - Video bitrate
- `-b:a 192k` - Audio bitrate
- `-vf` - Video filter
- `-af` - Audio filter
- `-ss` - Start time
- `-t` - Duration
- `-to` - End time
- `-an` - No audio
- `-vn` - No video
- `-y` - Overwrite output without asking
- `-n` - Never overwrite output

## Notes

- Use `-c copy` when possible to avoid re-encoding (faster, no quality loss)
- CRF 18-28 is a good range for H.264 (23 is default, lower is better quality)
- For web delivery, use `-movflags +faststart` for MP4 to enable streaming
- Always check input format with `ffprobe` first
- Use `-threads 0` to use all CPU cores (default in modern ffmpeg)
- For debugging, add `-v debug` or `-v verbose`
- Check ffmpeg logs if operations fail

## Tips

1. **Fast seeking**: Put `-ss` before `-i` for faster seeking (less accurate) or after for accurate seeking (slower)
2. **Quality**: Use CRF for consistent quality, bitrate for predictable file size
3. **Web videos**: Use `-pix_fmt yuv420p` for better compatibility
4. **Lossless**: Use `-c:v libx264 -qp 0` for lossless H.264
5. **GPU acceleration**: Add `-hwaccel cuda` (NVIDIA) or `-hwaccel videotoolbox` (macOS) before `-i` for hardware acceleration

## Advanced Filters

- `scale=1280:720` - Resize
- `crop=w:h:x:y` - Crop video
- `fps=30` - Set frame rate
- `hue=s=0` - Convert to grayscale
- `eq=contrast=1.5:brightness=0.1` - Adjust contrast/brightness
- `unsharp=5:5:1.0` - Sharpen
- `boxblur=2:1` - Blur
- `fade=in:0:30` - Fade in (30 frames)
- `format=yuv420p` - Set pixel format

## Error Handling

If ffmpeg fails:
1. Check input file exists and is readable
2. Verify ffmpeg is in PATH: `which ffmpeg`
3. Check ffmpeg version: `ffmpeg -version`
4. Read error messages carefully - they're usually informative
5. Test with simpler command first
6. Use `-v verbose` for detailed logs

## Quick Reference

```bash
# Get help
ffmpeg -h
ffmpeg -h full                    # Full help
ffmpeg -formats                   # List formats
ffmpeg -codecs                    # List codecs
ffmpeg -filters                   # List filters

# Version info
ffmpeg -version
ffprobe -version
```

## Examples for Common Requests

**"Convert this video to MP4"**
```bash
ffmpeg -i input.avi -c:v libx264 -crf 23 -c:a aac output.mp4
```

**"Make this video smaller"**
```bash
ffmpeg -i input.mp4 -vf scale=1280:-1 -crf 28 output.mp4
```

**"Extract audio"**
```bash
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a
```

**"Create a 5-second GIF starting at 10 seconds"**
```bash
ffmpeg -ss 10 -t 5 -i input.mp4 -vf "fps=10,scale=480:-1:flags=lanczos" output.gif
```

**"Get video duration"**
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4
```

**"Convert image to PNG"**
```bash
ffmpeg -i input.jpg output.png
```

**"Resize image to 800px width"**
```bash
ffmpeg -i input.jpg -vf scale=800:-1 output.jpg
```

**"Compress image"**
```bash
ffmpeg -i input.png -q:v 10 output.jpg
```

**"Crop image"**
```bash
ffmpeg -i input.jpg -vf crop=800:600:0:0 output.jpg
```

**"Convert all PNGs to JPGs"**
```bash
for f in *.png; do ffmpeg -i "$f" "${f%.png}.jpg"; done
```


Remember: Always test commands on sample files first, especially for batch operations!
