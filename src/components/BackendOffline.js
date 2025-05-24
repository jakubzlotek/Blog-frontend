import React from 'react';
import { FaPlug } from 'react-icons/fa';

function BackendOffline() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col items-center border border-purple-100 rounded-3xl shadow-2xl px-14 py-12 bg-white">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-50 mb-6 shadow-md">
          <FaPlug className="text-purple-300 text-5xl" />
        </div>
        <h2 className="text-3xl font-extrabold text-purple-700 mb-2 text-center tracking-tight drop-shadow-sm">
          Service Unavailable
        </h2>
        <p className="text-gray-500 text-base text-center font-medium italic">
          Our API is taking a quick snack break.<br />Hang tight, it’ll be back soon!
        </p>
      </div>
    </div>
  );
}

export default BackendOffline;