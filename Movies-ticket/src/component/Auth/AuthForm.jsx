import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ onSubmit, isAdmin }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inputs, signup: isAdmin ? false : isSignup });
  };


  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 relative">
        <div className="flex justify-end p-4">
         
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isSignup ? "Signup" : "Login"}
        </h2>
        
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {!isAdmin && isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#2b2d42] text-white py-3 rounded-full hover:bg-[#1f2130] transition-colors font-medium mt-4"
            >
              {isSignup ? "Signup" : "Login"}
            </button>
            
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Switch To {isSignup ? "Login" : "Signup"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;