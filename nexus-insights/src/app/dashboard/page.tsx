// Dashboard Home - List of past analyses

import Link from "next/link";
import { Plus, Sparkles, BarChart3, Clock, Youtube } from "lucide-react";
import prisma from "@/lib/db";
import { VideoAnalysis } from "@prisma/client";

export const dynamic = "force-dynamic";

async function getAnalyses(): Promise<VideoAnalysis[]> {
    try {
        const analyses = await prisma.videoAnalysis.findMany({
            orderBy: { cachedAt: "desc" },
            take: 20,
        });
        return analyses as VideoAnalysis[];
    } catch {
        // Database not connected yet
        return [];
    }
}

export default async function DashboardPage() {
    const analyses = await getAnalyses();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Nexus Insights
                            </span>
                        </Link>
                        <Link
                            href="/dashboard/new"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-4 h-4" />
                            New Analysis
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Your Analyses
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and manage your YouTube video analyses
                    </p>
                </div>

                {analyses.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                            <Youtube className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No analyses yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start by analyzing your first YouTube video to extract product intelligence
                        </p>
                        <Link
                            href="/dashboard/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-5 h-5" />
                            Analyze Your First Video
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {analyses.map((analysis: VideoAnalysis) => (
                            <Link
                                key={analysis.id}
                                href={`/dashboard/${analysis.id}`}
                                className="card-hover bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
                            >
                                {/* Thumbnail */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={analysis.thumbnail}
                                        alt={analysis.title}
                                        className="w-32 h-20 object-cover rounded-lg"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                                        {analysis.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {analysis.channelTitle}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <BarChart3 className="w-3 h-3" />
                                            Pain: {analysis.painIndex}/100
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(analysis.cachedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Metrics Preview */}
                                <div className="flex-shrink-0 flex items-center gap-3">
                                    <div className="text-center">
                                        <div className={`text-lg font-bold ${analysis.painIndex > 60 ? "text-rose-500" :
                                            analysis.painIndex > 30 ? "text-amber-500" : "text-emerald-500"
                                            }`}>
                                            {analysis.painIndex}
                                        </div>
                                        <div className="text-xs text-gray-500">Pain</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-blue-500">
                                            {analysis.demandVelocity}
                                        </div>
                                        <div className="text-xs text-gray-500">Demand</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
