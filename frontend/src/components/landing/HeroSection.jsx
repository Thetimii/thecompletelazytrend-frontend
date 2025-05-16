import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check for dark mode preference on component mount
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setDarkMode(darkModePreference);

    // Set up a listener for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white dark:bg-primary-950 py-20 md:py-32">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-100 dark:bg-accent-900/20 rounded-full filter blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-70"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-primary-900 dark:text-white">
              Discover TikTok Trends <span className="text-accent-500">Without the Effort</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-700 dark:text-primary-300 max-w-xl">
              Automatically analyze trending TikTok content in your niche and get personalized content recommendations.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="btn btn-primary text-lg px-8 py-4">
                Start Free Trial
              </Link>
              <a href="#how-it-works" className="btn btn-outline text-lg px-8 py-4">
                See How It Works
              </a>
              <button
                className="btn btn-secondary text-lg px-8 py-4"
                onClick={() => {
                  // Track ShareDiscount event with Meta Pixel
                  if (window.fbq) {
                    fbq('trackCustom', 'ShareDiscount', {promotion: 'share_discount_10%'});
                  }
                  // Add share functionality here (e.g., open share dialog)
                  alert('Share this discount with your friends: 10% off with code FRIEND10');
                }}
              >
                Share Discount
              </button>
            </div>
            <div className="mt-8 text-primary-600 dark:text-primary-400 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span> Credit card required for trial</span>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            {/* Dashboard mockup image */}
            <div className="relative rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-primary-800 bg-white dark:bg-primary-900 transform rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 dark:bg-primary-800 flex items-center px-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="pt-6 pb-4 px-4">
                <div className="w-full h-auto rounded-lg overflow-hidden">
                  <img
                    src={darkMode
                      ? "https://cxtystgaxoeygwbvgqcg.supabase.co/storage/v1/object/public/images//Screenshot%202025-05-01%20at%2021.49.13.png"
                      : "https://cxtystgaxoeygwbvgqcg.supabase.co/storage/v1/object/public/images//Screenshot%202025-05-01%20at%2021.49.06.png"
                    }
                    alt="LazyTrend Dashboard"
                    className="w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Dashboard+Preview";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-100 dark:bg-accent-900/30 rounded-lg rotate-12 animate-float"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-lg -rotate-12 animate-float-delay"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
