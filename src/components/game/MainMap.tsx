"use client";

import { MAP_COORDINATES } from "@/lib/constants/gameConstants";

interface MainMapProps {
  charPos: { top: string; left: string };
  moveDuration: string;
  isMoving: boolean;
  mainWalkStep: boolean;
  visualStageIdx: number;
  hasStarted: boolean;
  toastMsg: string;
  onNodeClick: (idx: number) => void;
  onStart: () => void;
}

export default function MainMap({
  charPos,
  moveDuration,
  isMoving,
  mainWalkStep,
  visualStageIdx,
  hasStarted,
  toastMsg,
  onNodeClick,
  onStart,
}: MainMapProps) {
  return (
    <>
      <img
        src="/images/game/game-map.png"
        alt="Bản đồ chính"
        className="w-full h-full object-cover block absolute inset-0 z-0"
      />

      {/* TOAST THÔNG BÁO LỖI */}
      {toastMsg && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-xl z-[70] animate-bounce whitespace-nowrap">
          ⚠️ {toastMsg}
        </div>
      )}

      {/* NHÂN VẬT ĐI BỘ TRÊN MAP LỚN */}
      <div
        className="absolute z-10"
        style={{
          top: charPos.top,
          left: charPos.left,
          transitionProperty: "top, left",
          transitionDuration: moveDuration,
          transitionTimingFunction: "linear",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={
            isMoving && mainWalkStep
              ? "/images/game/walking.png"
              : "/images/game/5hearts.png"
          }
          alt="Nhân vật Map Lớn"
          className="h-[40px] md:h-[60px] w-auto"
        />
      </div>

      {/* CÁC ĐIỂM CHẶNG (RƯƠNG) TRên BẢN ĐỒ */}
      {hasStarted &&
        MAP_COORDINATES.map((pos, idx) => {
          if (idx === 0) return null; // Bỏ qua vị trí 0 (chỗ xuất phát)
          const isCompleted = idx < visualStageIdx;
          const isActive = idx === visualStageIdx;
          const isLocked = idx > visualStageIdx;

          return (
            <div
              key={idx}
              onClick={() => onNodeClick(idx)}
              style={{
                top: pos.top,
                left: pos.left,
                transform: "translate(-50%, -50%)",
              }}
              className={`absolute z-20 cursor-pointer w-20 h-20 md:w-28 md:h-28 flex items-center justify-center transition-transform duration-300
              ${isLocked ? "grayscale opacity-60 scale-90" : "opacity-100"}
              ${isActive ? "scale-110 hover:scale-115" : "hover:scale-105"}
            `}
            >
              <img
                src={
                  isCompleted
                    ? "/images/game/open_chest.png"
                    : "/images/game/closed_chest.png"
                }
                alt={isCompleted ? "Rương mở" : "Rương đóng"}
                className="w-full h-full object-contain drop-shadow-md transition-transform duration-300"
              />
              {isActive && (
                <div className="absolute -top-6 md:-top-10 bg-yellow-400 text-yellow-900 text-[10px] md:text-sm font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full whitespace-nowrap animate-pulse shadow-lg border-2 border-yellow-500">
                  Nhấn để vào
                </div>
              )}
            </div>
          );
        })}

      {/* NÚT BẮT ĐẦU */}
      {!hasStarted && (
        <div className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center">
          <button
            onClick={onStart}
            className="px-6 md:px-8 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-xl md:text-2xl rounded-full shadow-xl transform hover:scale-110 transition-transform border-4 border-yellow-600 animate-pulse outline-none focus:outline-none"
          >
            🚀 KHỞI HÀNH
          </button>
        </div>
      )}
    </>
  );
}