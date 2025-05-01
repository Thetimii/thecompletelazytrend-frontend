import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`card p-6 ${color} transition-all duration-300 hover:translate-y-[-4px]`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-primary-500 dark:text-primary-300 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-primary-800 dark:text-primary-50">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg-opacity-20 bg')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
