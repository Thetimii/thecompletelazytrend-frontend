import React, { useState, useEffect } from 'react';
import { saveUserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const ScheduleSettings = ({ user, userProfile, onUpdate }) => {
  const { updateUserProfile } = useAuth();
  const [isEnabled, setIsEnabled] = useState(userProfile?.email_notifications || false);
  const [hour, setHour] = useState(userProfile?.email_time_hour || 9);
  const [timezone, setTimezone] = useState(userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [timezones, setTimezones] = useState([]);

  // Load list of timezones
  useEffect(() => {
    // This is a simplified list of common timezones
    // For a complete list, you could use a library like moment-timezone
    const commonTimezones = [
      'America/New_York',      // Eastern Time
      'America/Chicago',       // Central Time
      'America/Denver',        // Mountain Time
      'America/Los_Angeles',   // Pacific Time
      'America/Anchorage',     // Alaska Time
      'Pacific/Honolulu',      // Hawaii Time
      'Europe/London',         // GMT/BST
      'Europe/Paris',          // Central European Time
      'Europe/Helsinki',       // Eastern European Time
      'Europe/Moscow',         // Moscow Time
      'Asia/Dubai',            // Gulf Time
      'Asia/Kolkata',          // India Time
      'Asia/Singapore',        // Singapore Time
      'Asia/Tokyo',            // Japan Time
      'Australia/Sydney',      // Australian Eastern Time
      'Pacific/Auckland',      // New Zealand Time
      'Europe/Zurich',         // Central European Time (Switzerland)
    ];

    // Format the timezones for display
    const formattedTimezones = commonTimezones.map(tz => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          timeZoneName: 'long'
        });
        const parts = formatter.formatToParts(now);
        const timeZonePart = parts.find(part => part.type === 'timeZoneName');
        const timeZoneName = timeZonePart ? timeZonePart.value : tz;

        // Get the UTC offset
        const offset = new Date().toLocaleString('en-US', { timeZone: tz, timeZoneName: 'short' }).split(' ').pop();

        return {
          value: tz,
          label: `${tz.replace('_', ' ').split('/').pop()} (${offset})`
        };
      } catch (e) {
        return { value: tz, label: tz };
      }
    });

    // Add the user's current timezone if it's not in the list
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!formattedTimezones.some(tz => tz.value === userTimezone)) {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: userTimezone,
          timeZoneName: 'long'
        });
        const parts = formatter.formatToParts(now);
        const timeZonePart = parts.find(part => part.type === 'timeZoneName');
        const timeZoneName = timeZonePart ? timeZonePart.value : userTimezone;

        // Get the UTC offset
        const offset = new Date().toLocaleString('en-US', { timeZone: userTimezone, timeZoneName: 'short' }).split(' ').pop();

        formattedTimezones.unshift({
          value: userTimezone,
          label: `${userTimezone.replace('_', ' ').split('/').pop()} (${offset}) - Your timezone`
        });
      } catch (e) {
        formattedTimezones.unshift({ value: userTimezone, label: `${userTimezone} - Your timezone` });
      }
    }

    // Sort timezones by name
    formattedTimezones.sort((a, b) => a.label.localeCompare(b.label));

    setTimezones(formattedTimezones);

    // Set default timezone if not already set
    if (!userProfile?.timezone) {
      setTimezone(userTimezone);
    }
  }, [userProfile?.timezone]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Save the updated preferences - preserve all existing profile data
      const updatedProfile = await saveUserProfile({
        ...userProfile, // Keep all existing profile data
        id: userProfile.id,
        auth_id: user.id,
        email_notifications: isEnabled,
        email_time_hour: parseInt(hour, 10),
        timezone: timezone,
        updated_at: new Date().toISOString()
      });

      // Update the user profile in the auth context
      await updateUserProfile(updatedProfile);

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
      label: `${displayHour}:00 ${amPm}`
    };
  });

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg">
          <p>Settings saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${isEnabled ? 'bg-accent-500' : 'bg-primary-300 dark:bg-primary-700'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${isEnabled ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <span className="ml-3 text-primary-800 dark:text-primary-100 font-medium">Enable scheduled analysis</span>
          </label>
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-2 ml-16">
            When enabled, we'll automatically run the complete workflow at your specified time.
          </p>
        </div>

        {isEnabled && (
          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700 mb-6">
            <div className="mb-6">
              <label className="block text-primary-800 dark:text-primary-100 text-sm font-medium mb-2">
                Your Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="select"
              >
                {timezones.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                Select your local timezone to ensure emails are sent at the correct time.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-primary-800 dark:text-primary-100 text-sm font-medium mb-2">
                Time to receive analysis (in your local time)
              </label>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="select"
              >
                {hourOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                The analysis will run and you'll receive an email once per day at this time in your local timezone.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-6 py-3 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleSettings;
