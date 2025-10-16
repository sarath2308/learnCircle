import React from "react";

export function Rejected({ reason }: { reason: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
          <svg
            className="w-7 h-7 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2 text-red-600">Application Rejected</h2>
        <p className="text-gray-600 mb-6">{reason}</p>

        {/* Info note */}
        <p className="text-gray-500 text-sm">
          Please review the feedback above and try submitting again.
        </p>
      </div>
    </div>
  );
}
