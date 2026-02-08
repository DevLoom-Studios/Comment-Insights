
export default function DashboardLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
            <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-32">
                        <div className="h-4 w-24 bg-gray-100 dark:bg-gray-900 rounded mb-4"></div>
                        <div className="h-8 w-16 bg-gray-100 dark:bg-gray-900 rounded"></div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="h-12 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 px-6 flex items-center">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <div className="w-12 h-8 bg-gray-100 dark:bg-gray-900 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-900 rounded"></div>
                                <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-900 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
