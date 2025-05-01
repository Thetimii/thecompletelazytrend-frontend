import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  // Extract color name from the border class (e.g., "border-accent-500" -> "accent")
  const colorName = color.replace('border-l-4 border-', '').split('-')[0];

  return (
    <div className="glass-card p-6 overflow-hidden relative group">
      {/* Left border accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${color.replace('border-l-4', 'bg')}`}></div>

      {/* Background gradient that shows on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-${colorName}-500 to-${colorName}-300 dark:from-${colorName}-600 dark:to-${colorName}-800`}></div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h3 className="text-primary-500 dark:text-primary-300 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-1 text-primary-800 dark:text-primary-50 transition-all duration-500 group-hover:translate-x-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${colorName}-100 dark:bg-${colorName}-900/30 text-${colorName}-500 dark:text-${colorName}-400 transition-all duration-500 group-hover:scale-110 shadow-sm`}>
          {icon}
        </div>
      </div>

      {/* Animated particle effect on hover */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-150 blur-xl"></div>
    </div>
  );
};

export default StatCard;
