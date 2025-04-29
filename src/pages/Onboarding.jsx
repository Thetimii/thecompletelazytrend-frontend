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
    industry: '',
    website: '',
    phone: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
              industry: profile.industry || '',
              website: profile.website || '',
              phone: profile.phone || ''
            });
          }
        } catch (err) {
          console.error('Error checking user profile:', err);
        }
      }
    };

    checkUserProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Save user profile data
      const updatedProfile = await saveUserProfile({
        auth_id: user.id,
        email: user.email,
        ...formData,
        onboarding_completed: true
      });

      console.log("Onboarding completed successfully:", updatedProfile);

      // Force refresh of auth context
      if (window.location.pathname === '/onboarding') {
        // Redirect to dashboard with a slight delay to allow state to update
        setTimeout(() => {
          navigate('/', { replace: true });
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
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

      <div className="mb-4">
        <label htmlFor="full_name" className="block text-gray-700 text-sm font-bold mb-2">
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
          Phone Number (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={nextStep}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 2: Business Information
  const renderStep2 = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Business Information</h2>

      <div className="mb-4">
        <label htmlFor="business_name" className="block text-gray-700 text-sm font-bold mb-2">
          Business Name
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          value={formData.business_name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Acme Inc."
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="industry" className="block text-gray-700 text-sm font-bold mb-2">
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select an industry</option>
          <option value="retail">Retail</option>
          <option value="food">Food & Beverage</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="finance">Finance</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
          Website (optional)
        </label>
        <input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="https://example.com"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 3: Business Description
  const renderStep3 = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Business Description</h2>

      <div className="mb-4">
        <label htmlFor="business_description" className="block text-gray-700 text-sm font-bold mb-2">
          Describe your business
        </label>
        <textarea
          id="business_description"
          name="business_description"
          value={formData.business_description}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="5"
          placeholder="Tell us about your business, products, services, target audience, etc."
          required
        />
        <p className="text-sm text-gray-600 mt-1">
          This description will be used to generate relevant TikTok content ideas for your business.
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to The Complete Lazy Trend</h1>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex-1 h-1 ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>1</div>
            <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>2</div>
            <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>3</div>
            <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
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
  );
};

export default Onboarding;
