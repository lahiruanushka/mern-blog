import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <h2 className="mt-4 text-2xl text-gray-600">Page Not Found</h2>
        <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
        <a 
          href="/" 
          className="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}

export default NotFoundPage;