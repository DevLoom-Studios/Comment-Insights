"use client";

// Battle Card Component - Competitor comparison visualization
// Shows winning/losing points and marketing hooks

import { ArrowUp, ArrowDown, Minus, Lightbulb, Target } from "lucide-react";

interface GapPoint {
    topic: string;
    ourSentiment: "POS" | "NEG" | "NEU";
    theirSentiment: "POS" | "NEG" | "NEU";
    insight: string;
}

interface ContentGap {
    question: string;
    frequency: number;
    source: "ours" | "theirs" | "both";
}

interface BattleCardProps {
    myTitle: string;
    theirTitle: string;
    myMetrics: { painIndex: number; demandVelocity: number };
    theirMetrics: { painIndex: number; demandVelocity: number };
    winningPoints: GapPoint[];
    losingPoints: GapPoint[];
    contentGaps: ContentGap[];
    whyUsHooks: string[];
}

function SentimentBadge({ sentiment }: { sentiment: "POS" | "NEG" | "NEU" }) {
    const config = {
        POS: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", label: "Positive" },
        NEG: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400", label: "Negative" },
        NEU: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", label: "Neutral" },
    };
    const { bg, text, label } = config[sentiment];

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
            {label}
        </span>
    );
}

function MetricComparison({
    label,
    myValue,
    theirValue,
    invertedBetter,
}: {
    label: string;
    myValue: number;
    theirValue: number;
    invertedBetter?: boolean;
}) {
    const diff = myValue - theirValue;
    const isBetter = invertedBetter ? diff < 0 : diff > 0;
    const isWorse = invertedBetter ? diff > 0 : diff < 0;

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{myValue}</span>
                <span className="text-gray-400">vs</span>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{theirValue}</span>
                {isBetter && <ArrowUp className="w-5 h-5 text-emerald-500" />}
                {isWorse && <ArrowDown className="w-5 h-5 text-rose-500" />}
                {!isBetter && !isWorse && <Minus className="w-5 h-5 text-gray-400" />}
            </div>
        </div>
    );
}

export function BattleCard({
    myTitle,
    theirTitle,
    myMetrics,
    theirMetrics,
    winningPoints,
    losingPoints,
    contentGaps,
    whyUsHooks,
}: BattleCardProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-xl">
                <div className="text-center">
                    <div className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold mb-1">
                        Your Video
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white truncate">{myTitle}</p>
                </div>
                <div className="text-center">
                    <div className="text-xs uppercase tracking-wide text-orange-600 dark:text-orange-400 font-semibold mb-1">
                        Competitor
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white truncate">{theirTitle}</p>
                </div>
            </div>

            {/* Metrics Comparison */}
            <div className="space-y-2">
                <MetricComparison
                    label="Pain Index"
                    myValue={myMetrics.painIndex}
                    theirValue={theirMetrics.painIndex}
                    invertedBetter
                />
                <MetricComparison
                    label="Demand Velocity"
                    myValue={myMetrics.demandVelocity}
                    theirValue={theirMetrics.demandVelocity}
                />
            </div>

            {/* Winning Points */}
            {winningPoints.length > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                    <h3 className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold mb-3">
                        <ArrowUp className="w-5 h-5" />
                        Where You Win
                    </h3>
                    <div className="space-y-3">
                        {winningPoints.map((point, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 dark:text-white">{point.topic}</span>
                                    <div className="flex items-center gap-2">
                                        <SentimentBadge sentiment={point.ourSentiment} />
                                        <span className="text-gray-400">→</span>
                                        <SentimentBadge sentiment={point.theirSentiment} />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{point.insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Losing Points */}
            {losingPoints.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4">
                    <h3 className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold mb-3">
                        <ArrowDown className="w-5 h-5" />
                        Where They Win
                    </h3>
                    <div className="space-y-3">
                        {losingPoints.map((point, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 dark:text-white">{point.topic}</span>
                                    <div className="flex items-center gap-2">
                                        <SentimentBadge sentiment={point.ourSentiment} />
                                        <span className="text-gray-400">→</span>
                                        <SentimentBadge sentiment={point.theirSentiment} />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{point.insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Gaps */}
            {contentGaps.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                    <h3 className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold mb-3">
                        <Lightbulb className="w-5 h-5" />
                        Content Opportunities
                    </h3>
                    <div className="space-y-2">
                        {contentGaps.map((gap, i) => (
                            <div key={i} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{gap.question}</span>
                                <span className="text-xs text-gray-500">
                                    {gap.frequency}x • {gap.source === "both" ? "Both" : gap.source === "ours" ? "Your viewers" : "Their viewers"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Marketing Hooks */}
            {whyUsHooks.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                    <h3 className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-semibold mb-3">
                        <Target className="w-5 h-5" />
                        &quot;Why Us&quot; Marketing Hooks
                    </h3>
                    <div className="space-y-2">
                        {whyUsHooks.map((hook, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">&quot;{hook}&quot;</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
