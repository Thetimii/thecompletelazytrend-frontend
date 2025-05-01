import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseService';
import { saveUserProfile, getUserProfile } from '../services/userService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        navigate('/');
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
            Sign in to your account
          </h2>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg" role="alert">
            <span className="block">{error}</span>
          </div>
        )}

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
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center pt-4 text-primary-600 dark:text-primary-400">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
