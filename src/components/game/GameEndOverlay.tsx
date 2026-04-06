"use client";

interface GameEndOverlayProps {
  gameState: "WON" | "LOST";
  onRestart: () => void;
}

export default function GameEndOverlay({
  gameState,
  onRestart,
}: GameEndOverlayProps) {
  const isWon = gameState === "WON";

  return (
    <div className="absolute inset-0 z-[120] bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
      <video
        src={isWon ? "/video/good-ending.mp4" : "/video/bad-ending.mp4"}
        autoPlay
        playsInline
        className={`absolute inset-0 w-full h-full object-cover z-0 ${isWon ? "opacity-90" : "opacity-80"}`}
      />
      <div className="relative z-10 flex flex-col items-center mb-6 md:mb-12 text-center">
        <button
          onClick={onRestart}
          className={`px-6 py-2 md:px-8 md:py-3 font-bold text-base md:text-lg rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 outline-none transition-all ${
            isWon
              ? "bg-white text-blue-900 hover:bg-gray-200"
              : "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:bg-red-700"
          }`}
        >
          {isWon ? "🔄 Chơi lại" : "🔄 Chơi lại từ đầu"}
        </button>
      </div>
    </div>
  );
}
