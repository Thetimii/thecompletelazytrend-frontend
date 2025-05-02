import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';

const About = () => {
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-accent-500 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About LazyTrend</h1>
          <p className="text-xl max-w-3xl mx-auto">
            I'm on a mission to help content creators save time and create better content by leveraging the power of trend analysis.
          </p>
        </div>
      </section>

      {/* My Story */}
      <section className="py-16 bg-white dark:bg-primary-950">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-primary-900 dark:text-white">My Story</h2>
            <div className="prose prose-lg max-w-none text-primary-700 dark:text-primary-300">
              <p>
                LazyTrend was born out of frustration. As a learning marketer myself, I spent countless hours scrolling through TikTok, trying to identify trends and patterns that could inform content strategy. It was time-consuming, inefficient, and frankly, exhausting.
              </p>
              <p>
                I knew there had to be a better way. So, I built LazyTrend – a platform that automatically analyzes trending content on TikTok and provides personalized recommendations based on what's working in your specific niche.
              </p>
              <p>
                My mission is simple: to make trend discovery effortless so you can focus on what you do best – creating amazing content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* My Values */}
      <section className="py-16 bg-gray-50 dark:bg-primary-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-primary-900 dark:text-white">My Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-primary-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-4 text-accent-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-900 dark:text-white">Efficiency</h3>
                <p className="text-primary-600 dark:text-primary-400">
                  I believe your time is valuable. This platform is designed to save you hours of research so you can focus on creating.
                </p>
              </div>

              <div className="bg-white dark:bg-primary-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-4 text-accent-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-900 dark:text-white">Innovation</h3>
                <p className="text-primary-600 dark:text-primary-400">
                  I'm constantly improving the algorithms and adding new features to provide you with the most accurate trend insights.
                </p>
              </div>

              <div className="bg-white dark:bg-primary-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-4 text-accent-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-900 dark:text-white">Simplicity</h3>
                <p className="text-primary-600 dark:text-primary-400">
                  I believe in keeping things simple and straightforward. LazyTrend is designed to be intuitive and easy to use, without unnecessary complexity.
                </p>
              </div>

              <div className="bg-white dark:bg-primary-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-4 text-accent-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-900 dark:text-white">Trust</h3>
                <p className="text-primary-600 dark:text-primary-400">
                  I'm committed to providing reliable, actionable insights that you can trust to inform your content strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Creator */}
      <section className="py-16 bg-white dark:bg-primary-950">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-primary-900 dark:text-white">About the Creator</h2>

            <div className="flex flex-col items-center">
              <div className="text-center max-w-md">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-primary-800 mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-accent-500">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 text-primary-900 dark:text-white">Tim Sager</h3>
                <p className="text-accent-500 mb-4">Founder & Developer</p>
                <p className="text-primary-600 dark:text-primary-400">
                  I'm a marketer and developer with a passion for automation and data-driven content creation. I built LazyTrend to solve my own frustrations with trend discovery, and now I'm excited to share it with other content creators who want to save time and create more effective content.
                </p>
                <p className="text-primary-600 dark:text-primary-400 mt-4">
                  With a background in both marketing and software development, I bring a unique perspective to content strategy and trend analysis. LazyTrend represents my vision for making data-driven content creation accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Content Strategy?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Start saving time and creating better content with LazyTrend's powerful trend analysis tools.
          </p>
          <Link to="/signup" className="btn bg-white text-accent-600 hover:bg-gray-100 hover:text-accent-700 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
