import React from 'react';

export default function LoaderSpiner({ text = 'Loading...' }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 z-50"
      aria-label="Loading"
    >
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      {text && <p className="mt-3 text-gray-700 font-medium">{text}</p>}
    </div>
  );
}
