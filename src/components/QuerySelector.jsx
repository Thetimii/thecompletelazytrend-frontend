import React, { useState, useEffect } from 'react';

const QuerySelector = ({ queries, selectedQueryId, onSelectQuery }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQueries, setFilteredQueries] = useState([]);

  // Remove duplicate queries by creating a map of unique query texts
  const uniqueQueries = {};

  // Process queries to get only unique ones based on the query text
  queries.forEach(query => {
    // Clean up the query text - remove hashtags and trim
    const cleanQueryText = query.query ? query.query.split('#')[0].trim().toLowerCase() : '';

    // Only add if we don't already have this query text
    if (cleanQueryText && !uniqueQueries[cleanQueryText]) {
      uniqueQueries[cleanQueryText] = {
        ...query,
        cleanQuery: cleanQueryText // Store the clean version for display
      };
    }
  });

  // Convert back to array and sort alphabetically
  const uniqueQueriesArray = Object.values(uniqueQueries).sort((a, b) =>
    a.cleanQuery.localeCompare(b.cleanQuery)
  );

  // Filter queries based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredQueries(uniqueQueriesArray);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = uniqueQueriesArray.filter(query =>
        query.cleanQuery.includes(term)
      );
      setFilteredQueries(filtered);
    }
  }, [searchTerm, uniqueQueriesArray]);

  console.log('Unique queries:', uniqueQueriesArray.length, 'out of', queries.length);
  console.log('Filtered queries:', filteredQueries.length);

  return (
    <div className="mb-0 space-y-4">
      <div>
        <label htmlFor="query-search" className="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-2">
          Search for Query
        </label>
        <input
          type="text"
          id="query-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search queries..."
          className="input w-full transition-all duration-300 hover:border-accent-400 dark:hover:border-accent-500"
        />
      </div>

      <div>
        <label htmlFor="query-select" className="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-2">
          Select Search Query
        </label>
        <div className="relative">
          <select
            id="query-select"
            value={selectedQueryId || ''}
            onChange={(e) => onSelectQuery(e.target.value)}
            className="select appearance-none pr-10 transition-all duration-300 hover:border-accent-400 dark:hover:border-accent-500"
          >
            <option value="">All Queries</option>
            {filteredQueries.map((query) => (
              <option key={query.id} value={query.id}>
                {query.cleanQuery}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-500 dark:text-primary-400">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySelector;
