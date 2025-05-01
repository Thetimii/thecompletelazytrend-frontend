import React from 'react';
import SubscriptionManager from '../SubscriptionManager';

const SettingsTab = ({ user, userProfile, onWorkflowComplete }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Settings</h2>
      </div>

      {/* Subscription Management */}
      {user && userProfile && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            <svg className="h-6 w-6 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Subscription Management</h3>
          </div>

          <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg mb-6 border-l-4 border-accent-500">
            <p className="text-primary-700 dark:text-primary-300">
              Manage your subscription settings and billing information.
            </p>
          </div>

          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            <SubscriptionManager userProfile={userProfile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
