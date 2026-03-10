#!/usr/bin/env python3
"""
YouTube Search Skill - 使用 YouTube Data API v3 搜索和发现视频
"""

from googleapiclient.discovery import build
import json
import sys
import argparse
import os

API_KEY = os.environ.get("YOUTUBE_API_KEY")

if not API_KEY:
    print(json.dumps({
        "error": "missing_api_key",
        "message": "YOUTUBE_API_KEY environment variable must be set. Get your API key from https://console.cloud.google.com/apis/credentials"
    }, indent=2, ensure_ascii=False), file=sys.stderr)
    sys.exit(1)

def search_videos(query, max_results=10, order='relevance', region_code='US'):
    """
    搜索 YouTube 视频

    Args:
        query: 搜索关键词
        max_results: 返回结果数量（1-50）
        order: 排序方式 (relevance, date, viewCount, rating)
        region_code: 地区代码
    """
    youtube = build('youtube', 'v3', developerKey=API_KEY)

    request = youtube.search().list(
        part="snippet",
        q=query,
        type="video",
        maxResults=min(max_results, 50),
        order=order,
        regionCode=region_code
    )
    response = request.execute()

    results = []
    for item in response.get('items', []):
        video_id = item['id']['videoId']
        snippet = item['snippet']

        results.append({
            'video_id': video_id,
            'title': snippet['title'],
            'channel': snippet['channelTitle'],
            'channel_id': snippet['channelId'],
            'description': snippet['description'],
            'published_at': snippet['publishedAt'],
            'thumbnail': snippet['thumbnails']['high']['url'],
            'url': f'https://www.youtube.com/watch?v={video_id}'
        })

    return {
        'query': query,
        'total_results': len(results),
        'videos': results
    }

def get_popular_videos(category_id=None, region_code='US', max_results=10):
    """
    获取热门/趋势视频

    Args:
        category_id: 视频分类ID (可选)
        region_code: 地区代码
        max_results: 返回结果数量
    """
    youtube = build('youtube', 'v3', developerKey=API_KEY)

    params = {
        'part': 'snippet,statistics',
        'chart': 'mostPopular',
        'regionCode': region_code,
        'maxResults': min(max_results, 50)
    }

    if category_id:
        params['videoCategoryId'] = category_id

    request = youtube.videos().list(**params)
    response = request.execute()

    results = []
    for item in response.get('items', []):
        video_id = item['id']
        snippet = item['snippet']
        stats = item['statistics']

        results.append({
            'video_id': video_id,
            'title': snippet['title'],
            'channel': snippet['channelTitle'],
            'channel_id': snippet['channelId'],
            'description': snippet['description'],
            'published_at': snippet['publishedAt'],
            'view_count': int(stats.get('viewCount', 0)),
            'like_count': int(stats.get('likeCount', 0)),
            'comment_count': int(stats.get('commentCount', 0)),
            'thumbnail': snippet['thumbnails']['high']['url'],
            'url': f'https://www.youtube.com/watch?v={video_id}'
        })

    return {
        'category_id': category_id,
        'region_code': region_code,
        'total_results': len(results),
        'videos': results
    }

def get_video_categories(region_code='US'):
    """获取视频分类列表"""
    youtube = build('youtube', 'v3', developerKey=API_KEY)

    request = youtube.videoCategories().list(
        part="snippet",
        regionCode=region_code
    )
    response = request.execute()

    categories = {}
    for item in response.get('items', []):
        categories[item['id']] = item['snippet']['title']

    return categories

def get_channel_videos(channel_id, max_results=20, order='date'):
    """
    获取频道的视频列表

    Args:
        channel_id: 频道ID
        max_results: 返回结果数量
        order: 排序方式 (date, viewCount, rating)
    """
    youtube = build('youtube', 'v3', developerKey=API_KEY)

    request = youtube.search().list(
        part="snippet",
        channelId=channel_id,
        type="video",
        maxResults=min(max_results, 50),
        order=order
    )
    response = request.execute()

    results = []
    for item in response.get('items', []):
        video_id = item['id']['videoId']
        snippet = item['snippet']

        results.append({
            'video_id': video_id,
            'title': snippet['title'],
            'description': snippet['description'],
            'published_at': snippet['publishedAt'],
            'thumbnail': snippet['thumbnails']['high']['url'],
            'url': f'https://www.youtube.com/watch?v={video_id}'
        })

    return {
        'channel_id': channel_id,
        'total_results': len(results),
        'videos': results
    }

def main():
    parser = argparse.ArgumentParser(description='YouTube Search Skill')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # search 命令
    search_parser = subparsers.add_parser('search', help='Search videos')
    search_parser.add_argument('query', help='Search query')
    search_parser.add_argument('--max-results', type=int, default=10, help='Max results (default: 10)')
    search_parser.add_argument('--order', default='relevance', choices=['relevance', 'date', 'viewCount', 'rating'])
    search_parser.add_argument('--region', default='US', help='Region code (default: US)')

    # popular 命令
    popular_parser = subparsers.add_parser('popular', help='Get popular videos')
    popular_parser.add_argument('--category', help='Category ID (optional)')
    popular_parser.add_argument('--max-results', type=int, default=10, help='Max results (default: 10)')
    popular_parser.add_argument('--region', default='US', help='Region code (default: US)')

    # categories 命令
    categories_parser = subparsers.add_parser('categories', help='List video categories')
    categories_parser.add_argument('--region', default='US', help='Region code (default: US)')

    # channel 命令
    channel_parser = subparsers.add_parser('channel', help='Get channel videos')
    channel_parser.add_argument('channel_id', help='Channel ID')
    channel_parser.add_argument('--max-results', type=int, default=20, help='Max results (default: 20)')
    channel_parser.add_argument('--order', default='date', choices=['date', 'viewCount', 'rating'])

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    try:
        if args.command == 'search':
            result = search_videos(
                query=args.query,
                max_results=args.max_results,
                order=args.order,
                region_code=args.region
            )
        elif args.command == 'popular':
            result = get_popular_videos(
                category_id=args.category,
                region_code=args.region,
                max_results=args.max_results
            )
        elif args.command == 'categories':
            result = get_video_categories(region_code=args.region)
        elif args.command == 'channel':
            result = get_channel_videos(
                channel_id=args.channel_id,
                max_results=args.max_results,
                order=args.order
            )

        print(json.dumps(result, indent=2, ensure_ascii=False))

    except Exception as e:
        error_result = {
            'error': str(e),
            'command': args.command
        }
        print(json.dumps(error_result, indent=2, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
