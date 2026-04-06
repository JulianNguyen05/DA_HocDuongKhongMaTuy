"use client";

interface StageReadyPopupProps {
  stageName?: string;
  onStart: () => void;
}

export default function StageReadyPopup({
  stageName,
  onStart,
}: StageReadyPopupProps) {
  return (
    <div className="absolute inset-0 z-30 bg-black/50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-all">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
          {stageName || "Chặng Bí Ẩn"}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          Sẵn sàng khám phá chưa?
        </p>
        <button
          onClick={onStart}
          className="px-6 md:px-8 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-lg md:text-xl rounded-full shadow-lg transition-colors outline-none focus:outline-none"
        >
          ▶ BẮT ĐẦU
        </button>
      </div>
    </div>
  );
}
