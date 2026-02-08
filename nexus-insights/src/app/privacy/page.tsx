// Privacy Policy - Required for YouTube API compliance

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <span className="font-semibold text-gray-900 dark:text-white">Nexus Insights</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                        Last updated: February 2026
                    </p>

                    <div className="prose dark:prose-invert max-w-none">
                        <h2>1. Introduction</h2>
                        <p>
                            Nexus Insights (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, and safeguard your information when
                            you use our YouTube comment analysis service.
                        </p>

                        <h2>2. YouTube API Services</h2>
                        <p>
                            <strong>Important:</strong> Nexus Insights uses YouTube API Services. By using our
                            application, you are agreeing to be bound by the following:
                        </p>
                        <ul>
                            <li>
                                <a
                                    href="https://www.youtube.com/t/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    YouTube Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://policies.google.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Google Privacy Policy
                                </a>
                            </li>
                        </ul>

                        <h2>3. Information We Collect</h2>
                        <p>We collect the following types of information:</p>
                        <ul>
                            <li>
                                <strong>YouTube Data:</strong> When you analyze a video, we fetch publicly available
                                comments through the YouTube Data API v3. This includes comment text, author names,
                                like counts, and timestamps.
                            </li>
                            <li>
                                <strong>Account Information:</strong> If you create an account, we collect your email
                                address and any profile information you choose to provide.
                            </li>
                            <li>
                                <strong>Usage Data:</strong> We collect information about how you use our service,
                                including videos analyzed and features used.
                            </li>
                        </ul>

                        <h2>4. How We Use Your Information</h2>
                        <p>We use the collected information to:</p>
                        <ul>
                            <li>Provide our YouTube comment analysis service</li>
                            <li>Generate insights, metrics, and recommendations</li>
                            <li>Improve our AI models and service quality</li>
                            <li>Communicate with you about your account and our services</li>
                        </ul>

                        <h2>5. Data Retention</h2>
                        <p>
                            Analyzed comment data is cached for 24 hours to improve performance. After this period,
                            the data is refreshed upon new analysis requests. You can request deletion of your data
                            at any time.
                        </p>

                        <h2>6. Data Sharing</h2>
                        <p>
                            We do not sell, trade, or rent your personal information to third parties. We may share
                            anonymized, aggregated data for research or business purposes.
                        </p>

                        <h2>7. Revoking Access</h2>
                        <p>
                            You can revoke Nexus Insights&apos; access to your data through your{" "}
                            <a
                                href="https://security.google.com/settings/security/permissions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Google Security Settings
                            </a>.
                        </p>

                        <h2>8. Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your data, including
                            encryption in transit and at rest, secure authentication, and regular security audits.
                        </p>

                        <h2>9. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy or our data practices, please contact
                            us at privacy@nexusinsights.com.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
