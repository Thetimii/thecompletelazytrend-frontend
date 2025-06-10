import React from 'react';

/**
 * Utility functions for formatting text in the application
 */

/**
 * Cleans up text by:
 * - Removing hashtags
 * - Adding proper spacing after punctuation
 * - Ensuring proper paragraph breaks
 * - Removing excessive whitespace
 * - Removing formatting artifacts
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
    // Remove escaped quotes and newlines first
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\\\\/g, '\\')
    // Remove triple dashes
    .replace(/---/g, '')
    // Remove section markers like "### 4."
    .replace(/###\s*\d+\./g, '')
    // Remove numbered section markers like "4."
    .replace(/^\d+\.\s*/gm, '')
    // Remove markdown headers
    .replace(/^#+\s*/gm, '')
    // Remove bold markers
    .replace(/\*\*/g, '')
    // Remove leading asterisks and dashes
    .replace(/^\*\s*/gm, '')
    .replace(/^-\s*/gm, '')
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

    // Additional cleanup for content ideas - remove any remaining formatting artifacts
    cleanIdea = cleanIdea
      // Remove any remaining hashtag-like patterns (e.g., "**#hashtag**")
      .replace(/\*\*#[^*]+\*\*/g, '')
      // Remove any remaining hashtags with special characters
      .replace(/#[^\s.,!?]+/g, '')
      // Remove section markers and numbered lists
      .replace(/^\d+\.\s*/g, '')
      .replace(/###\s*\d+\./g, '')
      // Remove markdown formatting
      .replace(/\*\*/g, '')
      .replace(/^#+\s*/g, '')
      // Remove dashes and asterisks
      .replace(/^[-*]\s*/g, '')
      .replace(/---/g, '')
      // Clean up any double spaces created by removals
      .replace(/\s+/g, ' ')
      .trim();

    // Ensure it starts with a capital letter
    if (cleanIdea.length > 0) {
      cleanIdea = cleanIdea.charAt(0).toUpperCase() + cleanIdea.slice(1);
    }

    // Ensure it ends with proper punctuation
    if (cleanIdea.length > 0 && !/[.!?]$/.test(cleanIdea)) {
      cleanIdea += '.';
    }

    // Remove any empty bullet points or list markers left behind
    cleanIdea = cleanIdea
      .replace(/^[\d*+•-]+\.\s*$/g, '')
      .replace(/^[\d*+•-]+\.\s+$/g, '')
      .trim();

    // If the idea became empty after cleaning, return null so we can filter it out
    if (!cleanIdea || cleanIdea === '.' || cleanIdea.length < 3) {
      return null;
    }

    return cleanIdea;
  }).filter(Boolean); // Filter out any null/empty ideas
};

/**
 * Formats a summary specifically for dashboard preview by:
 * - Extracting the most relevant summary content
 * - Cleaning up formatting artifacts
 * - Providing fallback text
 *
 * @param {string} summary - The summary text (may be JSON)
 * @returns {string} - Formatted summary for dashboard preview
 */
export const formatDashboardSummary = (summary) => {
  if (!summary) return 'No trend summary available';

  // Convert to string if it's not already
  const summaryStr = typeof summary === 'string' ? summary : String(summary);

  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(summaryStr);
    if (typeof parsed === 'object' && parsed !== null) {
      // Priority order for extracting summary content
      const summaryFields = [
        'observations', 
        'keyTakeaways', 
        'trendSummary', 
        'strategySummary',
        'rawContent'
      ];
      
      for (const field of summaryFields) {
        if (parsed[field] && typeof parsed[field] === 'string') {
          const cleanedContent = cleanupText(parsed[field]);
          if (cleanedContent.length > 20) { // Make sure we have substantial content
            return cleanedContent;
          }
        }
      }
      
      // If no good field found, stringify the whole thing
      return cleanupText(JSON.stringify(parsed, null, 2));
    }
  } catch (e) {
    // Not JSON, continue with normal text processing
  }

  // Apply cleanup for non-JSON content
  return cleanupText(summaryStr);
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
      } else if (parsed.observations) {
        return cleanupText(parsed.observations);
      } else if (parsed.keyTakeaways) {
        return cleanupText(parsed.keyTakeaways);
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

  // Additional cleanup for summaries - remove any remaining formatting artifacts
  cleanedSummary = cleanedSummary
    // Remove escaped quotes and newlines
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\\\\/g, '\\')
    // Remove any remaining hashtag-like patterns (e.g., "**#hashtag**")
    .replace(/\*\*#[^*]+\*\*/g, '')
    // Remove any remaining hashtags with special characters
    .replace(/#[^\s.,!?]+/g, '')
    // Remove section markers and numbered lists
    .replace(/^\d+\.\s*/gm, '')
    .replace(/###\s*\d+\./g, '')
    // Remove markdown formatting
    .replace(/\*\*/g, '')
    .replace(/^#+\s*/gm, '')
    // Remove dashes and asterisks
    .replace(/^[-*]\s*/gm, '')
    .replace(/---/g, '')
    // Clean up any double spaces created by removals
    .replace(/\s+/g, ' ')
    .trim();

  return cleanedSummary;
};

/**
 * Cleans list item text by removing leading hyphens and extra newlines.
 * @param {string} text - The text to clean.
 * @returns {string} - Cleaned text.
 */
const cleanSimpleListItemText = (text) => {
  return text.replace(/^- /, '')
             .replace(/\n/g, ' ')
             .replace(/\*\*/g, '') // Remove bold markers
             .replace(/###\s*\d+\./g, '') // Remove section markers like "### 4."
             .replace(/^\*\s*/, '') // Remove leading asterisks
             .replace(/^--\s*/, '') // Remove leading dashes
             .replace(/^---\s*/, '') // Remove triple dashes
             .replace(/^\d+\.\s*/, '') // Remove numbered list markers like "1. "
             .replace(/^#+\s*/, '') // Remove markdown headers
             .replace(/\s*---\s*/g, ' ') // Remove dashes in the middle
             .replace(/\s+/g, ' ') // Normalize whitespace
             .trim();
};

/**
 * Formats a string (potentially a list or paragraph) into JSX.
 * @param {string} str - The string content.
 * @param {string} title - The title of the section (for default message).
 * @param {string} [listMarker='\\n- '] - The marker indicating a list item.
 * @returns {JSX.Element}
 */
export const formatTextToJsx = (str, title, listMarker = '\\n- ') => {
  if (typeof str !== 'string' || !str.trim()) {
    return <p className="text-primary-600 dark:text-primary-400 italic">No {title.toLowerCase()} provided.</p>;
  }

  let cleanedStr = str.replace(/\*\*/g, ''); // Remove bold markers
  cleanedStr = cleanedStr.replace(/^\s*\d\.\s*([\w\s()]+:)?/i, ''); // Remove leading "1. Title:" or "1. "
  cleanedStr = cleanedStr.replace(/---/g, '').trim(); // Remove "---"
  cleanedStr = cleanedStr.replace(/###\s*\d+\./g, '').trim(); // Remove "### 2." markers
  cleanedStr = cleanedStr.replace(/^\*\s*/gm, ''); // Remove leading asterisks from lines
  cleanedStr = cleanedStr.replace(/^#+\s*/gm, ''); // Remove markdown headers
  cleanedStr = cleanedStr.replace(/^\d+\.\s*/gm, ''); // Remove numbered list markers
  cleanedStr = cleanedStr.replace(/\s*---\s*/g, ' '); // Remove dashes in the middle
  cleanedStr = cleanedStr.replace(/\s+/g, ' '); // Normalize multiple spaces
  cleanedStr = cleanedStr.trim();

  const items = cleanedStr.split(listMarker)
    .map(item => cleanSimpleListItemText(item))
    .filter(item => item && item.length > 0);

  if (items.length === 0 || (items.length === 1 && cleanedStr.indexOf(listMarker) === -1 && !cleanedStr.startsWith('- '))) {
    // Single block of text or does not appear to be a list
    // Clean the text further for paragraph display
    const paragraphText = cleanedStr
      .replace(/^[-*]\s*/gm, '') // Remove any remaining list markers
      .replace(/^\d+\.\s*/gm, '') // Remove numbered list markers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
      
    return (
      <div className="text-primary-700 dark:text-primary-300 whitespace-pre-line leading-relaxed break-words">
        {paragraphText.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-2 last:mb-0">{paragraph || '\u00A0'}</p>
        ))}
      </div>
    );
  }

  return (
    <ul className="list-disc list-inside space-y-1 text-primary-700 dark:text-primary-300 pl-4">
      {items.map((itemText, index) => (
        itemText ? <li key={index}>{itemText}</li> : null
      ))}
    </ul>
  );
};

/**
 * Formats a sample script string (with Visual Cues and Voiceover) into JSX.
 * @param {string} scriptStr - The sample script content.
 * @returns {JSX.Element}
 */
export const formatSampleScriptToJsx = (scriptStr) => {
  if (typeof scriptStr !== 'string' || !scriptStr.trim()) {
    return <p className="text-primary-600 dark:text-primary-400 italic">No sample script provided.</p>;
  }

  // Clean up the script string first
  let cleanedScriptStr = scriptStr.replace(/\*\*/g, ''); // Remove bold markers
  cleanedScriptStr = cleanedScriptStr.replace(/---/g, ''); // Remove triple dashes
  cleanedScriptStr = cleanedScriptStr.replace(/###\s*\d+\./g, ''); // Remove section markers
  cleanedScriptStr = cleanedScriptStr.replace(/^\d+\.\s*/gm, ''); // Remove numbered list markers
  cleanedScriptStr = cleanedScriptStr.replace(/^#+\s*/gm, ''); // Remove markdown headers
  cleanedScriptStr = cleanedScriptStr.replace(/\s+/g, ' ').trim(); // Normalize whitespace

  const visualCuesMatch = cleanedScriptStr.match(/Visual Cues:([\s\S]*?)(Voiceover\/Script:|$)/i);
  const voiceoverMatch = cleanedScriptStr.match(/Voiceover\/Script:([\s\S]*)/i);

  const visualCuesText = visualCuesMatch && visualCuesMatch[1] ? visualCuesMatch[1].trim() : null;
  const voiceoverText = voiceoverMatch && voiceoverMatch[1] ? voiceoverMatch[1].trim() : null;

  return (
    <div className="space-y-3">
      <div>
        <h5 className="text-md font-semibold text-primary-700 dark:text-primary-200 mb-1">Visual Cues:</h5>
        {visualCuesText ? 
          formatTextToJsx(visualCuesText, "Visual Cues") :
          <p className="text-primary-600 dark:text-primary-400 italic">Not specified.</p>
        }
      </div>
      <div>
        <h5 className="text-md font-semibold text-primary-700 dark:text-primary-200 mb-1">Voiceover/Script:</h5>
        {voiceoverText ? 
          <div className="text-primary-700 dark:text-primary-300 whitespace-pre-line leading-relaxed break-words">
            {voiceoverText.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">{paragraph || '\u00A0'}</p>
            ))}
          </div> :
          <p className="text-primary-600 dark:text-primary-400 italic">Not specified.</p>
        }
      </div>
    </div>
  );
};

/**
 * Formats a hashtag strategy string into JSX.
 * @param {string} str - The hashtag strategy content.
 * @returns {JSX.Element}
 */
export const formatHashtagStrategyToJsx = (str) => {
  if (typeof str !== 'string' || !str.trim()) {
    return <p className="text-primary-600 dark:text-primary-400 italic">No hashtag strategy provided.</p>;
  }

  // Clean up the string first
  let cleanedStr = str.replace(/\*\*/g, ''); // Remove bold markers
  cleanedStr = cleanedStr.replace(/---/g, ''); // Remove triple dashes
  cleanedStr = cleanedStr.replace(/###\s*\d+\./g, ''); // Remove section markers
  cleanedStr = cleanedStr.replace(/^\d+\.\s*/gm, ''); // Remove numbered list markers
  cleanedStr = cleanedStr.replace(/^#+\s*/gm, ''); // Remove markdown headers
  cleanedStr = cleanedStr.trim();

  const sectionTitlesRegex = /^(Primary \(Niche\):|Secondary \(Trending\/Regional\):|Broad Appeal:)/i;
  let sections = [];
  let currentSection = null;

  cleanedStr.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line === '---' || line.match(/^###\s*\d+/) || line.match(/^\d+\.\s*$/)) {
      return; // Skip empty lines, dashes, and section markers
    }
    
    const titleMatch = line.match(sectionTitlesRegex);
    if (titleMatch) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: titleMatch[0], items: [] };
      const contentAfterTitle = line.substring(titleMatch[0].length).trim();
      if (contentAfterTitle) {
        if (contentAfterTitle.startsWith('- ')) {
          currentSection.items.push(cleanSimpleListItemText(contentAfterTitle));
        } else {
          currentSection.items.push(contentAfterTitle); 
        }
      }
    } else if (currentSection && line) {
      if (line.startsWith('- ')) {
        currentSection.items.push(cleanSimpleListItemText(line));
      } else if (line.startsWith('#')) {
        // Handle hashtags directly
        currentSection.items.push(line);
      } else {
        currentSection.items.push(line);
      }
    }
  });
  if (currentSection) sections.push(currentSection);

  if (sections.length === 0) {
    // If no sections parsed, try to extract hashtags directly
    const hashtags = cleanedStr.split(/\s+/).filter(word => word.startsWith('#') && word.length > 1);
    if (hashtags.length > 0) {
      return (
        <ul className="list-disc list-inside space-y-1 text-primary-700 dark:text-primary-300 pl-4">
          {hashtags.map((hashtag, index) => <li key={index}>{hashtag}</li>)}
        </ul>
      );
    }
    return formatTextToJsx(cleanedStr, "Hashtag Strategy");
  }

  return (
    <div className="space-y-3">
      {sections.map((section, index) => (
        <div key={index}>
          <h5 className="text-md font-semibold text-primary-700 dark:text-primary-200 mb-1">{section.title}</h5>
          {section.items.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-primary-700 dark:text-primary-300 pl-4">
              {section.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
            </ul>
          ) : (
            <p className="text-primary-600 dark:text-primary-400 italic pl-4">No specific hashtags listed for this category.</p>
          )}
        </div>
      ))}
    </div>
  );
};
