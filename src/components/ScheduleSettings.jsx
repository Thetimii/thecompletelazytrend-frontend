import React, { useState, useEffect } from 'react';
import { saveUserProfile } from '../services/userService';

const ScheduleSettings = ({ user, userProfile, onUpdate }) => {
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

      // Save the updated preferences
      const updatedProfile = await saveUserProfile({
        id: userProfile.id,
        auth_id: user.id,
        email_notifications: isEnabled,
        email_time_hour: parseInt(hour, 10),
        timezone: timezone
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
      label: `${displayHour}:00 ${amPm}`
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
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Your Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {timezones.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select your local timezone to ensure emails are sent at the correct time.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Time to receive analysis (in your local time)
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
                The analysis will run and you'll receive an email once per day at this time in your local timezone.
              </p>
            </div>
          </>
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
