import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';

const CookiePolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white dark:bg-primary-900 shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold gradient-text">LazyTrend</Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-primary-700 dark:text-primary-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 bg-gray-50 dark:bg-primary-950">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-primary-900 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-primary-900 dark:text-white">Cookie Policy</h1>
            <p className="text-primary-600 dark:text-primary-400 mb-4">Last Updated: May 1, 2023</p>

            <div className="prose prose-lg max-w-none text-primary-800 dark:text-primary-200">
              <p>
                This Cookie Policy explains how LazyTrend ("we", "us", or "our") uses cookies and similar technologies on our website. This policy is part of our Privacy Policy.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Types of Cookies We Use</h2>
              <p>We use the following types of cookies:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> These cookies allow the website to remember choices you make (such as your preferred language or the region you are in) and provide enhanced, more personal features.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                </li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Specific Cookies We Use</h2>
              <p>Here are some of the specific cookies we use:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Authentication Cookies:</strong> These cookies help us identify you when you are logged into our services.
                </li>
                <li>
                  <strong>Session Cookies:</strong> These temporary cookies expire when you close your browser and are used to help the site function properly during your visit.
                </li>
                <li>
                  <strong>Persistent Cookies:</strong> These cookies remain on your device for a set period and are activated each time you visit the website.
                </li>
                <li>
                  <strong>Third-Party Cookies:</strong> We may allow third parties, such as analytics providers and advertising networks, to set cookies on our website.
                </li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">How to Control Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you.
              </p>
              <p>
                To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-600">www.allaboutcookies.org</a>.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Changes to This Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date at the top.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at:
                <br />
                <a href="mailto:privacy@lazy-trends.com" className="text-accent-500 hover:text-accent-600">privacy@lazy-trends.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
