import React from 'react';
import SubscriptionManager from '../SubscriptionManager';
import WorkflowButton from '../WorkflowButton';
import ApiButtons from '../ApiButtons';

const SettingsTab = ({ user, userProfile, onWorkflowComplete }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <div className="ml-3 h-1 flex-grow bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
      </div>

      {/* Subscription Management */}
      {user && userProfile && (
        <div className="glass-card p-6 mb-8 transform transition-all duration-500 hover:translate-y-[-5px]">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">💳</span>
            <h3 className="text-xl font-semibold">Subscription</h3>
          </div>
          <div className="bg-white/30 dark:bg-primary-800/30 p-4 rounded-lg backdrop-blur-sm mb-4">
            <SubscriptionManager userProfile={userProfile} />
          </div>
        </div>
      )}

      {/* Workflow Controls */}
      <div className="glass-card p-6 mb-8 transform transition-all duration-500 hover:translate-y-[-5px]">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">⚙️</span>
          <h3 className="text-xl font-semibold">Workflow Controls</h3>
        </div>

        <div className="bg-white/30 dark:bg-primary-800/30 p-4 rounded-lg backdrop-blur-sm mb-6">
          <p className="text-primary-600 dark:text-primary-300">
            Manually trigger the analysis workflow or individual API calls.
          </p>
        </div>

        <div className="mb-8 bg-gradient-to-r from-accent-50/50 to-transparent dark:from-accent-900/20 dark:to-transparent p-6 rounded-lg border-l-4 border-accent-500">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <span className="text-xl mr-2">🚀</span>
            <span>Complete Workflow</span>
          </h4>
          <p className="text-primary-500 dark:text-primary-400 mb-4">
            Run the complete workflow to generate queries, scrape TikTok videos, and analyze the content.
          </p>
          <WorkflowButton onComplete={onWorkflowComplete} />
        </div>

        <div className="bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-800/20 dark:to-transparent p-6 rounded-lg border-l-4 border-primary-300 dark:border-primary-600">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <span className="text-xl mr-2">🔧</span>
            <span>Individual API Calls</span>
          </h4>
          <p className="text-primary-500 dark:text-primary-400 mb-4">
            Run specific parts of the workflow individually.
          </p>
          <ApiButtons />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
