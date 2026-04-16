"use client";

import { useState, useEffect, useRef } from "react";
import { STAGE_PLATFORMS, STAGE_OBSTACLES, OBSTACLE_IMAGE_MAP } from "@/lib/constants/gameConstants";

interface ParkourGameProps {
  visualStageIdx: number;
  parkourX: number;
  parkourY: number;
  facingRight: boolean;
  walkStep: boolean;
  isJumping: boolean;
  isNearChest: boolean;
  nearTrashId?: number | null;
  openedTrashIds?: Set<number>;
  trashRewardMsg?: { label: string; effect: number } | null;
  currentQuestionIdx: number;
  totalQuestionsInStage: number;
  hearts: number;
  damageAnim: boolean;
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
  isJumping,
  isNearChest,
  nearTrashId,
  openedTrashIds,
  trashRewardMsg,
  currentQuestionIdx,
  totalQuestionsInStage,
  hearts,
  damageAnim,
  onMobileInput,
}: ParkourGameProps) {
  // Lấy bệ đỡ cuối cùng của chặng để xác định rương nằm ở đâu
  const currentPlatforms =
    STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1];
  const lastPlat = currentPlatforms.slice(-1)[0];

  // Lấy danh sách vật cản của chặng hiện tại
  const currentObstacles = STAGE_OBSTACLES[Math.max(1, visualStageIdx)] || [];

  // State cho hiệu ứng trái tim vỡ (dùng counter để animation luôn chạy lại)
  const [heartBreakKey, setHeartBreakKey] = useState(0);
  const [showHeartBreak, setShowHeartBreak] = useState(false);
  const prevHeartsRef = useRef(hearts);

  useEffect(() => {
    if (hearts < prevHeartsRef.current) {
      // Tăng key để React remount element → animation chạy lại từ đầu
      setHeartBreakKey((k) => k + 1);
      setShowHeartBreak(true);
      const timer = setTimeout(() => setShowHeartBreak(false), 1200);
      prevHeartsRef.current = hearts;
      return () => clearTimeout(timer);
    }
    prevHeartsRef.current = hearts;
  }, [hearts]);

  return (
    <>
      <img
        src={`/images/game/ingame-map${Math.max(1, visualStageIdx)}.png`}
        onError={(e) => (e.currentTarget.src = "/images/game/ingame-map1.png")}
        alt={`Bản đồ Ingame chặng ${visualStageIdx}`}
        className="w-full h-full object-fill transition-all duration-300"
      />

      <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg font-bold text-sm md:text-base hidden md:block z-30">
        ⌨️ Dùng [A/D] di chuyển, [W/Space] Nhảy, [E] Mở Rương
      </div>

      <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 bg-blue-600/90 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-base font-bold shadow-lg z-30 pointer-events-none">
        Câu: {currentQuestionIdx + 1} / {totalQuestionsInStage}
      </div>

      {/* ❤️ HEARTS HUD - Góc trên bên phải */}
      <div className="absolute top-2 md:top-4 right-14 md:right-48 flex items-center gap-1 z-30 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-lg md:text-2xl transition-all duration-300 ${i < hearts
              ? "opacity-100 scale-100"
              : "opacity-30 scale-75 grayscale"
              }`}
          >
            {i < hearts ? "❤️" : "🖤"}
          </span>
        ))}
      </div>

      {/* 💔 HIỆU ỨNG TRÁI TIM VỠ - Xuất hiện khi bị trừ máu */}
      {showHeartBreak && (
        <div key={heartBreakKey} className="absolute top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          {/* Mảnh trái tim trái */}
          <div
            className="absolute text-4xl md:text-6xl"
            style={{
              animation: "heartBreakLeft 1s ease-out forwards",
            }}
          >
            💔
          </div>
          {/* Mảnh trái tim phải */}
          <div
            className="absolute text-4xl md:text-6xl"
            style={{
              animation: "heartBreakRight 1s ease-out forwards",
            }}
          >
            💔
          </div>
          {/* Text -1 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-red-500 font-black text-2xl md:text-4xl"
            style={{
              animation: "heartMinusOne 1s ease-out forwards",
              textShadow: "0 0 10px rgba(220,38,38,0.8), 0 0 20px rgba(220,38,38,0.5)",
            }}
          >
            -1
          </div>
        </div>
      )}

      {/* CSS Animations cho hiệu ứng trái tim vỡ */}
      <style>{`
        @keyframes heartBreakLeft {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          30% { transform: translate(-15px, -10px) rotate(-15deg) scale(1.3); opacity: 1; }
          100% { transform: translate(-40px, 60px) rotate(-45deg) scale(0.4); opacity: 0; }
        }
        @keyframes heartBreakRight {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          30% { transform: translate(15px, -10px) rotate(15deg) scale(1.3); opacity: 1; }
          100% { transform: translate(40px, 60px) rotate(45deg) scale(0.4); opacity: 0; }
        }
        @keyframes heartMinusOne {
          0% { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
          20% { transform: translate(-50%, -20px) scale(1.5); opacity: 1; }
          60% { transform: translate(-50%, -40px) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -80px) scale(0.8); opacity: 0; }
        }
      `}</style>

      {/* 🎁 HỘP QUÀ - Ẩn đi */}
      {/* lastPlat && (
        <div
          className={`absolute z-15 pointer-events-none transition-transform duration-300 ${
            isNearChest ? "scale-110 animate-bounce" : "scale-100"
          }`}
          style={{
            left: `${lastPlat.left + lastPlat.width / 2 - 3}%`,
            bottom: `${lastPlat.bottom + lastPlat.height}%`,
            width: "6%",
            height: "10%",
          }}
        >
          <img
            src="/images/game/git.png"
            alt="Hộp quà"
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]"
          />
        </div>
      ) */}

      {/* =========================================
         HIỂN THỊ HITBOX MẶT ĐẤT (DEBUG) 
         ========================================= */}
      {currentPlatforms.map((plat, index) => (
        <div
          key={index}
          className="absolute bg-red-500/40 border-2 border-red-600 flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold pointer-events-none z-10 whitespace-nowrap text-center"
          style={{
            left: `${plat.left}%`,
            bottom: `${plat.bottom}%`,
            width: `${plat.width}%`,
            height: `${plat.height}%`,
          }}
        >
          ID:{plat.id}
          <br />
          L:{plat.left} B:{plat.bottom}
          <br />
          W:{plat.width} H:{plat.height}
        </div>
      ))}

      {/* VẬT CẢN (OBSTACLES) + DEBUG HITBOX */}
      {currentObstacles.map((obs) => (
        <div
          key={obs.id}
          className="absolute z-10 pointer-events-none"
          style={{
            left: `${obs.left}%`,
            bottom: `${obs.bottom}%`,
            width: `${obs.width}%`,
            height: `${obs.height}%`,
          }}
        >
          <img
            src={OBSTACLE_IMAGE_MAP[obs.type] || "/images/game/canxa.png"}
            alt={`Vật cản ${obs.type}`}
            className="w-full h-full object-contain drop-shadow-lg"
            style={{ imageRendering: "auto" }}
          />
          {/* DEBUG: Viền + tọa độ vật cản */}
          <div className="absolute inset-0 border-2 border-yellow-400 bg-yellow-400/20 flex flex-col items-center justify-end">
            <span className="text-[7px] md:text-[10px] text-yellow-200 font-bold bg-black/70 px-1 rounded whitespace-nowrap">
              {obs.type}
            </span>
            <span className="text-[6px] md:text-[9px] text-yellow-100 bg-black/70 px-1 rounded whitespace-nowrap">
              ID:{obs.id} L:{obs.left} B:{obs.bottom}
              <br />
              W:{obs.width} H:{obs.height}
            </span>
          </div>
        </div>
      ))}

      {/* NHÂN VẬT PARKOUR */}
      <div
        className="absolute w-[25px] md:w-[80px] h-[35px] md:h-[100px] will-change-[bottom,left] z-20 pointer-events-none"
        style={{ bottom: `${parkourY}%`, left: `${parkourX}%` }}
      >
        <img
          src={
            isJumping
              ? "/images/game/walking.png"
              : walkStep
                ? "/images/game/walking.png"
                : "/images/game/5hearts.png"
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
        {/* DEBUG: Hitbox nhân vật */}
        {/* <div className="absolute inset-0 border-2 border-green-400 bg-green-400/20 flex items-end justify-center">
          <span className="text-[6px] md:text-[9px] text-green-200 font-bold bg-black/80 px-1 rounded whitespace-nowrap">
            X:{parkourX.toFixed(1)} Y:{parkourY.toFixed(1)}
          </span>
        </div> */}
      </div>

      {/* TOOLTIP HIỆN NÚT [E] KHU VỰC CUỐI MAP ĐỂ MỞ HỘP QUÀ ẨN */}
      {isNearChest && (
        <div
          className="absolute transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 md:px-4 md:py-2 rounded-xl text-xs md:text-base font-bold animate-pulse shadow-lg whitespace-nowrap border-2 border-yellow-600 z-30 hidden md:block pointer-events-none"
          style={{
            bottom: `${parkourY + 20}%`, // Hiện tooltip trên đầu nhân vật
            left: `${parkourX}%`,
          }}
        >
          <span>Nhấn [E] lấy quà!</span>
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

        <div className="flex flex-col gap-3 items-center pointer-events-auto">
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
            Mở
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
