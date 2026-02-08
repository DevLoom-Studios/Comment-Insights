// AI Mapper - Batch comment categorization using Groq
// Processes 20 comments at a time for optimal accuracy

import { ChatGroq } from "@langchain/groq";
import { CommentAnalysis, CommentCategory, UserSegment } from "@/types/analysis";

const MAPPER_PROMPT = `ROLE:
You are an Advanced Product Data Analyst. You do not summarize; you extract structured data points.

TASK:
Analyze the following user comments. For EACH comment, output a JSON object with these specific metrics:

1. "id": The comment ID (pass through from input)
2. "category": Choose ONE from [BUG, FEATURE, PRAISE, COMPLAINT, QUESTION, NOISE, CONTENT_IDEA].
   - BUG: Reports crashes, errors, broken features
   - FEATURE: Requests new functionality or improvements
   - PRAISE: Positive feedback, compliments
   - COMPLAINT: Negative feedback (not bugs, more about experience)
   - QUESTION: Asks "how to" or seeks clarification
   - NOISE: Generic comments with no product insight
   - CONTENT_IDEA: Unique, creative, or viral-worthy comments that could inspire content (funny takes, unexpected use cases, quotable statements)

3. "topic": 1-2 words identifying the subject (e.g., "Battery", "Pricing", "UI", "Shipping")

4. "intensity": Score 1-10.
   - For BUG/COMPLAINT: 1 (Minor annoyance) to 10 (Product-breaking/Returning)
   - For FEATURE: 1 (Nice to have) to 10 (Dealbreaker/Need now)
   - For PRAISE: 1 (Mild approval) to 10 (Life-changing endorsement)
   - For QUESTION: 1 (Simple) to 10 (Critical confusion)
   - For CONTENT_IDEA: 1 (Mildly interesting) to 10 (Viral potential)

5. "segment": Infer the user type [Pro, Beginner, Switcher, Unknown].
   - Pro: Uses technical jargon, advanced features
   - Beginner: Asks basic questions, new user vibes
   - Switcher: Mentions competitor products ("coming from X", "better than Y")
   - Unknown: Cannot determine

6. "sarcasm": Boolean. TRUE if comment contains high-praise words (great, amazing, thanks) alongside negative outcomes (crash, broken, fail). If sarcasm=true, the category should reflect the TRUE sentiment (usually COMPLAINT).

INPUT COMMENTS:
{comments}

OUTPUT FORMAT:
Return ONLY a valid JSON Array of objects matching the input comments. No markdown, no explanation.
Example: [{"id": "abc123", "category": "BUG", "topic": "Audio", "intensity": 8, "segment": "Pro", "sarcasm": false}]`;

interface RawComment {
    id: string;
    text: string;
    author: string;
    authorImage?: string;
    likes: number;
    publishedAt?: string;
}

/**
 * Split array into chunks of specified size
 */
function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

/**
 * Process a batch of comments through the AI mapper
 */
async function processBatch(
    model: ChatGroq,
    batch: RawComment[]
): Promise<CommentAnalysis[]> {
    const commentsForPrompt = batch.map((c) => ({
        id: c.id,
        text: c.text,
        likes: c.likes,
    }));

    const prompt = MAPPER_PROMPT.replace(
        "{comments}",
        JSON.stringify(commentsForPrompt, null, 2)
    );

    try {
        const response = await model.invoke(prompt);
        const content = typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content);

        // Parse the JSON response
        const parsed = JSON.parse(content.trim());

        if (!Array.isArray(parsed)) {
            console.error("Mapper returned non-array:", content);
            return [];
        }

        // Merge AI results with original comment data
        return parsed.map((result: {
            id: string;
            category: CommentCategory;
            topic: string;
            intensity: number;
            segment: UserSegment;
            sarcasm: boolean
        }) => {
            const original = batch.find((c) => c.id === result.id);
            if (!original) return null;

            return {
                youtubeId: result.id,
                text: original.text,
                author: original.author,
                authorImage: original.authorImage,
                likes: original.likes,
                publishedAt: original.publishedAt ? new Date(original.publishedAt) : undefined,
                category: result.category as CommentCategory,
                topic: result.topic || "General",
                intensity: Math.min(10, Math.max(1, result.intensity || 5)),
                segment: result.segment as UserSegment,
                sarcasm: result.sarcasm || false,
            };
        }).filter(Boolean) as CommentAnalysis[];
    } catch (error) {
        console.error("Batch processing error:", error);
        // Return empty results for failed batch
        return [];
    }
}

/**
 * Map all comments through AI categorization
 * Processes in batches of 20 for optimal accuracy
 */
export async function mapComments(
    comments: RawComment[],
    onProgress?: (processed: number, total: number) => void
): Promise<CommentAnalysis[]> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY not configured");

    const model = new ChatGroq({
        apiKey,
        model: "llama-3.1-8b-instant", // Fast model for batch tagging
        temperature: 0, // Deterministic for consistency
    });

    const batches = chunkArray(comments, 20);
    const results: CommentAnalysis[] = [];
    let processed = 0;

    for (const batch of batches) {
        const batchResults = await processBatch(model, batch);
        results.push(...batchResults);

        processed += batch.length;
        onProgress?.(processed, comments.length);

        // Small delay between batches to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
}
