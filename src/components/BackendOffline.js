import React from 'react';

function BackendOffline() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <img
        src="/offline.jpg"
        alt="Backend Offline"
        className="w-1/3 max-w-sm rounded-xl shadow-2xl"
      />
      <h1 className="text-3xl font-extrabold text-gray-800 mt-6 text-center">
        Oops! Could not establish a handshake with the API. <br />
        The cats are negotiating terms.
      </h1>
      <p className="text-lg text-gray-600 mt-4 text-center">
        Don’t worry, they’ll figure it out soon. Please check back later!
      </p>
    </div>
  );
}

export default BackendOffline;