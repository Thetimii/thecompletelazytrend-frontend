import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-primary-700 py-5">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-primary-900 dark:text-white">{question}</h3>
        <svg
          className={`w-5 h-5 text-accent-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        className={`mt-2 text-primary-600 dark:text-primary-400 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="pb-4">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How does LazyTrend find trending content?",
      answer: "LazyTrend uses advanced algorithms to scan and analyze TikTok content in your specific niche. We identify patterns in engagement metrics, content themes, and audience responses to determine what's trending and likely to perform well."
    },
    {
      question: "Do I need a TikTok account to use LazyTrend?",
      answer: "No, you don't need a TikTok account to use LazyTrend. Our platform does all the research for you, so you can get insights even if you're not active on TikTok yet."
    },
    {
      question: "How often will I receive new trend insights?",
      answer: "Depending on your plan, you'll receive trend insights weekly or daily. You can also customize your email notification schedule to receive updates when it's most convenient for you."
    },
    {
      question: "Can I use LazyTrend for multiple niches or businesses?",
      answer: "Yes! Our Business plan allows you to track multiple niches or businesses. For Basic and Pro plans, you can change your niche focus at any time from your dashboard settings."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a 7-day free trial so you can test LazyTrend before committing. If you're not satisfied after subscribing, we offer a 30-day money-back guarantee. Simply contact our support team."
    },
    {
      question: "Can LazyTrend help with other social platforms besides TikTok?",
      answer: "Currently, LazyTrend focuses on TikTok as it's one of the most dynamic platforms for trending content. We're working on expanding to other platforms in the future."
    },
    {
      question: "How customizable are the content recommendations?",
      answer: "Very customizable! When you set up your account, you'll provide details about your business and content goals. Our system uses this information to tailor recommendations specifically to your needs and audience."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-primary-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xl text-primary-600 dark:text-primary-400 max-w-3xl mx-auto">
            Everything you need to know about LazyTrend.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-primary-700 dark:text-primary-300 mb-4">Still have questions?</p>
          <a 
            href="mailto:support@lazy-trends.com" 
            className="text-accent-500 hover:text-accent-600 font-medium"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
