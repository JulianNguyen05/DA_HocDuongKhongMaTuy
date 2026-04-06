"use client";

export default function PortraitLock() {
  return (
    <>
      <div className="portrait-lock absolute inset-0 z-[150] bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center touch-none">
        <div className="animate-spin duration-1000 mb-6">
          <svg
            className="w-20 h-20 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-blue-400">
          Vui lòng xoay ngang!
        </h2>
        <p className="text-gray-300 text-lg">
          Trải nghiệm game tốt nhất ở màn hình ngang.
        </p>
      </div>
      <style>{`
        @media (orientation: landscape) { .portrait-lock { display: none !important; } }
      `}</style>
    </>
  );
}
