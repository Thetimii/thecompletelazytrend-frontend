import React from 'react';

const StepCard = ({ number, title, description, isLast }) => {
  return (
    <div className="relative">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-6">
          <div className="w-12 h-12 rounded-full bg-accent-500 text-white flex items-center justify-center text-xl font-bold">
            {number}
          </div>
          {!isLast && (
            <div className="absolute top-12 left-6 w-0.5 h-full bg-accent-200 dark:bg-accent-800 -ml-0.5"></div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-primary-900 dark:text-white">{title}</h3>
          <p className="text-primary-600 dark:text-primary-400 mb-8">{description}</p>
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Sign Up & Tell Us About Your Business",
      description: "Create your account and tell us about your business or content niche so we can find the most relevant trends for you."
    },
    {
      number: 2,
      title: "We Analyze Trending Content",
      description: "Our system automatically searches for and analyzes trending TikTok content in your specific niche."
    },
    {
      number: 3,
      title: "Receive Personalized Recommendations",
      description: "Get tailored content ideas and insights based on what's currently trending and performing well."
    },
    {
      number: 4,
      title: "Create Better Content, Faster",
      description: "Use our recommendations to create content that resonates with your audience and stays ahead of trends."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-primary-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900 dark:text-white">How LazyTrend Works</h2>
          <p className="text-xl text-primary-600 dark:text-primary-400 max-w-3xl mx-auto">
            Our simple process helps you discover trends and create better content with minimal effort.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block p-6 bg-accent-50 dark:bg-accent-900/20 rounded-lg border-l-4 border-accent-500">
            <p className="text-primary-700 dark:text-primary-300 text-lg">
              <span className="font-bold">The best part?</span> Once set up, LazyTrend works automatically in the background, 
              saving you hours of research time every week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
