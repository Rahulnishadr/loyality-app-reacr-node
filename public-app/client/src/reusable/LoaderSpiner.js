import React from "react";

const LoaderSpiner = ({ text, subtext }) => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-400 bg-opacity-75 z-[99999]">
        <div className="p-6 rounded text-center flex justify-center items-center flex-col">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-2xl" style={{ color: '#CD853F' }}>{text}</p>
          {subtext && <p className="mt-1 text-gray-800">{subtext}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoaderSpiner;
