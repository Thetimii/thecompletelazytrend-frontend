import React from 'react';
import ScheduleSettings from '../ScheduleSettings';

const EmailScheduleTab = ({ user, userProfile, onUpdate }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Email Schedule</h2>
      
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Email Notification Settings</h3>
        <p className="text-primary-600 dark:text-primary-300 mb-6">
          Configure when you want to receive automated analysis emails. We'll run the analysis and send you the results at your specified time.
        </p>
        
        {user && userProfile ? (
          <ScheduleSettings
            user={user}
            userProfile={userProfile}
            onUpdate={onUpdate}
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-lg text-primary-500 dark:text-primary-400">
              Loading user profile...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailScheduleTab;
