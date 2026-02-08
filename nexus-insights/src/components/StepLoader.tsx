"use client";

// Step Loader - Progressive loading UI during analysis
// Shows which stage of the pipeline is currently running

import { CheckCircle2, Loader2, Circle } from "lucide-react";

interface Step {
    id: string;
    label: string;
    description?: string;
}

interface StepLoaderProps {
    steps: Step[];
    currentStep: string;
    completedSteps: string[];
    progress?: number; // 0-100 for current step
}

export function StepLoader({
    steps,
    currentStep,
    completedSteps,
    progress = 0,
}: StepLoaderProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = step.id === currentStep;
                    const isPending = !isCompleted && !isCurrent;

                    return (
                        <div key={step.id} className="flex items-start gap-3">
                            {/* Step indicator */}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${isCompleted
                                            ? "bg-emerald-500 text-white"
                                            : isCurrent
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                        }
                  `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : isCurrent ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Circle className="w-5 h-5" />
                                    )}
                                </div>
                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                      w-0.5 h-6 mt-1
                      ${isCompleted
                                                ? "bg-emerald-500"
                                                : "bg-gray-200 dark:bg-gray-700"
                                            }
                    `}
                                    />
                                )}
                            </div>

                            {/* Step content */}
                            <div className="flex-1 min-w-0 pt-1">
                                <p
                                    className={`
                    font-medium text-sm
                    ${isCompleted
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : isCurrent
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-400 dark:text-gray-500"
                                        }
                  `}
                                >
                                    {step.label}
                                </p>
                                {step.description && isCurrent && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {step.description}
                                    </p>
                                )}
                                {/* Progress bar for current step */}
                                {isCurrent && progress > 0 && (
                                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Default steps for analysis pipeline
export const ANALYSIS_STEPS: Step[] = [
    { id: "fetching", label: "Fetching Comments", description: "Loading video data from YouTube..." },
    { id: "filtering", label: "Filtering Spam", description: "Removing noise and bot comments..." },
    { id: "analyzing", label: "AI Classification", description: "Categorizing comments with AI..." },
    { id: "synthesizing", label: "Generating Insights", description: "Creating strategic recommendations..." },
    { id: "complete", label: "Analysis Complete" },
];
