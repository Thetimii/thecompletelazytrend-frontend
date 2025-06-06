import React from 'react';
import { Link } from 'react-router-dom';

const PricingCard = ({ title, price, features, isPopular, ctaText }) => {
  return (
    <div className={`relative bg-white dark:bg-primary-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isPopular ? 'border-2 border-accent-500' : 'border border-gray-200 dark:border-primary-700'}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-accent-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-4 text-primary-900 dark:text-white">{title}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold text-primary-900 dark:text-white">${price}</span>
          <span className="text-primary-600 dark:text-primary-400">/month</span>
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-primary-700 dark:text-primary-300">{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/signup"
          className={`block w-full py-3 px-4 text-center rounded-lg font-medium transition-colors ${
            isPopular
              ? 'bg-accent-500 hover:bg-accent-600 text-white'
              : 'bg-primary-100 hover:bg-primary-200 text-primary-800 dark:bg-primary-700 dark:hover:bg-primary-600 dark:text-primary-100'
          }`}
        >
          {ctaText || 'Get Started'}
        </Link>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const plan = {
    title: "LazyTrend Premium",
    price: 49.95,
    features: [
      "Daily trend analysis",
      "Personalized content recommendations",
      "Daily email updates",
      "Full dashboard access",
      "Performance analytics",
      "Optimized for your business",
      "7-day free trial"
    ],
    isPopular: true,
    ctaText: "Start Free Trial"
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-primary-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900 dark:text-white">Simple, Transparent Pricing</h2>
          <p className="text-xl text-primary-600 dark:text-primary-400 max-w-3xl mx-auto">
            One plan, everything you need for your content creation success.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <PricingCard
            title={plan.title}
            price={plan.price}
            features={plan.features}
            isPopular={plan.isPopular}
            ctaText={plan.ctaText}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
            Start with a 7-day free trial. Credit card required to prevent abuse, but you won't be charged until your trial ends. Cancel anytime during the trial period.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
