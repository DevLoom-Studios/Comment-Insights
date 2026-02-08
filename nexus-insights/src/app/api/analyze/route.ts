// API Route: Analyze a YouTube video
// POST /api/analyze

import { NextRequest, NextResponse } from "next/server";
import { analyzeVideo } from "@/lib/ai/engine";
import { extractVideoId } from "@/lib/youtube/fetcher";
import prisma from "@/lib/db";

export const maxDuration = 60; // Allow up to 60 seconds for analysis

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, forceRefresh = false } = body;

        if (!url) {
            return NextResponse.json(
                { error: "YouTube URL is required" },
                { status: 400 }
            );
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return NextResponse.json(
                { error: "Invalid YouTube URL" },
                { status: 400 }
            );
        }

        // Check cache (unless force refresh)
        if (!forceRefresh) {
            const cached = await prisma.videoAnalysis.findFirst({
                where: {
                    youtubeId: videoId,
                    cachedAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours
                    },
                },
            });

            if (cached) {
                return NextResponse.json({
                    cached: true,
                    analysis: {
                        id: cached.id,
                        videoInfo: {
                            title: cached.title,
                            thumbnail: cached.thumbnail,
                            channelTitle: cached.channelTitle,
                            videoId: cached.youtubeId,
                        },
                        metrics: {
                            painIndex: cached.painIndex,
                            demandVelocity: cached.demandVelocity,
                            loyaltyDepth: cached.loyaltyDepth,
                            confusionScore: cached.confusionScore,
                        },
                        themes: cached.themes,
                        featureRequests: cached.featureRequests,
                        bugReports: cached.bugReports,
                        contentIdeas: cached.contentIdeas,
                        summary: cached.summary,
                        actionPlan: cached.actionPlan,
                        stats: {
                            totalFetched: cached.totalFetched,
                            totalAnalyzed: cached.totalComments,
                            trashCount: cached.trashCount,
                        },
                    },
                });
            }
        }

        // Run fresh analysis
        const result = await analyzeVideo(url);

        // Save to database
        const saved = await prisma.videoAnalysis.upsert({
            where: { youtubeId: videoId },
            update: {
                title: result.videoInfo.title,
                thumbnail: result.videoInfo.thumbnail,
                channelTitle: result.videoInfo.channelTitle,
                totalComments: result.stats.totalAnalyzed,
                painIndex: result.metrics.painIndex,
                demandVelocity: result.metrics.demandVelocity,
                loyaltyDepth: result.metrics.loyaltyDepth,
                confusionScore: result.metrics.confusionScore,
                summary: result.summary,
                themes: result.themes as any,
                featureRequests: result.featureRequests as any,
                bugReports: result.bugReports as any,
                contentIdeas: result.contentIdeas as any,
                actionPlan: result.actionPlan as any,
                totalFetched: result.stats.totalFetched,
                trashCount: result.stats.trashCount,
                cachedAt: new Date(),
            },
            create: {
                youtubeId: videoId,
                title: result.videoInfo.title,
                thumbnail: result.videoInfo.thumbnail,
                channelTitle: result.videoInfo.channelTitle,
                totalComments: result.stats.totalAnalyzed,
                painIndex: result.metrics.painIndex,
                demandVelocity: result.metrics.demandVelocity,
                loyaltyDepth: result.metrics.loyaltyDepth,
                confusionScore: result.metrics.confusionScore,
                summary: result.summary,
                themes: result.themes as any,
                featureRequests: result.featureRequests as any,
                bugReports: result.bugReports as any,
                contentIdeas: result.contentIdeas as any,
                actionPlan: result.actionPlan as any,
                totalFetched: result.stats.totalFetched,
                trashCount: result.stats.trashCount,
            },
        });

        return NextResponse.json({
            cached: false,
            analysis: {
                id: saved.id,
                ...result,
            },
        });
    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Analysis failed" },
            { status: 500 }
        );
    }
}
