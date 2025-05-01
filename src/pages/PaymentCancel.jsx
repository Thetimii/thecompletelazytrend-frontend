import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference on component mount
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);

    // Apply dark mode class to html element
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-primary-50 dark:bg-primary-950 fixed inset-0">
      <PublicNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex items-center justify-center h-full pt-16">
        <div className="max-w-md w-full bg-white dark:bg-primary-900 p-8 rounded-xl shadow-xl border border-primary-100 dark:border-primary-800 m-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">LazyTrend</h1>
            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mb-2">Payment Cancelled</h2>
          </div>

          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg">
            <p>Your payment was cancelled. No charges were made.</p>
          </div>

          <div className="text-center">
            <p className="mb-6 text-primary-700 dark:text-primary-300">You can try again whenever you're ready.</p>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate('/payment')}
                className="btn btn-primary w-full py-3"
              >
                Try Again
              </button>

              <button
                onClick={() => navigate('/onboarding')}
                className="btn btn-secondary w-full py-3"
              >
                Back to Onboarding
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
