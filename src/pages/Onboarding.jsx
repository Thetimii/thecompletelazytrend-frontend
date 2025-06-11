import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveUserProfile, getUserProfile } from '../services/userService';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    business_description: '',
    website: '',
    phone: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Auto-detect timezone
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Use a ref to track if the effect has run
  const hasRunEffect = React.useRef(false);

  useEffect(() => {
    // Check if user already completed onboarding
    const checkUserProfile = async () => {
      if (user?.id) {
        try {
          const profile = await getUserProfile(user.id);

          if (profile) {
            // If user has already completed onboarding, redirect to dashboard
            if (profile.onboarding_completed) {
              navigate('/');
              return;
            }

            // Pre-fill form with existing data
            setFormData({
              full_name: profile.full_name || '',
              business_name: profile.business_name || '',
              business_description: profile.business_description || '',
              website: profile.website || '',
              phone: profile.phone || '',
              timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
            });
          }
        } catch (err) {
          console.error('Error checking user profile:', err);
        }
      }
    };

    // Only run once when the component mounts
    if (!hasRunEffect.current && user?.id) {
      checkUserProfile();
      hasRunEffect.current = true;
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate business description length
    if (formData.business_description.length < 150) {
      setError(`Business description must be at least 150 characters. Current length: ${formData.business_description.length}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Debug user object
      console.log("User object in onboarding:", user);

      if (!user || !user.id) {
        setError("User not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      // Prepare data to save
      // Note: We're setting onboarding_completed to false until payment is completed
      const dataToSave = {
        auth_id: user.id,
        email: user.email,
        ...formData,
        onboarding_completed: true, // We'll still set this to true to proceed to payment
        payment_completed: false // This will be set to true after payment
      };

      console.log("Saving user profile data:", dataToSave);

      // Save user profile data
      const updatedProfile = await saveUserProfile(dataToSave);

      console.log("Onboarding completed successfully:", updatedProfile);

      // Set a flag in localStorage to trigger workflow on dashboard
      localStorage.setItem('triggerWorkflow', 'true');

      // Force refresh of auth context
      if (window.location.pathname === '/onboarding') {
        // Redirect to payment page with a slight delay to allow state to update
        setTimeout(() => {
          navigate('/payment', { replace: true });
        }, 100);
      }
    } catch (err) {
      console.error('Error in onboarding submission:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Step 1: Personal Information
  const renderStep1 = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-primary-800 dark:text-primary-100">Personal Information</h2>

      <div className="mb-6">
        <label htmlFor="full_name" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
          className="input"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="phone" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          Phone Number (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="input"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={nextStep}
          className="btn btn-primary px-6 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 2: Business Information
  const renderStep2 = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-primary-800 dark:text-primary-100">Business Information</h2>

      <div className="mb-6">
        <label htmlFor="business_name" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          Business Name
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          value={formData.business_name}
          onChange={handleChange}
          className="input"
          placeholder="Acme Inc."
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="website" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          Website (optional)
        </label>
        <input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          className="input"
          placeholder="https://example.com"
        />
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="btn btn-secondary px-6 py-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="btn btn-primary px-6 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 3: Business Description
  const renderStep3 = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-primary-800 dark:text-primary-100">Business Description</h2>
      
      {/* Importance Alert */}
      <div className="mb-6 p-4 bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-accent-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-accent-800 dark:text-accent-200">
              Critical: This Powers Your AI Recommendations
            </h3>
            <p className="mt-1 text-sm text-accent-700 dark:text-accent-300">
              Our AI uses this description to find trending TikTok videos in your niche and create personalized content recommendations. Be specific about your business, target audience, and what makes you unique.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="business_description" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          Describe your business <span className="text-red-500">*</span>
        </label>
        <textarea
          id="business_description"
          name="business_description"
          value={formData.business_description}
          onChange={handleChange}
          className={`input ${formData.business_description.length < 150 ? 'border-red-300 dark:border-red-700' : 'border-green-300 dark:border-green-700'}`}
          rows="6"
          placeholder="Example: I run an eco-friendly fashion brand targeting millennials who care about sustainability. We specialize in casual wear made from recycled materials, focusing on comfortable yet stylish pieces for everyday wear. Our customers value both style and environmental responsibility..."
          required
          minLength={150}
        />
        <div className="mt-2 flex justify-between items-center">
          <p className={`text-sm ${formData.business_description.length < 150 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {formData.business_description.length} / 150 characters minimum
          </p>
        </div>
        {formData.business_description.length < 150 && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            Please provide at least 150 characters for optimal AI analysis and recommendations.
          </p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="btn btn-secondary px-6 py-2"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading || formData.business_description.length < 150}
          className="btn btn-primary px-6 py-2 flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Complete Setup'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="h-screen w-screen overflow-hidden bg-primary-50 dark:bg-primary-950 fixed inset-0 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-primary-900 p-8 rounded-xl shadow-xl border border-primary-100 dark:border-primary-800 m-4 overflow-y-auto max-h-[90vh]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">LazyTrend</h1>
            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mb-2">Welcome</h2>
            <p className="text-primary-600 dark:text-primary-400">Let's set up your account</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex-1 h-1 ${currentStep >= 1 ? 'bg-accent-500' : 'bg-primary-200 dark:bg-primary-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-accent-500 text-white' : 'bg-primary-200 dark:bg-primary-700 text-primary-700 dark:text-primary-300'}`}>1</div>
              <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-accent-500' : 'bg-primary-200 dark:bg-primary-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-accent-500 text-white' : 'bg-primary-200 dark:bg-primary-700 text-primary-700 dark:text-primary-300'}`}>2</div>
              <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-accent-500' : 'bg-primary-200 dark:bg-primary-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-accent-500 text-white' : 'bg-primary-200 dark:bg-primary-700 text-primary-700 dark:text-primary-300'}`}>3</div>
              <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-accent-500' : 'bg-primary-200 dark:bg-primary-700'}`}></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>
        </div>
      </div>

    </>
  );
};

export default Onboarding;
