import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';

const TermsOfService = () => {
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
            <h1 className="text-3xl font-bold mb-6 text-primary-900 dark:text-white">Terms of Service</h1>
            <p className="text-primary-600 dark:text-primary-400 mb-4">Last Updated: May 1, 2023</p>

            <div className="prose prose-lg max-w-none text-primary-800 dark:text-primary-200">
              <p>
                Please read these Terms of Service ("Terms") carefully before using the LazyTrend website and services.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the services.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">2. Changes to Terms</h2>
              <p>
                We may modify the Terms at any time. If we do so, we'll let you know either by posting the modified Terms on the site or through other communications. It's important that you review the Terms whenever we modify them because if you continue to use the services after we have posted modified Terms, you are indicating to us that you agree to be bound by the modified Terms.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">3. Account Registration</h2>
              <p>
                To use certain features of our services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">4. Subscription and Payments</h2>
              <p>
                Some of our services are available on a subscription basis. You agree to pay all fees charged to your account based on the fees, charges, and billing terms in effect at the time a fee or charge is due and payable.
              </p>
              <p>
                By providing a payment method, you authorize us to charge you for all fees associated with your subscription. If your payment cannot be completed, we may suspend or terminate your access to the services.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">5. Free Trial</h2>
              <p>
                We may offer a free trial for a limited period. At the end of the free trial, you will be automatically charged for the subscription unless you cancel before the end of the trial period.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">6. Cancellation and Refunds</h2>
              <p>
                You may cancel your subscription at any time through your account settings or by contacting us. If you cancel, you may continue to use the services until the end of your current billing period, but you will not receive a refund for any fees already paid.
              </p>
              <p>
                We offer a 30-day money-back guarantee for new subscribers. If you are not satisfied with our services within the first 30 days of your paid subscription, you may request a full refund.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">7. Intellectual Property Rights</h2>
              <p>
                The services and their entire contents, features, and functionality are owned by LazyTrend, its licensors, or other providers and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our services without our prior written consent.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">8. User Content</h2>
              <p>
                Our services may allow you to input information about your business and content goals. You retain all rights in, and are solely responsible for, the content you provide.
              </p>
              <p>
                By providing content to our services, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in connection with providing the services to you.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">9. Prohibited Uses</h2>
              <p>
                You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>In any way that violates any applicable law or regulation</li>
                <li>To transmit any material that is defamatory, obscene, or offensive</li>
                <li>To impersonate or attempt to impersonate LazyTrend, a LazyTrend employee, or another user</li>
                <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the services</li>
                <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the services</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">10. Disclaimer of Warranties</h2>
              <p>
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">11. Limitation of Liability</h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL LAZYTREND BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE SERVICES.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">12. Governing Law</h2>
              <p>
                These Terms and your use of the services shall be governed by and construed in accordance with the laws of the state of California, without giving effect to any choice or conflict of law provision or rule.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">13. Dispute Resolution</h2>
              <p>
                Any dispute arising out of or relating to these Terms or the services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-primary-900 dark:text-white">14. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
                <br />
                <a href="mailto:legal@lazy-trends.com" className="text-accent-500 hover:text-accent-600">legal@lazy-trends.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
