"use client";

import { STAGE_PLATFORMS } from "@/lib/constants/gameConstants";

interface ParkourGameProps {
  visualStageIdx: number;
  parkourX: number;
  parkourY: number;
  facingRight: boolean;
  walkStep: boolean;
  isNearChest: boolean;
  currentQuestionIdx: number;
  totalQuestionsInStage: number;
  onMobileInput: (
    btn: "left" | "right" | "jump" | "open",
    active: boolean,
  ) => void;
}

export default function ParkourGame({
  visualStageIdx,
  parkourX,
  parkourY,
  facingRight,
  walkStep,
  isNearChest,
  currentQuestionIdx,
  totalQuestionsInStage,
  onMobileInput,
}: ParkourGameProps) {
  // Lấy bệ đỡ cuối cùng của chặng để xác định rương nằm ở đâu
  const currentPlatforms =
    STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1];
  const lastPlat = currentPlatforms.slice(-1)[0];

  return (
    <>
      <img
        src={`/images/game/ingame-map${Math.max(1, visualStageIdx)}.png`}
        onError={(e) => (e.currentTarget.src = "/images/game/ingame-map1.png")}
        alt={`Bản đồ Ingame chặng ${visualStageIdx}`}
        className={`w-full h-full ${visualStageIdx === 4 || visualStageIdx === 5 ? "object-fill" : "object-cover"} transition-all duration-300`}
      />

      <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg font-bold text-sm md:text-base hidden md:block z-30">
        ⌨️ Dùng [A/D] di chuyển, [W/Space] Nhảy, [E] Nhặt đồ
      </div>

      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-blue-600/90 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-base font-bold shadow-lg z-30 pointer-events-none">
        Câu: {currentQuestionIdx + 1} / {totalQuestionsInStage}
      </div>

      

      {/* NHÂN VẬT PARKOUR */}
      <div
        className="absolute w-[50px] md:w-[80px] h-[70px] md:h-[100px] will-change-[bottom,left] z-20 pointer-events-none"
        style={{ bottom: `${parkourY}%`, left: `${parkourX}%` }}
      >
        <img
          src={
            walkStep ? "/images/game/walking.png" : "/images/game/5hearts.png"
          }
          alt="Nhân vật Parkour"
          className="absolute bottom-0 left-1/2 drop-shadow-xl max-w-none h-full w-auto"
          style={{
            transform: facingRight
              ? "translateX(-50%) scaleX(1)"
              : "translateX(-50%) scaleX(-1)",
            transformOrigin: "bottom center",
          }}
        />
      </div>

      {/* TOOLTIP HIỆN NÚT [E] KHI ĐỨNG GẦN RƯƠNG (PC) */}
      {isNearChest && lastPlat && (
        <div
          className="absolute transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 md:px-4 md:py-2 rounded-xl text-xs md:text-base font-bold animate-pulse shadow-lg whitespace-nowrap border-2 border-yellow-600 z-30 hidden md:block pointer-events-none"
          style={{
            bottom: `${lastPlat.bottom + 20}%`,
            left: `${lastPlat.left + lastPlat.width / 2}%`,
          }}
        >
          <span>Nhấn [E] để nhặt đồ!</span>
        </div>
      )}

      {/* GAMEPAD CHO MOBILE */}
      <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-end z-[60] pointer-events-none">
        <div className="flex gap-1 md:gap-2 pointer-events-auto">
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onMobileInput("left", true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onMobileInput("left", false);
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              onMobileInput("left", false);
            }}
            className="w-14 h-14 bg-black/50 backdrop-blur-md rounded-full text-white/80 text-xl font-bold flex items-center justify-center active:bg-black/80 active:scale-95 border border-white/20 shadow-lg select-none outline-none"
          >
            ◀
          </button>
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onMobileInput("right", true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onMobileInput("right", false);
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              onMobileInput("right", false);
            }}
            className="w-14 h-14 bg-black/50 backdrop-blur-md rounded-full text-white/80 text-xl font-bold flex items-center justify-center active:bg-black/80 active:scale-95 border border-white/20 shadow-lg select-none outline-none"
          >
            ▶
          </button>
        </div>

        <div className="flex gap-2 items-end pointer-events-auto">
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onMobileInput("open", true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onMobileInput("open", false);
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              onMobileInput("open", false);
            }}
            className={`w-12 h-12 rounded-full text-[10px] font-black flex items-center justify-center shadow-lg transition-all duration-200 border-2 active:scale-95 select-none outline-none
              ${isNearChest ? "bg-yellow-400 text-yellow-900 border-yellow-200 scale-110 animate-pulse" : "bg-gray-800/60 backdrop-blur-md text-gray-400 border-gray-600/50"}`}
          >
            NHẶT
          </button>
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onMobileInput("jump", true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onMobileInput("jump", false);
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              onMobileInput("jump", false);
            }}
            className="w-16 h-16 bg-blue-500/80 backdrop-blur-md text-white rounded-full text-xs font-black flex items-center justify-center active:bg-blue-700 active:scale-95 border-2 border-blue-300 shadow-lg mb-2 select-none outline-none"
          >
            NHẢY
          </button>
        </div>
      </div>
    </>
  );
}
