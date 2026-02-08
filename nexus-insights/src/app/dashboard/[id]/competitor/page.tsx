
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Swords, Target, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CompetitorComparisonPage({ params }: Props) {
    const session = await auth();
    const { id } = await params;

    const myAnalysis = await prisma.videoAnalysis.findUnique({
        where: { id },
    });

    if (!myAnalysis) notFound();

    // Check if there's already a comparison
    const existingGap = await prisma.competitorGap.findFirst({
        where: {
            userId: session?.user?.id,
            myVideoId: myAnalysis.youtubeId
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link
                    href={`/dashboard/${id}`}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Analysis
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                    <Swords className="w-4 h-4" />
                    Competitor Intelligence
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* My Video Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                        <span className="px-2 py-1 bg-indigo-600 text-[10px] font-bold text-white rounded uppercase tracking-wider">Your Video</span>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <img src={myAnalysis.thumbnail} className="w-24 h-14 object-cover rounded-lg" alt="" />
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate">{myAnalysis.title}</h3>
                            <p className="text-sm text-gray-500">{myAnalysis.channelTitle}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Pain Index</p>
                            <p className="text-xl font-bold text-indigo-600">{myAnalysis.painIndex}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Loyalty</p>
                            <p className="text-xl font-bold text-green-600">{myAnalysis.loyaltyDepth}%</p>
                        </div>
                    </div>
                </div>

                {/* Input for Competitor */}
                {!existingGap ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Target className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Select Competitor Video</h3>
                            <p className="text-sm text-gray-500 max-w-[250px]">Paste the URL of the video you want to benchmark against.</p>
                        </div>
                        <form action="/api/compare" method="POST" className="w-full max-w-sm space-y-3">
                            <input type="hidden" name="myAnalysisId" value={myAnalysis.id} />
                            <input
                                type="url"
                                name="competitorUrl"
                                placeholder="https://youtube.com/watch?v=..."
                                required
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                            <button className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-[1.02] transition-all">
                                Start Comparison
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2">
                            <span className="px-2 py-1 bg-red-600 text-[10px] font-bold text-white rounded uppercase tracking-wider">Competitor</span>
                        </div>
                        {/* Summary of existing comparison video would go here, for now let's just allow a new one or show the previous id */}
                        <div className="flex items-center justify-center h-full flex-col space-y-2">
                            <TrendingUp className="w-8 h-8 text-red-500" />
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Comparison Analysis Ready</p>
                            <button className="text-xs text-indigo-600 underline">Run new comparison</button>
                        </div>
                    </div>
                )}
            </div>

            {existingGap && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Battle Card Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Winning Points (What we do better) */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-green-100 dark:border-green-900/30 overflow-hidden">
                            <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-green-600" />
                                <h3 className="font-bold text-green-900 dark:text-green-400">Winning Advantages</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {(existingGap.winningPoints as any[]).map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-[10px] font-bold text-green-600 shrink-0 mt-0.5">{i + 1}</div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.topic}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{item.insight}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Losing Points (What they do better) */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden">
                            <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <h3 className="font-bold text-red-900 dark:text-red-400">Vulnerabilities</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {(existingGap.losingPoints as any[]).map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-[10px] font-bold text-red-600 shrink-0 mt-0.5">{i + 1}</div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.topic}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{item.insight}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Gaps / Hooks */}
                    <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <Target className="w-8 h-8 text-indigo-400" />
                                <h2 className="text-2xl font-bold">Marketing & Product Strategy</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h4 className="text-indigo-300 font-bold uppercase tracking-wider text-xs">Unanswered Content Gaps</h4>
                                    <ul className="space-y-3">
                                        {(existingGap.contentGaps as any[]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-indigo-100 italic">
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0 mt-1.5" />
                                                &quot;{item.question || item}&quot;
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-indigo-300 font-bold uppercase tracking-wider text-xs">High-Converting Hooks</h4>
                                    <div className="space-y-3">
                                        {(existingGap.whyUsHooks as string[]).map((hook, i) => (
                                            <div key={i} className="p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm text-sm">
                                                {hook}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 blur-[120px] rounded-full opacity-20 -mr-32 -mt-32" />
                    </div>
                </div>
            )}
        </div>
    );
}
