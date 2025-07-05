/**
 * Text formatting utilities for the dashboard and other components
 */

/**
 * Formats dashboard summary text for display
 * @param {string} summary - The raw summary text
 * @returns {string} - Formatted summary text
 */
export const formatDashboardSummary = (summary) => {
  if (!summary) {
    return 'No summary available yet. Complete a trend analysis to see insights here.';
  }

  // If it's already a string, clean it up
  if (typeof summary === 'string') {
    return summary
      .trim()
      .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
      .replace(/^\s+|\s+$/gm, '') // Remove leading/trailing whitespace from lines
      .slice(0, 500) // Limit to 500 characters for dashboard display
      + (summary.length > 500 ? '...' : '');
  }

  // If it's an object, try to extract meaningful text
  if (typeof summary === 'object') {
    let text = '';
    
    // Check common summary object properties
    if (summary.summary) {
      text = summary.summary;
    } else if (summary.content) {
      text = summary.content;
    } else if (summary.text) {
      text = summary.text;
    } else if (summary.message) {
      text = summary.message;
    } else {
      // If it's an object without expected properties, stringify it
      text = JSON.stringify(summary, null, 2);
    }

    return formatDashboardSummary(text); // Recursively format as string
  }

  // Fallback for other data types
  return String(summary).slice(0, 500) + (String(summary).length > 500 ? '...' : '');
};

/**
 * Formats text for display in cards or components
 * @param {string} text - The raw text
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Formatted text
 */
export const formatCardText = (text, maxLength = 200) => {
  if (!text) return '';
  
  return text.length > maxLength 
    ? text.slice(0, maxLength).trim() + '...'
    : text;
};

/**
 * Capitalizes the first letter of each word
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Formats a date string for display
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};
