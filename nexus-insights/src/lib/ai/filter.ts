// Comment Sanitizer - Local regex-based filtering
// Runs BEFORE AI to save tokens and improve accuracy

const TRASH_PATTERNS = [
    // Spam patterns
    /check my channel/i,
    /check out my/i,
    /subscribe to my/i,
    /bitcoin/i,
    /crypto/i,
    /whatsapp/i,
    /telegram/i,
    /dm me/i,
    /\+\d{10,}/,  // Phone numbers

    // Bot-like patterns
    /^first[!.]*$/i,
    /^second[!.]*$/i,
    /^third[!.]*$/i,
    /^who['']?s here in \d{4}/i,
    /^anyone .*\d{4}\??$/i,

    // Too short to be useful
    /^.{1,5}$/,  // Less than 6 characters
    /^(nice|cool|great|good|wow|amazing|awesome|lol|lmao)[!.]*$/i,
    /^(love it|loved it|love this)[!.]*$/i,
    /^(hi|hello|hey)[!.]*$/i,

    // Giveaway/promotion spam
    /giveaway/i,
    /free iphone/i,
    /click the link/i,
    /link in bio/i,

    // Self-promotion
    /i made a video/i,
    /check my latest/i,
    /new video on my channel/i,
];

const EMOJI_ONLY_PATTERN = /^[\p{Emoji}\s]+$/u;

/**
 * Check if a comment is trash and should be filtered out
 */
export function isTrash(comment: string): boolean {
    const trimmed = comment.trim();

    // Empty or whitespace only
    if (!trimmed) return true;

    // Emoji-only comments
    if (EMOJI_ONLY_PATTERN.test(trimmed)) return true;

    // Check against trash patterns
    return TRASH_PATTERNS.some(pattern => pattern.test(trimmed));
}

/**
 * Clean a comment for AI processing
 * - Removes excessive emojis
 * - Normalizes whitespace
 * - Truncates very long comments
 */
export function cleanComment(comment: string): string {
    let cleaned = comment
        // Remove URLs
        .replace(/https?:\/\/[^\s]+/g, "[link]")
        // Normalize whitespace
        .replace(/\s+/g, " ")
        // Remove excessive repeated characters (e.g., "sooooo" -> "so")
        .replace(/(.)\1{4,}/g, "$1$1")
        // Trim
        .trim();

    // Truncate if too long (save tokens)
    if (cleaned.length > 500) {
        cleaned = cleaned.substring(0, 500) + "...";
    }

    return cleaned;
}

/**
 * Filter and clean a batch of comments
 * Returns only the useful comments, cleaned for AI processing
 */
export function filterComments<T extends { text: string }>(comments: T[]): {
    cleaned: T[];
    trashCount: number;
} {
    const cleaned: T[] = [];
    let trashCount = 0;

    for (const comment of comments) {
        if (isTrash(comment.text)) {
            trashCount++;
            continue;
        }

        cleaned.push({
            ...comment,
            text: cleanComment(comment.text),
        });
    }

    return { cleaned, trashCount };
}
