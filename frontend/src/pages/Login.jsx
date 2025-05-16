import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseService';
import { saveUserProfile, getUserProfile } from '../services/userService';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      setResetSent(true);
      toast.success('Password reset link sent to your email');
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || 'Failed to send reset password email');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isResetMode) {
      await handleResetPassword(e);
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Login successful:", data);

      // Check if user has a profile, if not create one
      if (data.user) {
        try {
          const userProfile = await getUserProfile(data.user.id);

          if (!userProfile) {
            // Create a basic user profile if one doesn't exist
            await saveUserProfile({
              auth_id: data.user.id,
              email: data.user.email,
              created_at: new Date().toISOString(),
              onboarding_completed: false
            });
            console.log("Created user profile during login");
          }
        } catch (profileError) {
          console.error("Error checking/creating user profile:", profileError);
          // Continue with login flow even if profile check fails
        }
      }

      // Force a small delay to ensure the auth state is updated
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-primary-50 dark:bg-primary-950 fixed inset-0">
      <div className="max-w-md w-full bg-white dark:bg-primary-900 p-10 rounded-xl shadow-xl border border-primary-100 dark:border-primary-800 m-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">LazyTrend</h1>
          <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100">
            {isResetMode ? 'Reset your password' : 'Sign in to your account'}
          </h2>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg" role="alert">
            <span className="block">{error}</span>
          </div>
        )}

        {resetSent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-100">Check Your Email</h3>
            <p className="text-primary-600 dark:text-primary-400 mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <button
              onClick={() => {
                setIsResetMode(false);
                setResetSent(false);
              }}
              className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium"
            >
              Return to login
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {!isResetMode && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isResetMode ? 'Sending...' : 'Signing in...'}
                  </>
                ) : isResetMode ? 'Send Reset Link' : 'Sign in'}
              </button>
            </div>

            <div className="text-sm text-center pt-4 text-primary-600 dark:text-primary-400">
              {isResetMode ? (
                <p>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setIsResetMode(false)}
                    className="font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300"
                  >
                    Back to login
                  </button>
                </p>
              ) : (
                <>
                  <p className="mb-2">
                    <button
                      type="button"
                      onClick={() => setIsResetMode(true)}
                      className="font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300"
                    >
                      Forgot your password?
                    </button>
                  </p>
                  <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300">
                      Sign up
                    </Link>
                  </p>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
