import React, { useState } from 'react';
import SubscriptionManager from '../SubscriptionManager';
import { saveUserProfile } from '../../services/userService';
import { supabase } from '../../services/supabaseService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const SettingsTab = ({ user, userProfile, onWorkflowComplete }) => {
  const { updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    business_description: userProfile?.business_description || '',
    full_name: userProfile?.full_name || '',
    timezone: userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [showBusinessDescriptionModal, setShowBusinessDescriptionModal] = useState(false);
  const [businessDescriptionChanged, setBusinessDescriptionChanged] = useState(false);

  // Update form data when userProfile changes (but only when not editing)
  React.useEffect(() => {
    if (!isEditing) {
      setFormData({
        email: user?.email || '',
        business_description: userProfile?.business_description || '',
        full_name: userProfile?.full_name || '',
        timezone: userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  }, [user, userProfile, isEditing]);

  // Initialize form data when editing mode is enabled
  React.useEffect(() => {
    if (isEditing && userProfile) {
      setFormData({
        email: user?.email || '',
        business_description: userProfile?.business_description || '',
        full_name: userProfile?.full_name || '',
        timezone: userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  }, [isEditing]);

  const [feedbackData, setFeedbackData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Track if business description changed
    if (name === 'business_description' && value !== userProfile?.business_description) {
      setBusinessDescriptionChanged(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackData.subject || !feedbackData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setFeedbackLoading(true);

    try {
      // Use the backend API endpoint
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL || 'https://thecompletelazytrend-backend.onrender.com'}/api/feedback`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: feedbackData.subject,
          message: feedbackData.message,
          userEmail: user.email,
          userName: userProfile.full_name || user.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      toast.success('Feedback sent successfully!');
      setFeedbackData({ subject: '', message: '' });
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback. Please try again later.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Validate business description length
    if (formData.business_description && formData.business_description.length < 150) {
      setMessage({
        text: `Business description must be at least 150 characters. Current length: ${formData.business_description.length}`,
        type: 'error'
      });
      setLoading(false);
      return;
    }

    try {
      // Update email in auth if it changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });

        if (emailError) throw emailError;
      }

      // Update profile in database - preserve all existing profile data
      const updatedProfile = await saveUserProfile({
        ...userProfile, // Keep all existing profile data first
        id: userProfile.id,
        auth_id: user.id,
        email: formData.email,
        business_description: formData.business_description,
        full_name: formData.full_name,
        timezone: formData.timezone,
        updated_at: new Date().toISOString()
      });

      console.log('Updated profile:', updatedProfile); // Debug log

      // Update profile in context
      updateUserProfile(updatedProfile);

      setMessage({
        text: 'Profile updated successfully! If you changed your email, please check your inbox for a confirmation link.',
        type: 'success'
      });
      setIsEditing(false);
      
      // Show success toast
      toast.success('Settings saved successfully!');
      
      // Show business description modal if it was changed
      if (businessDescriptionChanged) {
        setShowBusinessDescriptionModal(true);
        setBusinessDescriptionChanged(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: `Error updating profile: ${error.message}`,
        type: 'error'
      });
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Settings</h2>
      </div>

      {/* Profile Settings */}
      {user && userProfile && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Profile Settings</h3>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-sm btn-outline"
              >
                Edit Profile
              </button>
            )}
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300'
            }`}>
              <p>{message.text}</p>
            </div>
          )}

          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="business_description" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                      Business Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="business_description"
                      name="business_description"
                      value={formData.business_description}
                      onChange={handleChange}
                      rows="4"
                      className={`input w-full ${formData.business_description && formData.business_description.length < 150 ? 'border-red-300 dark:border-red-700' : 'border-green-300 dark:border-green-700'}`}
                      placeholder="Describe your business, products, services, target audience, etc. Be as detailed as possible for better AI recommendations."
                      required
                      minLength={150}
                    />
                    <div className="mt-1 flex justify-between items-center">
                      <p className={`text-sm ${formData.business_description && formData.business_description.length < 150 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {formData.business_description ? formData.business_description.length : 0} / 150 characters minimum
                      </p>
                    </div>
                    {formData.business_description && formData.business_description.length < 150 && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Please provide at least 150 characters for optimal AI analysis and recommendations.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    >
                      <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                        {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto-detected)
                      </option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Berlin">Berlin (CET)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Asia/Shanghai">Shanghai (CST)</option>
                      <option value="Asia/Kolkata">Mumbai (IST)</option>
                      <option value="Asia/Bangkok">Bangkok (ICT)</option>
                      <option value="Asia/Singapore">Singapore (SGT)</option>
                      <option value="Australia/Sydney">Sydney (AEDT)</option>
                      <option value="Pacific/Auckland">Auckland (NZDT)</option>
                    </select>
                    <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                      This affects when you receive email notifications and scheduled reports.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          email: user?.email || '',
                          business_description: userProfile?.business_description || '',
                          full_name: userProfile?.full_name || '',
                          timezone: userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
                        });
                        setMessage({ text: '', type: '' });
                        setBusinessDescriptionChanged(false); // Reset business description change tracking
                      }}
                      className="btn btn-outline"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-primary-500 dark:text-primary-400">Email Address</h4>
                  <p className="text-primary-800 dark:text-primary-200">{user.email}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-primary-500 dark:text-primary-400">Full Name</h4>
                  <p className="text-primary-800 dark:text-primary-200">
                    {userProfile.full_name || 'Not set'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-primary-500 dark:text-primary-400">Business Description</h4>
                  <p className="text-primary-800 dark:text-primary-200 whitespace-pre-line">
                    {userProfile.business_description || 'Not set'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-primary-500 dark:text-primary-400">Timezone</h4>
                  <p className="text-primary-800 dark:text-primary-200">
                    {userProfile.timezone || 'Not set'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* Feedback Form */}
      {user && userProfile && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            <svg className="h-6 w-6 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Send Feedback</h3>
          </div>

          <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg mb-6 border-l-4 border-accent-500">
            <p className="text-primary-700 dark:text-primary-300">
              We value your feedback! Let us know how we can improve LazyTrend or report any issues you've encountered.
            </p>
          </div>

          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={feedbackData.subject}
                  onChange={handleFeedbackChange}
                  required
                  className="input w-full"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={feedbackData.message}
                  onChange={handleFeedbackChange}
                  rows="5"
                  required
                  className="input w-full"
                  placeholder="Tell us what you think..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={feedbackLoading}
                >
                  {feedbackLoading ? (
                    <>
                      <span className="animate-spin inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                      Sending...
                    </>
                  ) : 'Send Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Business Description Change Modal */}
      {showBusinessDescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-primary-900 p-6 rounded-xl shadow-xl max-w-md w-full m-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-primary-800 dark:text-primary-100">
                Business Description Updated
              </h3>
            </div>
            
            <div className="space-y-4 text-primary-700 dark:text-primary-300">
              <p>
                <strong>Your business description has been saved successfully!</strong>
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border-l-4 border-amber-500">
                <p className="text-sm">
                  <strong>Note:</strong> The updated description will be used in your next scheduled email analysis. We don't run a new analysis immediately to optimize system resources.
                </p>
              </div>
              
              <p className="text-sm">
                Your next personalized trend report will be generated based on your updated business description and sent to your email according to your schedule.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowBusinessDescriptionModal(false)}
                className="btn btn-primary px-4 py-2"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
