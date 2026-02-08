// Nexus Insights - Core Type Definitions

// =============================================================================
// COMMENT CLASSIFICATION
// =============================================================================

export type CommentCategory = 
  | "BUG" 
  | "FEATURE" 
  | "PRAISE" 
  | "COMPLAINT" 
  | "QUESTION" 
  | "NOISE" 
  | "CONTENT_IDEA"; // Unique/viral comments that could become content

export type UserSegment = "Pro" | "Beginner" | "Switcher" | "Unknown";

export interface CommentAnalysis {
  youtubeId: string;
  text: string;
  author: string;
  authorImage?: string;
  likes: number;
  publishedAt?: Date;
  
  // AI Classification
  category: CommentCategory;
  topic: string;
  intensity: number; // 1-10
  segment: UserSegment;
  sarcasm: boolean;
}

// =============================================================================
// YOUTUBE API
// =============================================================================

export interface YouTubeComment {
  id: string;
  text: string;
  author: string;
  authorImage: string;
  likes: number;
  publishedAt: string;
}

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  commentCount: number;
}

// =============================================================================
// ANALYSIS RESULTS
// =============================================================================

export interface ThemeCluster {
  topic: string;
  sentiment: "POS" | "NEG" | "NEU";
  intensity: number; // 1-10 average
  volume: number; // Count of comments
  representativeQuotes: string[];
  userSegment: string; // Primary segment for this theme
}

export interface ActionPlan {
  immediateFixes: string[];
  contentOpportunities: string[];
  marketingHooks: string[];
}

export interface DeepAnalysisResult {
  // The Four Core Indices (0-100)
  metrics: {
    painIndex: number;
    demandVelocity: number;
    loyaltyDepth: number;
    confusionScore: number;
  };
  
  // Theme Clusters
  themes: ThemeCluster[];
  
  // Extracted data
  featureRequests: string[];
  bugReports: string[];
  contentIdeas: string[]; // Unique comments that could become content
  
  // Strategic output
  summary: string;
  actionPlan: ActionPlan;
  
  // Stats
  stats: {
    totalFetched: number;
    totalAnalyzed: number;
    trashCount: number;
  };
}

// =============================================================================
// COMPETITOR GAP ANALYSIS
// =============================================================================

export interface CompetitorGapResult {
  // What we do better
  winningPoints: {
    topic: string;
    ourSentiment: "POS" | "NEG" | "NEU";
    theirSentiment: "POS" | "NEG" | "NEU";
    insight: string;
  }[];
  
  // What they do better
  losingPoints: {
    topic: string;
    ourSentiment: "POS" | "NEG" | "NEU";
    theirSentiment: "POS" | "NEG" | "NEU";
    insight: string;
  }[];
  
  // Unanswered questions / opportunities
  contentGaps: {
    question: string;
    frequency: number;
    source: "ours" | "theirs" | "both";
  }[];
  
  // Marketing hooks
  whyUsHooks: string[];
  
  // Snapshot comparison
  comparison: {
    myPainIndex: number;
    theirPainIndex: number;
    myDemandVelocity: number;
    theirDemandVelocity: number;
  };
}

// =============================================================================
// API RESPONSES
// =============================================================================

export interface AnalyzeRequest {
  url: string;
  forceRefresh?: boolean;
}

export interface CompareRequest {
  myUrl: string;
  theirUrl: string;
}

export interface AnalysisProgress {
  step: "fetching" | "filtering" | "analyzing" | "synthesizing" | "complete";
  message: string;
  progress: number; // 0-100
}
