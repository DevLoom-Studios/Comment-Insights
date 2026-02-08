// Strategic Reducer - AI synthesis using Llama 3 70B
// Generates executive summary and action plan from metrics

import { ChatGroq } from "@langchain/groq";
import { AggregatedMetrics } from "./aggregator";
import { ActionPlan } from "@/types/analysis";

const STRATEGIST_PROMPT = `ROLE:
You are a Chief Product Strategist advising a content creator or product manager.

CONTEXT:
You have analyzed customer feedback and calculated the following metrics:

Pain Index: {painIndex}/100 (High = customers are frustrated)
Demand Velocity: {demandVelocity}/100 (High = strong feature demand)
Loyalty Depth: {loyaltyDepth}/100 (High = strong brand advocates)
Confusion Score: {confusionScore}/100 (High = UX or communication failure)

Comment Breakdown:
- Bugs/Issues: {bugCount}
- Feature Requests: {featureCount}  
- Complaints: {complaintCount}
- Praise: {praiseCount}
- Questions: {questionCount}
- Content Ideas: {contentIdeaCount}

Top Themes Being Discussed:
{themes}

Most Requested Features:
{featureRequests}

Critical Bug Reports:
{bugReports}

Unique/Viral Comments (Content Ideas):
{contentIdeas}

TASK:
Generate a strategic response in valid JSON format with these fields:

1. "summary": A 2-3 sentence executive summary for a CEO/manager. Be specific about the situation.

2. "immediateFixes": Array of 3-5 specific, actionable fixes to address the most critical issues.
   Format: Short imperative sentences. Example: "Release a hotfix for the video sync bug affecting 40% of users."

3. "contentOpportunities": Array of 3-5 specific content ideas based on customer questions and viral comments.
   Format: Specific video/post ideas. Example: "Create a 60-second TikTok tutorial answering the top 3 setup questions."

4. "marketingHooks": Array of 3-5 copy-paste marketing phrases based on positive sentiment.
   Format: Quotable phrases. Example: "The only gear trusted by 10,000+ creators worldwide."

OUTPUT FORMAT:
Return ONLY valid JSON, no markdown. Example:
{"summary": "...", "immediateFixes": ["..."], "contentOpportunities": ["..."], "marketingHooks": ["..."]}`;

interface StrategicOutput {
    summary: string;
    actionPlan: ActionPlan;
}

/**
 * Generate strategic insights using Llama 3 70B
 */
export async function synthesizeStrategy(
    metrics: AggregatedMetrics
): Promise<StrategicOutput> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY not configured");

    const model = new ChatGroq({
        apiKey,
        model: "llama-3.3-70b-versatile", // Premium model for strategic synthesis
        temperature: 0.3, // Slightly creative but consistent
    });

    // Format themes for prompt
    const themesText = metrics.themes.slice(0, 5).map(t =>
        `- ${t.topic}: ${t.sentiment} sentiment, ${t.volume} comments, avg intensity ${t.intensity}/10`
    ).join("\n") || "No clear themes identified";

    // Format feature requests
    const featuresText = metrics.featureRequests.slice(0, 5).join(", ") || "None identified";

    // Format bug reports
    const bugsText = metrics.bugReports.slice(0, 5).join("\n- ") || "None identified";

    // Format content ideas
    const contentText = metrics.contentIdeas.slice(0, 3).join("\n- ") || "None identified";

    const prompt = STRATEGIST_PROMPT
        .replace("{painIndex}", metrics.painIndex.toString())
        .replace("{demandVelocity}", metrics.demandVelocity.toString())
        .replace("{loyaltyDepth}", metrics.loyaltyDepth.toString())
        .replace("{confusionScore}", metrics.confusionScore.toString())
        .replace("{bugCount}", metrics.counts.bugs.toString())
        .replace("{featureCount}", metrics.counts.features.toString())
        .replace("{complaintCount}", metrics.counts.complaints.toString())
        .replace("{praiseCount}", metrics.counts.praise.toString())
        .replace("{questionCount}", metrics.counts.questions.toString())
        .replace("{contentIdeaCount}", metrics.counts.contentIdeas.toString())
        .replace("{themes}", themesText)
        .replace("{featureRequests}", featuresText)
        .replace("{bugReports}", bugsText)
        .replace("{contentIdeas}", contentText);

    try {
        const response = await model.invoke(prompt);
        const content = typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content);

        // Parse JSON response
        const parsed = JSON.parse(content.trim());

        return {
            summary: parsed.summary || "Analysis complete. Review metrics for details.",
            actionPlan: {
                immediateFixes: parsed.immediateFixes || [],
                contentOpportunities: parsed.contentOpportunities || [],
                marketingHooks: parsed.marketingHooks || [],
            },
        };
    } catch (error) {
        console.error("Strategy synthesis error:", error);

        // Return a basic fallback
        return {
            summary: `Analysis of ${metrics.counts.bugs + metrics.counts.features + metrics.counts.praise} comments complete. Pain Index: ${metrics.painIndex}/100, Demand Velocity: ${metrics.demandVelocity}/100.`,
            actionPlan: {
                immediateFixes: metrics.bugReports.slice(0, 3).map(b => `Address: ${b}`),
                contentOpportunities: metrics.featureRequests.slice(0, 3).map(f => `Create content about: ${f}`),
                marketingHooks: ["Trusted by our community", "Built on user feedback"],
            },
        };
    }
}
