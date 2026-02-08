
export default function AnalysisLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse py-8">
            {/* Video Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-6">
                    <div className="w-48 h-28 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                    <div className="flex-1 space-y-4">
                        <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        <div className="flex gap-4">
                            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Skeleton */}
            <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>

            {/* Metrics Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-48 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-700"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
