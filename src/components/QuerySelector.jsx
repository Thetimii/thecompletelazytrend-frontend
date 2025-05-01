import React from 'react';

const QuerySelector = ({ queries, selectedQueryId, onSelectQuery }) => {
  return (
    <div className="mb-0">
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
          {queries.map((query) => (
            <option key={query.id} value={query.id}>
              {query.query}
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
  );
};

export default QuerySelector;
