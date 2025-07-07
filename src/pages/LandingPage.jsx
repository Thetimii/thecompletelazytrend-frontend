import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';
import Footer from '../components/landing/Footer';
import DarkModeToggle from '../components/DarkModeToggle';

const LandingPage = () => {
  // Scroll to top when component mounts and track page view
  useEffect(() => {
    window.scrollTo(0, 0);

    // Track ViewContent event with Meta Pixel
    if (window.fbq) {
      fbq('track', 'ViewContent', {
        content_name: 'landing_page',
        content_category: 'homepage'
      });
    }
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-primary-900/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold gradient-text">LazyTrend</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-primary-700 dark:text-primary-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-primary-700 dark:text-primary-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors">How It Works</a>
            <a href="#pricing" className="text-primary-700 dark:text-primary-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors">Pricing</a>
            <a href="/blog-index.html" className="text-primary-700 dark:text-primary-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors">Blog</a>
            <a href="#faq" className="text-primary-700 dark:text-primary-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <Link to="/login" className="text-primary-700 dark:text-primary-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors">Login</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-accent-500 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Content Strategy?</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">Join thousands of content creators who are saving time and creating better content with LazyTrend.</p>
            <Link to="/signup" className="btn bg-white text-accent-600 hover:bg-gray-100 hover:text-accent-700 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Start Your Free Trial
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
