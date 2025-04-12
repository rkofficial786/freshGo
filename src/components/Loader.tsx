import React from 'react';

const Loader = ({ children }) => {
  return (
    <div className="relative">
      {children}
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-filter backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default Loader;