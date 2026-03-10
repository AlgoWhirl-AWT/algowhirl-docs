#!/usr/bin/env python3
"""
YouTube Transcript and Info Extractor
Extracts transcripts, subtitles, and video information from YouTube videos.
"""

import argparse
import json
import re
import sys
import subprocess
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter


def extract_video_id(url):
    """Extract video ID from various YouTube URL formats."""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$'  # Direct video ID
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None


def get_video_info(video_id):
    """Get video information using yt-dlp."""
    try:
        cmd = [
            'yt-dlp',
            '--dump-json',
            '--no-warnings',
            f'https://www.youtube.com/watch?v={video_id}'
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        if result.returncode != 0:
            return None

        data = json.loads(result.stdout)

        return {
            'video_id': video_id,
            'title': data.get('title'),
            'description': data.get('description'),
            'duration': data.get('duration'),
            'view_count': data.get('view_count'),
            'like_count': data.get('like_count'),
            'uploader': data.get('uploader'),
            'upload_date': data.get('upload_date'),
            'thumbnail': data.get('thumbnail'),
            'webpage_url': data.get('webpage_url'),
        }
    except Exception as e:
        return {'error': str(e)}


def get_transcript(video_id, languages=None):
    """Get video transcript using youtube-transcript-api."""
    try:
        api = YouTubeTranscriptApi()

        if languages:
            fetched = api.fetch(video_id, languages=languages)
        else:
            # Try to get transcript in English by default
            fetched = api.fetch(video_id, languages=['en'])

        # Get the transcript snippets
        snippets = fetched.snippets

        # Convert snippets to dict format for JSON serialization
        transcript_lines = []
        transcript_texts = []

        for snippet in snippets:
            transcript_lines.append({
                'text': snippet.text,
                'start': snippet.start,
                'duration': snippet.duration
            })
            transcript_texts.append(snippet.text)

        # Join all text
        transcript_text = ' '.join(transcript_texts)

        return {
            'transcript': transcript_text,
            'transcript_lines': transcript_lines,
            'language': fetched.language_code,
            'is_generated': fetched.is_generated
        }
    except Exception as e:
        return {'error': str(e), 'transcript': None}


def list_available_languages(video_id):
    """List all available transcript languages for a video."""
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)

        languages = []
        for transcript in transcript_list:
            languages.append({
                'language': transcript.language,
                'language_code': transcript.language_code,
                'is_generated': transcript.is_generated,
                'is_translatable': transcript.is_translatable
            })

        return {'available_languages': languages}
    except Exception as e:
        return {'error': str(e)}


def download_video(video_id, output_dir='.', quality='best', format_type='mp4'):
    """Download video using yt-dlp."""
    try:
        url = f'https://www.youtube.com/watch?v={video_id}'

        # Build yt-dlp command
        cmd = ['yt-dlp']

        # Use Android client to avoid 403 errors (doesn't require PO Token)
        cmd.extend([
            '--extractor-args', 'youtube:player_client=android',
        ])

        # Quality and format options
        if quality == 'best':
            cmd.extend(['-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'])
        elif quality == 'audio':
            cmd.extend(['-x', '--audio-format', 'mp3', '--audio-quality', '0'])
        else:
            cmd.extend(['-f', quality])

        # Output template
        cmd.extend(['-o', f'{output_dir}/%(title)s.%(ext)s'])

        # Other options
        cmd.extend([
            '--no-warnings',
            '--no-playlist',
            '--print', 'after_move:filepath',  # Print final file path
            url
        ])

        # Execute download
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)

        if result.returncode != 0:
            return {
                'success': False,
                'error': result.stderr or 'Download failed'
            }

        # Extract file path from output (last line is the file path)
        output_lines = result.stdout.strip().split('\n')
        file_path = output_lines[-1] if output_lines else None

        return {
            'success': True,
            'file_path': file_path,
            'video_id': video_id,
            'message': f'Video downloaded successfully to: {file_path}'
        }
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': 'Download timed out (exceeded 5 minutes)'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def main():
    parser = argparse.ArgumentParser(
        description='Extract transcripts and information from YouTube videos'
    )
    parser.add_argument('--url', required=True, help='YouTube video URL or ID')
    parser.add_argument('--transcript', action='store_true', help='Get video transcript')
    parser.add_argument('--info', action='store_true', help='Get video information')
    parser.add_argument('--list-languages', action='store_true', help='List available subtitle languages')
    parser.add_argument('--lang', nargs='+', help='Preferred language codes (e.g., en zh)')
    parser.add_argument('--download', action='store_true', help='Download video')
    parser.add_argument('--output-dir', default='.', help='Output directory for downloads (default: current directory)')
    parser.add_argument('--quality', default='best',
                       help='Video quality: best, audio, or format code (default: best)')

    args = parser.parse_args()

    # Extract video ID
    video_id = extract_video_id(args.url)
    if not video_id:
        print(json.dumps({
            'error': 'Invalid YouTube URL or video ID',
            'url': args.url
        }, indent=2))
        sys.exit(1)

    result = {'video_id': video_id}

    # Download video
    if args.download:
        download_result = download_video(video_id, args.output_dir, args.quality)
        result.update(download_result)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return

    # List available languages
    if args.list_languages:
        lang_info = list_available_languages(video_id)
        result.update(lang_info)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return

    # Get video info
    if args.info:
        info = get_video_info(video_id)
        if info:
            result.update(info)

    # Get transcript
    if args.transcript:
        transcript_data = get_transcript(video_id, args.lang)
        result.update(transcript_data)

    # If neither flag is set, get both
    if not args.transcript and not args.info:
        info = get_video_info(video_id)
        if info:
            result.update(info)
        transcript_data = get_transcript(video_id, args.lang)
        result.update(transcript_data)

    # Output JSON
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
