import React from 'react';

const QuerySelector = ({ queries, selectedQueryId, onSelectQuery }) => {
  return (
    <div className="mb-6 card p-4">
      <label htmlFor="query-select" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Filter by Search Query
      </label>

      <div className="relative">
        <select
          id="query-select"
          value={selectedQueryId || ''}
          onChange={(e) => onSelectQuery(e.target.value)}
          className="select appearance-none pr-10"
        >
          <option value="">All Queries ({queries.length})</option>
          {queries.map((query) => (
            <option key={query.id} value={query.id}>
              {query.query}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-500 dark:text-primary-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {queries.length > 0 && (
        <div className="mt-2 text-xs text-primary-500 dark:text-primary-400">
          {queries.length} {queries.length === 1 ? 'query' : 'queries'} available
        </div>
      )}
    </div>
  );
};

export default QuerySelector;
