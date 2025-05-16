import React from 'react';

const BusinessSelector = ({ businesses, selectedBusinessId, onSelectBusiness }) => {
  return (
    <div className="mb-6">
      <label htmlFor="business-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Business
      </label>
      <select
        id="business-select"
        value={selectedBusinessId || ''}
        onChange={(e) => onSelectBusiness(e.target.value)}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Businesses</option>
        {businesses.map((business) => (
          <option key={business.id} value={business.id}>
            {business.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BusinessSelector;
