
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const reference = query.get("reference");
  const movieTitle = query.get("movie");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
          Payment Successful! 🎉
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Your movie ticket has been booked successfully
        </p>

        {/* Booking Details */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-6">
          {movieTitle && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Movie:</span>
              <span className="font-semibold text-gray-800">{decodeURIComponent(movieTitle)}</span>
            </div>
          )}
          
          {reference && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-mono text-sm text-gray-800">{reference}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-gray-600">Status:</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Confirmed
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/user")}
            className="w-full py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
          >
            View My Bookings
          </button>
          
          <button
            onClick={() => navigate("/movies")}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
          >
            Book Another Movie
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default PaymentSuccess;