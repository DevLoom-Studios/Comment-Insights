// Mathematical Aggregator - NO AI, 100% accurate calculations
// Calculates the Four Core Indices from classified comments

import { CommentAnalysis, ThemeCluster } from "@/types/analysis";

export interface AggregatedMetrics {
    // The Four Core Indices (0-100)
    painIndex: number;
    demandVelocity: number;
    loyaltyDepth: number;
    confusionScore: number;

    // Extracted lists
    featureRequests: string[];
    bugReports: string[];
    contentIdeas: string[];

    // Theme clusters
    themes: ThemeCluster[];

    // Category counts
    counts: {
        bugs: number;
        features: number;
        complaints: number;
        praise: number;
        questions: number;
        noise: number;
        contentIdeas: number;
    };
}

/**
 * Group comments by topic and calculate theme clusters
 */
function calculateThemes(comments: CommentAnalysis[]): ThemeCluster[] {
    const topicMap = new Map<string, CommentAnalysis[]>();

    // Group by topic
    for (const comment of comments) {
        if (!comment.topic || comment.category === "NOISE") continue;

        const topic = comment.topic.toLowerCase();
        if (!topicMap.has(topic)) {
            topicMap.set(topic, []);
        }
        topicMap.get(topic)!.push(comment);
    }

    // Convert to theme clusters
    const themes: ThemeCluster[] = [];

    for (const [topic, topicComments] of topicMap) {
        if (topicComments.length < 2) continue; // Ignore single-comment topics

        // Calculate sentiment
        const positiveCount = topicComments.filter(c =>
            c.category === "PRAISE"
        ).length;
        const negativeCount = topicComments.filter(c =>
            ["BUG", "COMPLAINT"].includes(c.category)
        ).length;

        let sentiment: "POS" | "NEG" | "NEU";
        if (positiveCount > negativeCount * 1.5) {
            sentiment = "POS";
        } else if (negativeCount > positiveCount * 1.5) {
            sentiment = "NEG";
        } else {
            sentiment = "NEU";
        }

        // Average intensity
        const avgIntensity = topicComments.reduce((sum, c) => sum + c.intensity, 0) / topicComments.length;

        // Primary segment
        const segmentCounts = new Map<string, number>();
        for (const c of topicComments) {
            segmentCounts.set(c.segment, (segmentCounts.get(c.segment) || 0) + 1);
        }
        const primarySegment = [...segmentCounts.entries()]
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

        // Representative quotes (top 3 by likes)
        const representativeQuotes = topicComments
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 3)
            .map(c => c.text.substring(0, 150));

        themes.push({
            topic: topic.charAt(0).toUpperCase() + topic.slice(1),
            sentiment,
            intensity: Math.round(avgIntensity * 10) / 10,
            volume: topicComments.length,
            representativeQuotes,
            userSegment: primarySegment,
        });
    }

    // Sort by volume (most discussed first)
    return themes.sort((a, b) => b.volume - a.volume).slice(0, 10);
}

/**
 * Calculate all metrics from classified comments
 * This runs in code, NOT AI - 100% accurate
 */
export function aggregateMetrics(comments: CommentAnalysis[]): AggregatedMetrics {
    const total = comments.length || 1; // Avoid division by zero

    // Categorize comments
    const bugs = comments.filter(c => c.category === "BUG");
    const features = comments.filter(c => c.category === "FEATURE");
    const complaints = comments.filter(c => c.category === "COMPLAINT");
    const praise = comments.filter(c => c.category === "PRAISE");
    const questions = comments.filter(c => c.category === "QUESTION");
    const noise = comments.filter(c => c.category === "NOISE");
    const contentIdeasComments = comments.filter(c => c.category === "CONTENT_IDEA");

    // ==========================================================================
    // PAIN INDEX: (Count of Bugs + Complaints) × Average Intensity
    // Normalized to 0-100
    // ==========================================================================
    const painfulComments = [...bugs, ...complaints];
    const avgPainIntensity = painfulComments.length > 0
        ? painfulComments.reduce((sum, c) => sum + c.intensity, 0) / painfulComments.length
        : 0;
    const painIndex = Math.min(100, Math.round(
        (painfulComments.length / total) * avgPainIntensity * 15
    ));

    // ==========================================================================
    // DEMAND VELOCITY: (Count of Features) × Average Urgency
    // Normalized to 0-100
    // ==========================================================================
    const avgFeatureUrgency = features.length > 0
        ? features.reduce((sum, c) => sum + c.intensity, 0) / features.length
        : 0;
    const demandVelocity = Math.min(100, Math.round(
        (features.length / total) * avgFeatureUrgency * 15
    ));

    // ==========================================================================
    // LOYALTY DEPTH: Ratio of Defenders vs Detractors (among Pro users)
    // High score = strong brand advocacy
    // ==========================================================================
    const proUsers = comments.filter(c => c.segment === "Pro");
    const proDefenders = proUsers.filter(c => c.category === "PRAISE").length;
    const proDetractors = proUsers.filter(c =>
        ["BUG", "COMPLAINT"].includes(c.category)
    ).length;

    let loyaltyDepth: number;
    if (proUsers.length < 3) {
        // Not enough Pro users for meaningful calculation
        loyaltyDepth = 50; // Neutral
    } else {
        const loyaltyRatio = proDefenders / Math.max(1, proDetractors);
        loyaltyDepth = Math.min(100, Math.round(
            50 + (loyaltyRatio - 1) * 25 // 1:1 = 50, 2:1 = 75, 3:1 = 100
        ));
    }

    // ==========================================================================
    // CONFUSION SCORE: Percentage of "How do I...?" questions
    // High score = UX or explanation failure
    // ==========================================================================
    const confusionScore = Math.round((questions.length / total) * 100);

    // ==========================================================================
    // EXTRACT FEATURE REQUESTS AND BUG REPORTS
    // ==========================================================================
    const featureRequests = features
        .sort((a, b) => (b.intensity * b.likes) - (a.intensity * a.likes))
        .slice(0, 10)
        .map(c => c.topic || "General");

    const bugReports = bugs
        .sort((a, b) => (b.intensity * b.likes) - (a.intensity * a.likes))
        .slice(0, 10)
        .map(c => `${c.topic}: ${c.text.substring(0, 80)}...`);

    const contentIdeas = contentIdeasComments
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5)
        .map(c => c.text.substring(0, 200));

    // Calculate themes
    const themes = calculateThemes(comments);

    return {
        painIndex,
        demandVelocity,
        loyaltyDepth,
        confusionScore,
        featureRequests: [...new Set(featureRequests)], // Dedupe
        bugReports,
        contentIdeas,
        themes,
        counts: {
            bugs: bugs.length,
            features: features.length,
            complaints: complaints.length,
            praise: praise.length,
            questions: questions.length,
            noise: noise.length,
            contentIdeas: contentIdeasComments.length,
        },
    };
}
