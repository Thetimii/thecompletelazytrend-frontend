import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-bold mb-6 text-primary-900 dark:text-white">Privacy Policy</h1>
            <p className="text-primary-600 dark:text-primary-400 mb-4">Last Updated: May 1, 2023</p>

            <div className="prose prose-lg max-w-none text-primary-800 dark:text-primary-200">
              <p>
                At LazyTrend, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Information We Collect</h2>
              <p>We collect information that you provide directly to us when you:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Register for an account</li>
                <li>Fill out forms on our website</li>
                <li>Subscribe to our newsletter</li>
                <li>Request customer support</li>
                <li>Otherwise communicate with us</li>
              </ul>
              <p>The types of information we may collect include:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Contact information (such as name, email address)</li>
                <li>Billing information (such as credit card details)</li>
                <li>Account credentials</li>
                <li>Business information you provide about your niche and content goals</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Automatically Collected Information</h2>
              <p>
                When you access or use our services, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Log information (such as IP address, browser type, pages visited)</li>
                <li>Device information (such as device ID, operating system)</li>
                <li>Usage information (such as how you use our services)</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize your experience with our services</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Sharing of Information</h2>
              <p>We may share the information we collect in the following circumstances:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>With vendors, service providers, and consultants who need access to such information to carry out work on our behalf</li>
                <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of LazyTrend or others</li>
                <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
                <li>With your consent or at your direction</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Data Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot guarantee the security of our systems.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Your Choices</h2>
              <p>
                You can access and update certain information about you from within your account settings. You can also request that we delete your account and personal information by contacting us.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Changes to this Privacy Policy</h2>
              <p>
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
