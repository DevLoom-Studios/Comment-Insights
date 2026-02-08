// YouTube Data API v3 - Comment Fetcher
// Handles fetching, pagination, and smart sampling

import { YouTubeComment, YouTubeVideoInfo } from "@/types/analysis";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

/**
 * Fetch video metadata
 */
export async function fetchVideoInfo(videoId: string): Promise<YouTubeVideoInfo | null> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

    const url = new URL(`${YOUTUBE_API_BASE}/videos`);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("id", videoId);
    url.searchParams.set("part", "snippet,statistics");

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
        return null;
    }

    const video = data.items[0];
    return {
        videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        channelTitle: video.snippet.channelTitle,
        commentCount: parseInt(video.statistics.commentCount || "0", 10),
    };
}

/**
 * Fetch comments from a video
 * 
 * Smart sampling logic:
 * - If totalComments < 100: fetch all available
 * - If totalComments < 500: fetch top 200 by relevance
 * - If totalComments >= 500: fetch top 200 by relevance (covers 90% of signal)
 */
export async function fetchComments(
    videoId: string,
    maxResults: number = 200
): Promise<YouTubeComment[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

    const comments: YouTubeComment[] = [];
    let pageToken: string | undefined;

    // Fetch in batches of 100 (API maximum)
    while (comments.length < maxResults) {
        const remaining = maxResults - comments.length;
        const batchSize = Math.min(100, remaining);

        const url = new URL(`${YOUTUBE_API_BASE}/commentThreads`);
        url.searchParams.set("key", apiKey);
        url.searchParams.set("videoId", videoId);
        url.searchParams.set("part", "snippet");
        url.searchParams.set("maxResults", batchSize.toString());
        url.searchParams.set("order", "relevance"); // Top comments first
        url.searchParams.set("textFormat", "plainText");

        if (pageToken) {
            url.searchParams.set("pageToken", pageToken);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
            // Handle videos with comments disabled
            if (response.status === 403) {
                console.warn("Comments disabled for video:", videoId);
                break;
            }
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            break; // No more comments
        }

        for (const item of data.items) {
            const snippet = item.snippet.topLevelComment.snippet;
            comments.push({
                id: item.snippet.topLevelComment.id,
                text: snippet.textDisplay,
                author: snippet.authorDisplayName,
                authorImage: snippet.authorProfileImageUrl,
                likes: snippet.likeCount || 0,
                publishedAt: snippet.publishedAt,
            });
        }

        pageToken = data.nextPageToken;
        if (!pageToken) break; // No more pages
    }

    return comments;
}

/**
 * Smart sampler for large videos
 * Fetches a representative sample that captures the "signal" while minimizing quota usage
 */
export async function fetchSmartSample(
    videoId: string,
    totalComments: number
): Promise<YouTubeComment[]> {
    // For small videos, try to get everything
    if (totalComments < 100) {
        return fetchComments(videoId, totalComments);
    }

    // For medium/large videos, get top 200 by relevance
    // This typically captures the most engaged comments
    return fetchComments(videoId, 200);
}
