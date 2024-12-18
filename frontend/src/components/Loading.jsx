import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-teal-500 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loading;