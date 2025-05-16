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
    full_name: userProfile?.full_name || ''
  });
  const [feedbackData, setFeedbackData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    try {
      // Update email in auth if it changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });

        if (emailError) throw emailError;
      }

      // Update profile in database
      const updatedProfile = await saveUserProfile({
        auth_id: user.id,
        email: formData.email,
        business_description: formData.business_description,
        full_name: formData.full_name,
        // Preserve other fields
        ...userProfile,
      });

      // Update profile in context
      updateUserProfile(updatedProfile);

      setMessage({
        text: 'Profile updated successfully! If you changed your email, please check your inbox for a confirmation link.',
        type: 'success'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: `Error updating profile: ${error.message}`,
        type: 'error'
      });
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
                      Business Description
                    </label>
                    <textarea
                      id="business_description"
                      name="business_description"
                      value={formData.business_description}
                      onChange={handleChange}
                      rows="4"
                      className="input w-full"
                      placeholder="Describe your business..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          email: user?.email || '',
                          business_description: userProfile?.business_description || '',
                          full_name: userProfile?.full_name || ''
                        });
                        setMessage({ text: '', type: '' });
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
    </div>
  );
};

export default SettingsTab;
