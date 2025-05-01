import React from 'react';
import ScheduleSettings from '../ScheduleSettings';

const EmailScheduleTab = ({ user, userProfile, onUpdate }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Email Schedule</h2>
        <div className="ml-3 h-1 flex-grow bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
      </div>

      <div className="glass-card p-6 mb-8 transform transition-all duration-500 hover:translate-y-[-5px]">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">📧</span>
          <h3 className="text-xl font-semibold">Email Notification Settings</h3>
        </div>

        <div className="bg-white/30 dark:bg-primary-800/30 p-4 rounded-lg backdrop-blur-sm mb-6">
          <p className="text-primary-600 dark:text-primary-300">
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

      <div className="glass-card p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">ℹ️</span>
          <h3 className="text-xl font-semibold">About Email Notifications</h3>
        </div>

        <div className="space-y-4 text-primary-600 dark:text-primary-300">
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
