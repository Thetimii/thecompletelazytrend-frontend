import React, { useState, useEffect } from 'react';
import { runCompleteWorkflow } from '../services/workflowService';
import { useAuth } from '../context/AuthContext';

const WorkflowButton = ({ onComplete }) => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [businessDescription, setBusinessDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState(null);

  // Pre-fill business description from user profile when available
  useEffect(() => {
    if (userProfile?.business_description) {
      setBusinessDescription(userProfile.business_description);
    }
  }, [userProfile]);

  const handleRunWorkflow = async (e) => {
    e.preventDefault();

    if (!businessDescription) {
      setError('Please enter a business description');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await runCompleteWorkflow(
        businessDescription,
        user?.id,
        1 // Just 1 video per query for testing
      );

      // Track Lead event with Meta Pixel when user generates content ideas
      if (window.fbq) {
        fbq('track', 'Lead', {
          content_name: 'content_ideas_generation',
          content_category: 'workflow'
        });
      }

      setResult(response);

      if (onComplete) {
        onComplete(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to run workflow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {showForm ? 'Hide Form' : 'Generate TikTok Content Ideas'}
      </button>

      {showForm && (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Generate Content Ideas</h3>

          <form onSubmit={handleRunWorkflow}>
            <div className="mb-4">
              <label htmlFor="businessDescription" className="block text-gray-700 text-sm font-bold mb-2">
                Business Description
              </label>
              <textarea
                id="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="Describe your business (e.g., 'A vegan restaurant specializing in plant-based comfort food')"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Run Workflow'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
              <p>Processing your request. This may take a few minutes...</p>
            </div>
          )}

          {result && (
            <div className="mt-4">
              <h4 className="font-semibold text-green-600">Workflow completed successfully!</h4>
              <div className="mt-2 bg-green-50 p-4 rounded">
                <p><strong>Search Queries Generated:</strong> {result.data.searchQueries.length}</p>
                <p><strong>Videos Analyzed:</strong> {result.data.videosCount}</p>
                <p><strong>Marketing Strategy Created:</strong> Yes</p>
                <p className="mt-2 text-sm text-gray-600">Refresh the dashboard to see your new content!</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowButton;
