import React from 'react';

const QuerySelector = ({ queries, selectedQueryId, onSelectQuery }) => {
  return (
    <div className="mb-6">
      <label htmlFor="query-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Search Query
      </label>
      <select
        id="query-select"
        value={selectedQueryId || ''}
        onChange={(e) => onSelectQuery(e.target.value)}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Queries</option>
        {queries.map((query) => (
          <option key={query.id} value={query.id}>
            {query.query}
          </option>
        ))}
      </select>
    </div>
  );
};

export default QuerySelector;
