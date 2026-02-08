"use client";

// New Analysis Page - Input form for YouTube URL

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Youtube, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { StepLoader, ANALYSIS_STEPS } from "@/components/StepLoader";

export default function NewAnalysisPage() {
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState("");
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [stepProgress, setStepProgress] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsLoading(true);
        setError(null);
        setCurrentStep("fetching");
        setCompletedSteps([]);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Analysis failed");
            }

            const data = await response.json();

            // Simulate step progress for now (real streaming would be better)
            const steps = ["fetching", "filtering", "analyzing", "synthesizing"];
            for (let i = 0; i < steps.length; i++) {
                setCurrentStep(steps[i]);
                setStepProgress((i + 1) * 25);
                await new Promise(r => setTimeout(r, 500));
                setCompletedSteps(prev => [...prev, steps[i]]);
            }

            setCurrentStep("complete");
            setCompletedSteps(steps);

            // Navigate to results
            router.push(`/dashboard/${data.analysis.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setIsLoading(false);
            setCurrentStep("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <span className="font-semibold text-gray-900 dark:text-white">New Analysis</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {!isLoading ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4">
                                <Youtube className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Analyze a YouTube Video
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Paste a YouTube video URL to extract product intelligence from its comments
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="url"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    YouTube Video URL
                                </label>
                                <input
                                    type="text"
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-xl">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!url.trim()}
                                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25"
                            >
                                Start Analysis
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                What we&apos;ll extract:
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                    Bugs & Issues
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    Feature Requests
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Praise & Loyalty
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                                    Content Ideas
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Analyzing Video
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                This may take up to 30 seconds depending on comment volume
                            </p>
                        </div>

                        <StepLoader
                            steps={ANALYSIS_STEPS}
                            currentStep={currentStep}
                            completedSteps={completedSteps}
                            progress={stepProgress}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
