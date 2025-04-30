import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Cancelled</h1>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>Your payment was cancelled. No charges were made.</p>
        </div>
        
        <div className="text-center">
          <p className="mb-6">You can try again whenever you're ready.</p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => navigate('/payment')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Try Again
            </button>
            
            <button 
              onClick={() => navigate('/onboarding')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to Onboarding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
