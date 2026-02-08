// Competitor Gap Analysis - "Battle Card" logic
// Compares two video analyses to find strategic opportunities

import { ChatGroq } from "@langchain/groq";
import { DeepAnalysisResult, CompetitorGapResult } from "@/types/analysis";

const COMPETITOR_PROMPT = `ROLE:
You are a Competitive Intelligence Officer and Growth Hacking Strategist.

CONTEXT:
You are comparing OUR product/channel's customer feedback against a RIVAL's.

OUR ANALYSIS (User A):
- Pain Index: {myPainIndex}/100
- Demand Velocity: {myDemandVelocity}/100
- Top Themes: {myThemes}
- Key Issues: {myIssues}

RIVAL ANALYSIS (User B):
- Pain Index: {theirPainIndex}/100
- Demand Velocity: {theirDemandVelocity}/100
- Top Themes: {theirThemes}
- Key Issues: {theirIssues}

TASK:
Analyze both datasets and generate competitive intelligence in valid JSON:

1. "winningPoints": Array of topics where WE perform better (lower pain, higher praise).
   Each: {"topic": "...", "ourSentiment": "POS/NEG/NEU", "theirSentiment": "POS/NEG/NEU", "insight": "..."}

2. "losingPoints": Array of topics where THEY perform better.
   Same format as above.

3. "contentGaps": Array of unanswered questions or opportunities.
   Each: {"question": "...", "frequency": number, "source": "ours/theirs/both"}

4. "whyUsHooks": Array of 3-5 specific marketing hooks based on competitor weaknesses.
   Format: "Tired of [Rival's Bug]? We built [Our Feature] specifically for this."
   Be specific, use actual topics from the data.

OUTPUT FORMAT:
Return ONLY valid JSON, no markdown or explanation.`;

/**
 * Compare two video analyses and generate competitive intelligence
 */
export async function analyzeCompetitorGap(
    myAnalysis: DeepAnalysisResult,
    theirAnalysis: DeepAnalysisResult
): Promise<CompetitorGapResult> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY not configured");

    const model = new ChatGroq({
        apiKey,
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
    });

    // Format themes for comparison
    const formatThemes = (themes: typeof myAnalysis.themes) =>
        themes.slice(0, 5).map(t =>
            `${t.topic} (${t.sentiment}, intensity ${t.intensity}, ${t.volume} comments)`
        ).join("; ") || "No major themes";

    // Format issues
    const formatIssues = (analysis: DeepAnalysisResult) =>
        [...analysis.bugReports.slice(0, 3), ...analysis.featureRequests.slice(0, 3)].join("; ") || "None identified";

    const prompt = COMPETITOR_PROMPT
        .replace("{myPainIndex}", myAnalysis.metrics.painIndex.toString())
        .replace("{myDemandVelocity}", myAnalysis.metrics.demandVelocity.toString())
        .replace("{myThemes}", formatThemes(myAnalysis.themes))
        .replace("{myIssues}", formatIssues(myAnalysis))
        .replace("{theirPainIndex}", theirAnalysis.metrics.painIndex.toString())
        .replace("{theirDemandVelocity}", theirAnalysis.metrics.demandVelocity.toString())
        .replace("{theirThemes}", formatThemes(theirAnalysis.themes))
        .replace("{theirIssues}", formatIssues(theirAnalysis));

    try {
        const response = await model.invoke(prompt);
        const content = typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content);

        const parsed = JSON.parse(content.trim());

        return {
            winningPoints: parsed.winningPoints || [],
            losingPoints: parsed.losingPoints || [],
            contentGaps: parsed.contentGaps || [],
            whyUsHooks: parsed.whyUsHooks || [],
            comparison: {
                myPainIndex: myAnalysis.metrics.painIndex,
                theirPainIndex: theirAnalysis.metrics.painIndex,
                myDemandVelocity: myAnalysis.metrics.demandVelocity,
                theirDemandVelocity: theirAnalysis.metrics.demandVelocity,
            },
        };
    } catch (error) {
        console.error("Competitor gap analysis error:", error);

        // Return basic comparison on error
        return {
            winningPoints: [],
            losingPoints: [],
            contentGaps: [],
            whyUsHooks: [
                "Focus on what makes your product unique",
                "Highlight areas where competitors are struggling",
            ],
            comparison: {
                myPainIndex: myAnalysis.metrics.painIndex,
                theirPainIndex: theirAnalysis.metrics.painIndex,
                myDemandVelocity: myAnalysis.metrics.demandVelocity,
                theirDemandVelocity: theirAnalysis.metrics.demandVelocity,
            },
        };
    }
}
