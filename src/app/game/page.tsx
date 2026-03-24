"use client";

import { useState, useEffect, useRef } from "react";
import { useGameController } from "../../controllers/gameController";

// --- DANH SÁCH TỌA ĐỘ CÁC CHẶNG (BẢN ĐỒ LỚN) ---
const MAP_COORDINATES = [
  { top: "65%", left: "11%" }, // 0: BẮT ĐẦU
  { top: "54%", left: "24%" }, // 1: CHẶNG 1
  { top: "20%", left: "31%" }, // 2: CHẶNG 2
  { top: "25%", left: "44%" }, // 3: CHẶNG 3
  { top: "57%", left: "50%" }, // 4: CHẶNG 4
  { top: "25%", left: "73%" }, // 5: CHẶNG 5
];

const STAGE_PATHS: Record<number, { left: string, top: string }[]> = {
  1: [{ left: "11%", top: "65%" }, { left: "20%", top: "63%" }],
  2: [{ left: "20%", top: "32%" }, { left: "20%", top: "31%" }],
  3: [
    { left: "26%", top: "28%" },
    { left: "29%", top: "29%" },
    { left: "29%", top: "51%" },
    { left: "41%", top: "51%" },
    { left: "41%", top: "29%" },
  ],
  4: [{ left: "52%", top: "29%" }, { left: "52%", top: "50%" },{ left: "57%", top: "50%" }],
  5: [{ left: "66%", top: "51%" }, { left: "66%", top: "25%" }, { left: "73%", top: "25%" }],
};

type ViewMode = "MAIN_MAP" | "STAGE_READY" | "MINI_GAME" | "QUESTION";

