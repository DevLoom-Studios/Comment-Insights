// Main Analysis Engine - Orchestrates the full pipeline
// YouTube Fetch → Filter → Map → Aggregate → Synthesize

import { filterComments } from "./filter";
import { mapComments } from "./mapper";
import { aggregateMetrics } from "./aggregator";
import { synthesizeStrategy } from "./reducer";
import { fetchVideoInfo, fetchSmartSample, extractVideoId } from "@/lib/youtube/fetcher";
import { DeepAnalysisResult } from "@/types/analysis";

export interface AnalysisProgress {
    step: "fetching" | "filtering" | "analyzing" | "synthesizing" | "complete";
    message: string;
    progress: number;
}

export type ProgressCallback = (progress: AnalysisProgress) => void;

/**
 * Run the complete analysis pipeline on a YouTube video
 */
export async function analyzeVideo(
    urlOrId: string,
    onProgress?: ProgressCallback
): Promise<DeepAnalysisResult & { videoInfo: { title: string; thumbnail: string; channelTitle: string; videoId: string } }> {
    // Extract video ID
    const videoId = extractVideoId(urlOrId);
    if (!videoId) {
        throw new Error("Invalid YouTube URL or video ID");
    }

    // Step 1: Fetch video info and comments
    onProgress?.({
        step: "fetching",
        message: "Fetching video information and comments...",
        progress: 10,
    });

    const videoInfo = await fetchVideoInfo(videoId);
    if (!videoInfo) {
        throw new Error("Video not found or is private");
    }

    const rawComments = await fetchSmartSample(videoId, videoInfo.commentCount);

    if (rawComments.length === 0) {
        throw new Error("No comments found. Comments may be disabled for this video.");
    }

    onProgress?.({
        step: "fetching",
        message: `Fetched ${rawComments.length} comments from "${videoInfo.title}"`,
        progress: 25,
    });

    // Step 2: Filter trash comments
    onProgress?.({
        step: "filtering",
        message: "Filtering spam and noise...",
        progress: 30,
    });

    const { cleaned, trashCount } = filterComments(rawComments);

    onProgress?.({
        step: "filtering",
        message: `Filtered ${trashCount} spam/noise comments. ${cleaned.length} remaining.`,
        progress: 40,
    });

    if (cleaned.length === 0) {
        throw new Error("All comments were filtered as spam/noise. Cannot analyze.");
    }

    // Step 3: AI Classification (Map phase)
    onProgress?.({
        step: "analyzing",
        message: "Analyzing comment sentiment and categories...",
        progress: 45,
    });

    const classifiedComments = await mapComments(
        cleaned.map(c => ({
            id: c.id as string,
            text: c.text,
            author: c.author as string,
            authorImage: c.authorImage as string | undefined,
            likes: c.likes as number,
            publishedAt: c.publishedAt as string | undefined,
        })),
        (processed, total) => {
            const progress = 45 + Math.round((processed / total) * 30);
            onProgress?.({
                step: "analyzing",
                message: `Classified ${processed}/${total} comments...`,
                progress,
            });
        }
    );

    // Step 4: Mathematical Aggregation (Reduce phase - no AI)
    onProgress?.({
        step: "synthesizing",
        message: "Calculating metrics and patterns...",
        progress: 80,
    });

    const aggregated = aggregateMetrics(classifiedComments);

    // Step 5: Strategic Synthesis (AI summary)
    onProgress?.({
        step: "synthesizing",
        message: "Generating insights and recommendations...",
        progress: 90,
    });

    const strategy = await synthesizeStrategy(aggregated);

    // Complete
    onProgress?.({
        step: "complete",
        message: "Analysis complete!",
        progress: 100,
    });

    return {
        videoInfo: {
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail,
            channelTitle: videoInfo.channelTitle,
            videoId: videoInfo.videoId,
        },
        metrics: {
            painIndex: aggregated.painIndex,
            demandVelocity: aggregated.demandVelocity,
            loyaltyDepth: aggregated.loyaltyDepth,
            confusionScore: aggregated.confusionScore,
        },
        themes: aggregated.themes,
        featureRequests: aggregated.featureRequests,
        bugReports: aggregated.bugReports,
        contentIdeas: aggregated.contentIdeas,
        summary: strategy.summary,
        actionPlan: strategy.actionPlan,
        stats: {
            totalFetched: rawComments.length,
            totalAnalyzed: classifiedComments.length,
            trashCount,
        },
    };
}
