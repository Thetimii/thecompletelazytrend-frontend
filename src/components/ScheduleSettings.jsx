import React, { useState } from 'react';
import { saveUserProfile } from '../services/userService';

const ScheduleSettings = ({ user, userProfile, onUpdate }) => {
  const [isEnabled, setIsEnabled] = useState(userProfile?.email_notifications || false);
  const [hour, setHour] = useState(userProfile?.email_time_hour || 9);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Save the updated preferences
      const updatedProfile = await saveUserProfile({
        id: userProfile.id,
        auth_id: user.id,
        email_notifications: isEnabled,
        email_time_hour: parseInt(hour, 10)
      });
      
      setSuccess(true);
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(updatedProfile);
      }
    } catch (err) {
      console.error('Error saving schedule settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate hour options (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hourValue = i;
    const displayHour = hourValue % 12 === 0 ? 12 : hourValue % 12;
    const amPm = hourValue < 12 ? 'AM' : 'PM';
    return {
      value: hourValue,
      label: `${displayHour}:00 ${amPm} (UTC)`
    };
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Scheduled Analysis Settings</h2>
      
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
          <p>Settings saved successfully!</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Enable scheduled analysis</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            When enabled, we'll automatically run the complete workflow at your specified time.
          </p>
        </div>
        
        {isEnabled && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Time to run analysis (UTC)
            </label>
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {hourOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              The analysis will run once per day at this time.
            </p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleSettings;