export default function GamePage() {
  const game = useGameController();

  const [viewMode, setViewMode] = useState<ViewMode>("MAIN_MAP");
  const [visualStageIdx, setVisualStageIdx] = useState(0); 
  const [hasStarted, setHasStarted] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // --- STATE MINI-GAME ---
  const [miniCharX, setMiniCharX] = useState(10);
  const [facingRight, setFacingRight] = useState(true);
  const [walkStep, setWalkStep] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  // --- STATE HIỆU ỨNG SÁT THƯƠNG ---
  const [damageAnim, setDamageAnim] = useState(false);
  const prevHeartsRef = useRef(game.hearts);

  const miniCharXRef = useRef(miniCharX);
  const isJumpingRef = useRef(isJumping);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { miniCharXRef.current = miniCharX; }, [miniCharX]);
  useEffect(() => { isJumpingRef.current = isJumping; }, [isJumping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    };
  }, []);

  // =========================================================================
  // XỬ LÝ KHI MẤT MÁU HOẶC THẮNG/THUA
  // =========================================================================
  useEffect(() => {
    // Kích hoạt hiệu ứng mất máu (rung + tim vỡ)
    if (game.hearts < prevHeartsRef.current) {
      setDamageAnim(true);
      setTimeout(() => setDamageAnim(false), 1200); // Tắt hiệu ứng sau 1.2s (khi sang câu mới sẽ không rung nữa)
    }
    prevHeartsRef.current = game.hearts;

    if (game.gameState === "WON") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setViewMode("MAIN_MAP");
      setVisualStageIdx(game.hearts >= 3 ? 6 : 7);
    } else if (game.gameState === "LOST") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setViewMode("MAIN_MAP");
    }
  }, [game.gameState, game.hearts]);

  // =========================================================================
  // ĐIỀU KHIỂN BÀN PHÍM (PC) & CẢM ỨNG
  // =========================================================================
  const OBSTACLE_X = 45; // Vị trí chướng ngại vật

  const moveLeft = () => {
    setMiniCharX((prev) => Math.max(5, prev - 3));
    setFacingRight(false);
    setWalkStep((prev) => !prev);
  };

  const moveRight = () => {
    setMiniCharX((prev) => {
      const next = Math.min(85, prev + 3);
      // Chặn lại nếu đụng chướng ngại vật mà không nhảy
      if (prev < OBSTACLE_X && next >= OBSTACLE_X && !isJumpingRef.current) {
        return OBSTACLE_X - 2; 
      }
      return next;
    });
    setFacingRight(true);
    setWalkStep((prev) => !prev);
  };

  const handleTouchStartMove = (direction: 'left' | 'right') => {
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    direction === 'left' ? moveLeft() : moveRight();
    moveIntervalRef.current = setInterval(() => {
      direction === 'left' ? moveLeft() : moveRight();
    }, 100);
  };

  const handleTouchEndMove = () => {
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    setWalkStep(false);
  };

  const handleJumpAction = () => {
    if (miniCharXRef.current >= 75) {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      setViewMode("QUESTION");
      setWalkStep(false);
      return;
    }

    if (!isJumpingRef.current) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500); 
    }
  };

  useEffect(() => {
    if (viewMode !== "MINI_GAME") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "a" || key === "arrowleft") moveLeft();
      else if (key === "d" || key === "arrowright") moveRight();
      else if (key === "e" && miniCharXRef.current >= 75) {
        setViewMode("QUESTION");
        setWalkStep(false);
      }
      else if ((key === " " || key === "w" || key === "arrowup") && !isJumpingRef.current) {
        handleJumpAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["a", "d", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) setWalkStep(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [viewMode]);

  // =========================================================================
  // XỬ LÝ MAP LỚN & LUỒNG CÂU HỎI
  // =========================================================================
  const handleStartGame = () => {
    setHasStarted(true);
    setVisualStageIdx(1); 
  };

  const handleMapNodeClick = (idx: number) => {
    if (idx > visualStageIdx) {
      setToastMsg("Bạn cần hoàn thành trận trước!");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setToastMsg(""), 2500);
    } else if (idx === visualStageIdx) {
      setViewMode("STAGE_READY");
    }
  };

  const startMiniGame = () => {
    setMiniCharX(10);
    setFacingRight(true);
    setWalkStep(false);
    setViewMode("MINI_GAME");
  };

  const handleRestartGame = () => {
    setHasStarted(false);
    setVisualStageIdx(0);
    setViewMode("MAIN_MAP");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    game.resetGame();
  };

  const handleAnswerSubmit = (key: string) => {
    const isLastQuestion = game.currentQuestionIdx === game.totalQuestionsInStage - 1;
    const currentMapIndex = visualStageIdx; 
    const nextMapIndex = currentMapIndex + 1; 
    
    game.handleAnswer(key);

    // Dừng lại 1.5s để người chơi thấy kết quả (đúng hoặc rung/mất máu)
    setTimeout(() => {
      if (isLastQuestion) {
        setViewMode("MAIN_MAP");
        setVisualStageIdx(nextMapIndex <= 5 ? nextMapIndex : currentMapIndex);
      } else {
        // Mỗi lần trả lời là thoát ra, chạy tiếp vòng mới cho câu tiếp theo
        setViewMode("MINI_GAME");
        setMiniCharX(10); 
        setWalkStep(false);
      }
    }, 1500); 
  };

  const currentPos = MAP_COORDINATES[visualStageIdx] || MAP_COORDINATES[0];

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-0 md:p-4 touch-none select-none">
      
      {/* KHÓA XOAY */}
      <div className="portrait-lock fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin duration-1000 mb-6">
          <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Vui lòng xoay ngang!</h2>
        <p className="text-gray-300 text-lg">Trải nghiệm game tốt nhất ở màn hình ngang.</p>
      </div>

      <style>{`
        @media (orientation: landscape) { .portrait-lock { display: none !important; } }

        /* Animation khi mất máu */
        @keyframes damageShake {
          0% { transform: translate(4px, 4px) rotate(0deg); }
          20% { transform: translate(-4px, -5px) rotate(-2deg); }
          40% { transform: translate(-5px, 2px) rotate(2deg); }
          60% { transform: translate(5px, 4px) rotate(0deg); }
          80% { transform: translate(2px, -4px) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-damage-shake { 
          animation: damageShake 0.15s infinite; 
          box-shadow: 0 0 35px rgba(220, 38, 38, 0.8); 
        }

        /* Animation tim vỡ rớt xuống */
        @keyframes brokenHeartFall {
          0% { transform: translateY(-50px) scale(0.5); opacity: 0; }
          20% { transform: translateY(0px) scale(1.5); opacity: 1; }
          80% { transform: translateY(20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(100px) scale(1); opacity: 0; }
        }
        .animate-heart-break {
          animation: brokenHeartFall 1.2s ease-in-out forwards;
        }
      `}</style>

      {/* Rung cả Container nếu dính hiệu ứng */}
      <div className={`relative w-full max-w-5xl h-[100vh] md:h-[70vh] min-h-[400px] bg-blue-50 border-0 md:border-8 border-gray-700 md:rounded-xl overflow-hidden shadow-2xl transition-shadow ${damageAnim ? "animate-damage-shake" : ""}`}>
        
        {/* =========================================
            LỚP NỀN: BẢN ĐỒ LỚN 
            ========================================= */}
        <div className="absolute inset-0 z-0 bg-blue-100">
          <img src="/images/game/game-map.png" alt="Bản đồ chính" className="w-full h-full object-cover block absolute inset-0 z-0" />
          
          {/* TOAST THÔNG BÁO TỪ CHỐI CLICK */}
          {toastMsg && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-xl z-50 animate-bounce">
              ⚠️ {toastMsg}
            </div>
          )}

          {/* NHÂN VẬT TRÊN BẢN ĐỒ LỚN */}
          <div
            className="absolute z-10"
            style={{ 
              top: currentPos.top, left: currentPos.left,
              transitionProperty: "top, left", transitionDuration: "2000ms", transitionTimingFunction: "ease-in-out", 
              transform: "translate(-50%, -50%)" 
            }}
          >
            <div className={viewMode === "MAIN_MAP" && hasStarted ? "animate-bounce" : ""}>
              <img src="/images/game/walking.png" alt="Nhân vật Map Lớn" className="drop-shadow-2xl h-[40px] md:h-[60px] w-auto"/>
            </div>
          </div>

          {/* RƯƠNG TRÊN MAP (TƯƠNG TÁC) */}
          {hasStarted && viewMode === "MAIN_MAP" && MAP_COORDINATES.map((pos, idx) => {
            if (idx === 0) return null; // Bỏ qua vị trí xuất phát
            const isUnlocked = idx <= visualStageIdx;
            const isCurrent = idx === visualStageIdx;

            return (
              <div
                key={idx}
                onClick={() => handleMapNodeClick(idx)}
                style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}
                className={`absolute z-20 cursor-pointer w-14 h-14 flex items-center justify-center transition-all hover:scale-110
                  ${isUnlocked ? "opacity-100 drop-shadow-2xl" : "grayscale opacity-60"}
                `}
              >
                <span className="text-4xl drop-shadow-md">🎁</span>
                {isCurrent && (
                  <div className="absolute -top-6 bg-yellow-400 text-yellow-900 text-[10px] md:text-xs font-bold px-2 py-1 rounded whitespace-nowrap animate-pulse">
                    Nhấn để vào
                  </div>
                )}
              </div>
            );
          })}

          {/* NÚT KHỞI HÀNH BẮT ĐẦU GAME */}
          {!hasStarted && viewMode === "MAIN_MAP" && (
            <div className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center">
              <button onClick={handleStartGame} className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-2xl rounded-full shadow-xl transform hover:scale-110 transition-transform border-4 border-yellow-600 animate-pulse">
                🚀 KHỞI HÀNH
              </button>
            </div>
          )}

          {/* POPUP XÁC NHẬN VÀO CHẶNG */}
          {viewMode === "STAGE_READY" && (
            <div className="absolute inset-0 z-30 bg-black/50 flex flex-col items-center justify-center p-4 animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-all">
                  <h2 className="text-3xl font-bold text-blue-800 mb-2">
                    {game.currentStage?.stage || "Chặng Bí Ẩn"}
                  </h2>
                  <p className="text-gray-600 mb-6">Sẵn sàng khám phá chưa?</p>
                  <button onClick={startMiniGame} className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-lg transition-colors">
                    ▶ BẮT ĐẦU CHẠY
                  </button>
                </div>
            </div>
          )}
        </div>

        {/* =========================================
            LỚP PHỦ: MINI-GAME VÀ CÂU HỎI 
            ========================================= */}
        {(viewMode === "MINI_GAME" || viewMode === "QUESTION") && (
          <div className="absolute inset-0 z-20 bg-gray-900 animate-fade-in">
            {/* Đổi map tự động theo chặng */}
            <img 
              src={`/images/game/ingame-map${visualStageIdx}.jpg`} 
              onError={(e) => (e.currentTarget.src = "/images/game/ingame-map1.jpg")} // Sửa luôn ảnh mặc định nếu lỡ lỗi
              alt={`Bản đồ Ingame chặng ${visualStageIdx}`} 
              className={`w-full h-full object-cover transition-all duration-300 ${viewMode === "QUESTION" ? "opacity-50 blur-sm" : ""}`}
            />

            {viewMode === "MINI_GAME" && (
              <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg font-bold text-sm md:text-base hidden sm:block">
                ⌨️ Dùng [A/D] di chuyển, [W/Space] Nhảy, [E] Mở Rương
              </div>
            )}
            
            <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              Câu hỏi: {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
            </div>

            {/* CHƯỚNG NGẠI VẬT */}
            <div className="absolute bottom-[36%] w-[40px] h-[50px] flex justify-center items-end" style={{ left: `${OBSTACLE_X}%` }}>
              <span className="text-4xl drop-shadow-lg">🪨</span>
            </div>

            {/* NHÂN VẬT MINI GAME */}
            <div
              className="absolute transition-all ease-linear w-[60px] md:w-[80px] h-[80px] md:h-[100px]"
              style={{ 
                bottom: isJumping ? "50%" : "36%", 
                left: `${miniCharX}%`,
                transitionDuration: isJumping ? "250ms" : "100ms" 
              }}
            >
              <img 
                src={walkStep && !isJumping ? "/images/game/walking.png" : "/images/game/5hearts.png"}
                alt="Nhân vật Mini game" 
                className="absolute bottom-0 left-1/2 drop-shadow-xl max-w-none h-full w-auto"
                style={{ transform: facingRight ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(-1)", transformOrigin: "bottom center" }}
              />
            </div>

            {/* RƯƠNG CÂU HỎI */}
            <div className="absolute transform -translate-x-1/2 flex justify-center items-end" style={{ bottom: "36%", left: "85%" }}>
              <div className="animate-bounce">
                <span className="text-5xl md:text-6xl drop-shadow-xl">🎁</span> 
              </div>
            </div>

            {miniCharX >= 75 && viewMode === "MINI_GAME" && (
              <div className="absolute transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl font-bold animate-pulse shadow-lg whitespace-nowrap border-2 border-yellow-600" style={{ bottom: "55%", left: "85%" }}>
                <span className="hidden md:inline">Nhấn [E] để mở rương!</span>
                <span className="md:hidden">Nhấn NHẢY/MỞ!</span>
              </div>
            )}

            {/* CỤM ĐIỀU KHIỂN MOBILE */}
            {viewMode === "MINI_GAME" && (
              <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-center z-30 sm:hidden">
                <div className="flex gap-3">
                  <button onTouchStart={(e) => { e.preventDefault(); handleTouchStartMove('left'); }} onTouchEnd={(e) => { e.preventDefault(); handleTouchEndMove(); }} className="w-16 h-16 bg-white/40 backdrop-blur-sm rounded-full text-3xl font-bold flex items-center justify-center active:bg-white/80 border-2 border-white/50 shadow-lg">⬅️</button>
                  <button onTouchStart={(e) => { e.preventDefault(); handleTouchStartMove('right'); }} onTouchEnd={(e) => { e.preventDefault(); handleTouchEndMove(); }} className="w-16 h-16 bg-white/40 backdrop-blur-sm rounded-full text-3xl font-bold flex items-center justify-center active:bg-white/80 border-2 border-white/50 shadow-lg">➡️</button>
                </div>
                <button onClick={handleJumpAction} className="w-20 h-20 bg-blue-500/70 backdrop-blur-sm text-white rounded-full text-sm font-black flex items-center justify-center active:bg-blue-600 border-4 border-blue-300 shadow-xl text-center">
                  NHẢY <br/> MỞ
                </button>
              </div>
            )}

            {/* BẢNG CÂU HỎI */}
            {viewMode === "QUESTION" && game.currentQuestion && (
              <div className="absolute inset-0 z-30 bg-black/40 flex flex-col items-center justify-center p-4 overflow-y-auto">
                
                {/* HIỆU ỨNG TIM VỠ (-1 MÁU) */}
                {damageAnim && (
                  <div className="absolute z-50 pointer-events-none flex flex-col items-center justify-center">
                    <span className="text-8xl drop-shadow-2xl animate-heart-break">💔</span>
                    <span className="text-red-500 text-4xl font-black mt-2 drop-shadow-lg animate-heart-break stroke-black">-1 TIM</span>
                  </div>
                )}

                <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center my-auto transition-transform ${damageAnim ? "scale-95 border-4 border-red-500" : "scale-100 animate-fade-in"}`}>
                  <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <span className="text-xl font-bold text-blue-800">
                      {game.currentStage?.stage || "Chặng Bí Ẩn"}
                    </span>
                    <span className="text-xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full shadow-sm">
                      ❤️ x {game.hearts}
                    </span>
                  </div>
                  
                  <div className="mb-6 text-sm font-semibold text-gray-500 bg-gray-100 rounded-full py-2">
                     Tiến độ chặng: Câu {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
                    {game.currentQuestion.question}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(game.currentQuestion.options).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => handleAnswerSubmit(key)}
                        disabled={damageAnim} // Không cho spam click khi đang hiện sát thương
                        className="p-4 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-800 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-blue-600 shadow-sm disabled:opacity-50"
                      >
                        <span className="font-bold mr-2">{key}.</span> {value as React.ReactNode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LỚP PHỦ GAME OVER */}
        {game.gameState === "LOST" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
            <video src="/video/bad-ending.mp4" autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 z-0"/>
            <div className="relative z-10 flex flex-col items-center mb-12 text-center">
              <button onClick={handleRestartGame} className="px-8 py-3 bg-red-600 text-white font-bold text-lg rounded-full hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-105">
                🔄 Chơi lại từ đầu
              </button>
            </div>
          </div>
        )}

        {/* LỚP PHỦ CHIẾN THẮNG */}
        {game.gameState === "WON" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
            <video src="/video/good-ending.mp4" autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"/>
            <div className="relative z-10 flex flex-col items-center mb-12 text-center">
              <button onClick={handleRestartGame} className="px-8 py-3 bg-white text-blue-900 font-bold text-lg rounded-full hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-105">
                🔄 Chơi lại
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}