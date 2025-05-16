import React from 'react';
import ScheduleSettings from '../ScheduleSettings';

const EmailScheduleTab = ({ user, userProfile, onUpdate }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Email Schedule</h2>
      </div>

      <div className="dashboard-card mb-8">
        <div className="flex items-center mb-6">
          <svg className="h-6 w-6 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Email Notification Settings</h3>
        </div>

        <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg mb-6 border-l-4 border-accent-500">
          <p className="text-primary-700 dark:text-primary-300">
            Configure when you want to receive automated analysis emails. We'll run the analysis and send you the results at your specified time.
          </p>
        </div>

        {user && userProfile ? (
          <div className="transition-all duration-300 animate-fade-in">
            <ScheduleSettings
              user={user}
              userProfile={userProfile}
              onUpdate={onUpdate}
            />
          </div>
        ) : (
          <div className="text-center p-8 animate-pulse">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary-200 dark:bg-primary-700 mb-4"></div>
              <div className="h-4 w-48 bg-primary-200 dark:bg-primary-700 rounded mb-2"></div>
              <div className="h-3 w-32 bg-primary-100 dark:bg-primary-800 rounded"></div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-card">
        <div className="flex items-center mb-6">
          <svg className="h-6 w-6 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">About Email Notifications</h3>
        </div>

        <div className="space-y-4 text-primary-700 dark:text-primary-300">
          <p>
            Our system will automatically run a complete analysis of trending TikTok videos related to your business
            and send you a detailed report at your scheduled time.
          </p>
          <p>
            The email will include trending content ideas, marketing recommendations, and insights based on the latest
            viral TikTok content in your industry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailScheduleTab;
