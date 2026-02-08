
import { auth } from "@/auth";
import { UserButton } from "@/components/UserButton";
import Link from "next/link";
import { BarChart3, Bot, LayoutDashboard, Plus } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Nexus
                        </span>
                    </div>

                    <nav className="space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/new"
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Analysis
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
                    {session?.user && <UserButton user={session.user} />}
                </div>
            </aside>

            {/* Mobile Header (TODO) */}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
