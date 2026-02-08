// Analysis Detail Page - Full report view

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, ExternalLink, MessageSquare, Lightbulb, Bug, Star, HelpCircle, Zap, Swords } from "lucide-react";
import prisma from "@/lib/db";
import { GaugeChart } from "@/components/GaugeChart";
import { ThemeCluster, ActionPlan } from "@/types/analysis";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ id: string }>;
}

async function getAnalysis(id: string) {
    try {
        const analysis = await prisma.videoAnalysis.findUnique({
            where: { id },
        });
        return analysis;
    } catch {
        return null;
    }
}

export default async function AnalysisPage({ params }: Props) {
    const { id } = await params;
    const analysis = await getAnalysis(id);

    if (!analysis) {
        notFound();
    }

    const themes = analysis.themes as unknown as ThemeCluster[];
    const actionPlan = analysis.actionPlan as unknown as ActionPlan;
    const featureRequests = analysis.featureRequests as unknown as string[];
    const bugReports = analysis.bugReports as unknown as string[];
    const contentIdeas = analysis.contentIdeas as unknown as string[];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="max-w-7xl mx-auto py-8">

                {/* Video Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex items-start gap-6">
                        <img
                            src={analysis.thumbnail}
                            alt={analysis.title}
                            className="w-48 h-28 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {analysis.title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {analysis.channelTitle}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    {analysis.totalComments} comments analyzed
                                </span>
                                <span>•</span>
                                <span>
                                    Analyzed {new Date(analysis.cachedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/dashboard/${analysis.id}/competitor`}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                            >
                                <Swords className="w-4 h-4" />
                                Compare
                            </Link>
                            <Link
                                href={`https://youtube.com/watch?v=${analysis.youtubeId}`}
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Watch
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Executive Summary
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                {analysis.summary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 flex justify-center">
                        <GaugeChart
                            value={analysis.painIndex}
                            label="Pain Index"
                            description="Bugs ×Severity"
                            size="md"
                        />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 flex justify-center">
                        <GaugeChart
                            value={analysis.demandVelocity}
                            label="Demand Velocity"
                            description="Features × Urgency"
                            size="md"
                        />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 flex justify-center">
                        <GaugeChart
                            value={analysis.loyaltyDepth}
                            label="Loyalty Depth"
                            description="Defenders vs Detractors"
                            size="md"
                            inverted
                        />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 flex justify-center">
                        <GaugeChart
                            value={analysis.confusionScore}
                            label="Confusion Score"
                            description="% of questions"
                            size="md"
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Themes */}
                        {themes && themes.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Top Themes
                                </h2>
                                <div className="space-y-4">
                                    {themes.slice(0, 5).map((theme, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full ${theme.sentiment === "POS" ? "bg-emerald-500" :
                                                    theme.sentiment === "NEG" ? "bg-rose-500" : "bg-gray-400"
                                                    }`} />
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {theme.topic}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{theme.volume} comments</span>
                                                <span>•</span>
                                                <span>Intensity {theme.intensity}/10</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Feature Requests */}
                        {featureRequests && featureRequests.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Top Feature Requests
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {featureRequests.map((feature, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bug Reports */}
                        {bugReports && bugReports.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Bug className="w-5 h-5 text-rose-500" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Critical Issues
                                    </h2>
                                </div>
                                <div className="space-y-2">
                                    {bugReports.slice(0, 5).map((bug, i) => (
                                        <div
                                            key={i}
                                            className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-sm text-rose-700 dark:text-rose-300"
                                        >
                                            {bug}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Action Plan */}
                        {actionPlan && (
                            <>
                                {actionPlan.immediateFixes && actionPlan.immediateFixes.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Star className="w-5 h-5 text-amber-500" />
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Immediate Fixes
                                            </h2>
                                        </div>
                                        <ul className="space-y-3">
                                            {actionPlan.immediateFixes.map((fix, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-gray-700 dark:text-gray-300">{fix}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {actionPlan.contentOpportunities && actionPlan.contentOpportunities.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Lightbulb className="w-5 h-5 text-purple-500" />
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Content Opportunities
                                            </h2>
                                        </div>
                                        <ul className="space-y-3">
                                            {actionPlan.contentOpportunities.map((content, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-gray-700 dark:text-gray-300">{content}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {actionPlan.marketingHooks && actionPlan.marketingHooks.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <HelpCircle className="w-5 h-5 text-emerald-500" />
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Marketing Hooks
                                            </h2>
                                        </div>
                                        <div className="space-y-2">
                                            {actionPlan.marketingHooks.map((hook, i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm text-emerald-700 dark:text-emerald-300 italic"
                                                >
                                                    &quot;{hook}&quot;
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Content Ideas */}
                        {contentIdeas && contentIdeas.length > 0 && (
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-pink-500" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Viral Content Ideas
                                    </h2>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    Unique comments that could inspire content
                                </p>
                                <div className="space-y-3">
                                    {contentIdeas.map((idea, i) => (
                                        <div
                                            key={i}
                                            className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            &quot;{idea}&quot;
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
