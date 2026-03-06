import React from "react";

const LoadingBox = () => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-title"
      aria-describedby="access-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20 animate-pulse">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3
            id="access-title"
            className="text-balance text-xl font-semibold text-white"
          >
            Access Restricted
          </h3>
          <p id="access-desc" className="mt-2 text-sm leading-6 text-gray-300">
            You need to log in to access this page.
          </p>
          <div className="mt-2">
            <p className="mt-3 text-xs text-gray-400">
              Quick tip: Only admins has the access to this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingBox;
