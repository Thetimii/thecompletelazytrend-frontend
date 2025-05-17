import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const PaymentSuccessDashboard = () => {
  const { userProfile } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    // Check if user has a preference stored
    const savedMode = localStorage.getItem('darkMode');
    // Check if browser prefers dark mode
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedMode ? savedMode === 'true' : prefersDark;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Effect to apply dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-primary-50 dark:bg-primary-950 transition-colors duration-300 fixed inset-0">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="absolute inset-0 bg-texture"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeTab="summary"
        setActiveTab={() => {}}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <div className="ml-20 lg:ml-64 h-screen transition-all duration-300 relative z-10 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-primary-900 p-8 rounded-xl shadow-xl border border-primary-100 dark:border-primary-800">
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to LazyTrend!</h1>
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mb-4">
                Your Payment Was Successful 🎉
              </h2>
              <p className="text-primary-600 dark:text-primary-400 text-lg mb-6">
                Your 7-day free trial has started and we're already working on your first analysis.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-primary-800 dark:text-primary-100">
                What Happens Now?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-accent-600 dark:text-accent-400 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-800 dark:text-primary-100 mb-1">Automatic Analysis</h4>
                    <p className="text-primary-600 dark:text-primary-400">
                      Our AI is already analyzing TikTok videos related to your business. This process typically takes 5-10 minutes to complete.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-accent-600 dark:text-accent-400 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-800 dark:text-primary-100 mb-1">Trend Identification</h4>
                    <p className="text-primary-600 dark:text-primary-400">
                      We'll identify the most relevant trends for your business based on the analyzed videos and generate personalized recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-accent-600 dark:text-accent-400 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-800 dark:text-primary-100 mb-1">Content Ideas</h4>
                    <p className="text-primary-600 dark:text-primary-400">
                      You'll receive detailed content ideas and strategies tailored to your business that you can implement right away.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/dashboard" 
                className="btn btn-primary py-3 px-8 text-lg inline-flex items-center"
              >
                Go to Dashboard
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessDashboard;
