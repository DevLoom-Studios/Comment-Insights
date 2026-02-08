
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { analyzeVideo } from "@/lib/ai/engine";
import { analyzeCompetitorGap } from "@/lib/ai/competitor";
import { extractVideoId } from "@/lib/youtube/fetcher";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Handle both JSON and Form Data
        const contentType = request.headers.get("content-type");
        let myAnalysisId: string;
        let competitorUrl: string;

        if (contentType?.includes("application/json")) {
            const body = await request.json();
            myAnalysisId = body.myAnalysisId;
            competitorUrl = body.competitorUrl;
        } else {
            const formData = await request.formData();
            myAnalysisId = formData.get("myAnalysisId") as string;
            competitorUrl = formData.get("competitorUrl") as string;
        }

        if (!myAnalysisId || !competitorUrl) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const myAnalysis = await prisma.videoAnalysis.findUnique({
            where: { id: myAnalysisId }
        });

        if (!myAnalysis) {
            return new NextResponse("Analysis not found", { status: 404 });
        }

        const theirVideoId = extractVideoId(competitorUrl);
        if (!theirVideoId) {
            return new NextResponse("Invalid competitor URL", { status: 400 });
        }

        // 1. Analyze competitor video (fetching comments etc)
        const theirAnalysis = await analyzeVideo(competitorUrl);

        // 2. Generate gap analysis
        const gapResult = await analyzeCompetitorGap(
            {
                metrics: {
                    painIndex: myAnalysis.painIndex,
                    demandVelocity: myAnalysis.demandVelocity,
                    loyaltyDepth: myAnalysis.loyaltyDepth,
                    confusionScore: myAnalysis.confusionScore
                },
                themes: myAnalysis.themes as any
            } as any,
            theirAnalysis
        );

        // 3. Save to database
        await prisma.competitorGap.create({
            data: {
                userId: session.user.id,
                myVideoId: myAnalysis.youtubeId,
                theirVideoId: theirVideoId,
                winningPoints: gapResult.winningPoints,
                losingPoints: gapResult.losingPoints,
                contentGaps: gapResult.contentGaps,
                whyUsHooks: gapResult.whyUsHooks,
            }
        });

        // 4. Redirect back to the competitor page
        return NextResponse.redirect(new URL(`/dashboard/${myAnalysisId}/competitor`, request.url), 303);

    } catch (error) {
        console.error("Comparison error:", error);
        return new NextResponse(error instanceof Error ? error.message : "Internal Error", { status: 500 });
    }
}
