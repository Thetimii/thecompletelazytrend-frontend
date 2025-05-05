/**
 * Utility functions for formatting text in the application
 */

/**
 * Cleans up text by:
 * - Removing hashtags
 * - Adding proper spacing after punctuation
 * - Ensuring proper paragraph breaks
 * - Removing excessive whitespace
 *
 * @param {string} text - The text to clean
 * @returns {string} - The cleaned text
 */
export const cleanupText = (text) => {
  if (!text) return '';

  // Convert to string if it's not already
  const textStr = typeof text === 'string' ? text : String(text);

  // First, remove all hashtag patterns (including those with special characters)
  let cleanedText = textStr
    // Remove hashtags at the beginning of lines or after spaces
    .replace(/(^|\s)#[^\s]+/g, '$1')
    // Remove hashtags with special formatting like **#hashtag**
    .replace(/\*\*#[^*\s]+\*\*/g, '')
    // Remove hashtags with plus signs like #+hashtag
    .replace(/#\+[^\s]+/g, '')
    // Remove any remaining hashtags
    .replace(/#[^\s]+/g, '');

  // Now apply other formatting
  return cleanedText
    // Ensure space after period, comma, exclamation, question mark if followed by a letter
    .replace(/([.!?,;:])([A-Za-z])/g, '$1 $2')
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    // Replace multiple newlines with double newlines (for paragraphs)
    .replace(/\n{3,}/g, '\n\n')
    // Ensure proper spacing around list markers
    .replace(/(\d+\.)([^\s])/g, '$1 $2')
    // Remove any "+" markers that might be used with hashtags
    .replace(/\+\+/g, '')
    // Trim whitespace
    .trim();
};

/**
 * Formats content ideas by:
 * - Cleaning each idea with cleanupText
 * - Ensuring each idea starts with a capital letter
 * - Ensuring each idea ends with proper punctuation
 *
 * @param {Array|string} contentIdeas - Array of content ideas or JSON string
 * @returns {Array} - Array of formatted content ideas
 */
export const formatContentIdeas = (contentIdeas) => {
  if (!contentIdeas) return [];

  let ideas = [];

  // Parse JSON string if needed
  if (typeof contentIdeas === 'string') {
    try {
      ideas = JSON.parse(contentIdeas);
    } catch (e) {
      // If it's not valid JSON, split by newlines or return as a single item
      ideas = contentIdeas.includes('\n')
        ? contentIdeas.split('\n').filter(Boolean)
        : [contentIdeas];
    }
  } else if (Array.isArray(contentIdeas)) {
    ideas = contentIdeas;
  } else {
    ideas = [String(contentIdeas)];
  }

  // Clean up each idea
  return ideas.map(idea => {
    // Clean the text
    let cleanIdea = cleanupText(idea);

    // Additional cleanup for content ideas - remove any remaining hashtag patterns
    // This handles cases where hashtags might be in the middle of text or have special formatting
    cleanIdea = cleanIdea
      // Remove any remaining hashtag-like patterns (e.g., "**#hashtag**")
      .replace(/\*\*#[^*]+\*\*/g, '')
      // Remove any remaining hashtags with special characters
      .replace(/#[^\s.,!?]+/g, '')
      // Clean up any double spaces created by removals
      .replace(/\s+/g, ' ')
      .trim();

    // Ensure it starts with a capital letter
    cleanIdea = cleanIdea.charAt(0).toUpperCase() + cleanIdea.slice(1);

    // Ensure it ends with proper punctuation
    if (!/[.!?]$/.test(cleanIdea)) {
      cleanIdea += '.';
    }

    // Remove any empty bullet points or list markers left behind
    cleanIdea = cleanIdea
      .replace(/^[\d*+•-]+\.\s*$/g, '')
      .replace(/^[\d*+•-]+\.\s+$/g, '')
      .trim();

    // If the idea became empty after cleaning, return null so we can filter it out
    if (!cleanIdea || cleanIdea === '.') {
      return null;
    }

    return cleanIdea;
  }).filter(Boolean); // Filter out any null/empty ideas
};

/**
 * Formats a summary by:
 * - Cleaning the text
 * - Breaking it into proper paragraphs
 * - Ensuring proper formatting
 *
 * @param {string} summary - The summary text
 * @returns {string} - Formatted summary
 */
export const formatSummary = (summary) => {
  if (!summary) return '';

  // Convert to string if it's not already
  const summaryStr = typeof summary === 'string' ? summary : String(summary);

  try {
    // Check if it's a JSON string and parse it
    const parsed = JSON.parse(summaryStr);
    if (typeof parsed === 'object') {
      // If it's an object with a trendSummary or strategySummary property, use that
      if (parsed.trendSummary) {
        return cleanupText(parsed.trendSummary);
      } else if (parsed.strategySummary) {
        return cleanupText(parsed.strategySummary);
      } else {
        // Otherwise stringify it nicely
        return cleanupText(JSON.stringify(parsed, null, 2));
      }
    }
  } catch (e) {
    // Not JSON, continue with normal text processing
  }

  // Apply general text cleanup
  let cleanedSummary = cleanupText(summaryStr);

  // Additional cleanup for summaries - remove any remaining hashtag patterns
  cleanedSummary = cleanedSummary
    // Remove any remaining hashtag-like patterns (e.g., "**#hashtag**")
    .replace(/\*\*#[^*]+\*\*/g, '')
    // Remove any remaining hashtags with special characters
    .replace(/#[^\s.,!?]+/g, '')
    // Clean up any double spaces created by removals
    .replace(/\s+/g, ' ')
    .trim();

  return cleanedSummary;
};
