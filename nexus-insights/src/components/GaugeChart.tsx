"use client";

import React, { useMemo } from "react";

// Gauge Chart Component - Visualizes metrics as radial progress
// Uses pure CSS for performance (no heavy chart libraries)

interface GaugeChartProps {
    value: number; // 0-100
    label: string;
    description?: string;
    size?: "sm" | "md" | "lg";
    inverted?: boolean; // If true, high = good (like loyalty)
}

const sizeClasses = {
    sm: { container: "w-24 h-24", text: "text-xl", label: "text-xs" },
    md: { container: "w-32 h-32", text: "text-2xl", label: "text-sm" },
    lg: { container: "w-40 h-40", text: "text-3xl", label: "text-base" },
};

function getColor(value: number, inverted: boolean): string {
    const normalizedValue = inverted ? 100 - value : value;
    if (normalizedValue < 30) return "stroke-emerald-500";
    if (normalizedValue < 60) return "stroke-amber-500";
    return "stroke-rose-500";
}

function getBackgroundColor(value: number, inverted: boolean): string {
    const normalizedValue = inverted ? 100 - value : value;
    if (normalizedValue < 30) return "bg-emerald-500/10";
    if (normalizedValue < 60) return "bg-amber-500/10";
    return "bg-rose-500/10";
}

function getTextColor(value: number, inverted: boolean): string {
    const normalizedValue = inverted ? 100 - value : value;
    if (normalizedValue < 30) return "text-emerald-500";
    if (normalizedValue < 60) return "text-amber-500";
    return "text-rose-500";
}

export function GaugeChart({
    value,
    label,
    description,
    size = "md",
    inverted = false,
}: GaugeChartProps) {
    const { clampedValue, circumference, strokeDashoffset } = useMemo(() => {
        const clamped = Math.min(100, Math.max(0, value));
        const circ = 2 * Math.PI * 45;
        const offset = circ - (clamped / 100) * circ;
        return { clampedValue: clamped, circumference: circ, strokeDashoffset: offset };
    }, [value]);

    const colorClass = getColor(clampedValue, inverted);
    const bgColorClass = getBackgroundColor(clampedValue, inverted);
    const textColorClass = getTextColor(clampedValue, inverted);
    const { container, text, label: labelSize } = sizeClasses[size];

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`${container} relative`}>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={`${colorClass} transition-all duration-700 ease-out`}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset,
                        }}
                    />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center rounded-full ${bgColorClass}`}>
                    <span className={`${text} font-bold ${textColorClass}`}>
                        {clampedValue}
                    </span>
                </div>
            </div>
            <div className="text-center">
                <p className={`${labelSize} font-semibold text-gray-900 dark:text-white`}>
                    {label}
                </p>
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[120px]">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
