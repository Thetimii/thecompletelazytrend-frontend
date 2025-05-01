import React from 'react';
import SubscriptionManager from '../SubscriptionManager';
import WorkflowButton from '../WorkflowButton';
import ApiButtons from '../ApiButtons';

const SettingsTab = ({ user, userProfile, onWorkflowComplete }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      {/* Subscription Management */}
      {user && userProfile && (
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Subscription</h3>
          <SubscriptionManager userProfile={userProfile} />
        </div>
      )}
      
      {/* Workflow Controls */}
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Workflow Controls</h3>
        <p className="text-primary-600 dark:text-primary-300 mb-6">
          Manually trigger the analysis workflow or individual API calls.
        </p>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Complete Workflow</h4>
          <p className="text-primary-500 dark:text-primary-400 mb-4">
            Run the complete workflow to generate queries, scrape TikTok videos, and analyze the content.
          </p>
          <WorkflowButton onComplete={onWorkflowComplete} />
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">Individual API Calls</h4>
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
