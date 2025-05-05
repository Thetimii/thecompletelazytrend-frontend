import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseService';
import { saveUserProfile } from '../services/userService';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Signup successful:", data);

      if (data.user) {
        // Create a user record in the users table
        try {
          await saveUserProfile({
            auth_id: data.user.id,
            email: data.user.email,
            created_at: new Date().toISOString(),
            onboarding_completed: false
          });
          console.log("User profile created successfully");
        } catch (profileError) {
          console.error("Error creating user profile:", profileError);
          // Continue with signup flow even if profile creation fails
          // The user can complete their profile during onboarding
        }

        setSuccess(true);

        // Check if email confirmation is required
        if (data.session) {
          // User is automatically signed in, redirect to onboarding
          setTimeout(() => {
            navigate('/onboarding');
          }, 1500);
        } else {
          // Email confirmation required
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } else {
        // Email confirmation required
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-primary-50 dark:bg-primary-950 fixed inset-0">
      <div className="max-w-md w-full bg-white dark:bg-primary-900 p-10 rounded-xl shadow-xl border border-primary-100 dark:border-primary-800 m-4 overflow-y-auto max-h-[90vh]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">LazyTrend</h1>
          <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100">
            Create your account
          </h2>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg" role="alert">
            <span className="block">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg" role="alert">
            <span className="block">
              Registration successful! Please check your email for confirmation.
              You will be redirected to the login page shortly.
            </span>
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
                autoComplete="new-password"
                required
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || success}
              className="btn btn-primary w-full py-3 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </>
              ) : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-center pt-4 text-primary-600 dark:text-primary-400">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
