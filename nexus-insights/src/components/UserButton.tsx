
"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

interface UserButtonProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function UserButton({ user }: UserButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors w-full"
            >
                {user.image ? (
                    <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <User className="w-4 h-4" />
                    </div>
                )}
                <div className="flex-1 text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                        {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                        {user.email}
                    </p>
                </div>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-2 w-full min-w-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-20">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
