"use client";

import { useState, useEffect, useRef } from "react";
import { useGameController } from "../../controllers/gameController";

// --- DANH SÁCH TỌA ĐỘ CÁC CHẶNG (BẢN ĐỒ LỚN) ---
const MAP_COORDINATES = [
  { top: "65%", left: "18%" }, // 0: BẮT ĐẦU
  { top: "54%", left: "24%" }, // 1: CHẶNG 1
  { top: "28%", left: "26%" }, // 2: CHẶNG 2
  { top: "25%", left: "44%" }, // 3: CHẶNG 3
  { top: "42%", left: "55%" }, // 4: CHẶNG 4
  { top: "25%", left: "73%" }, // 5: CHẶNG 5
  { top: "18%", left: "85%" }, // 6: KẾT THÚC 1 (Cổng trắng - Thắng)
  { top: "50%", left: "85%" }, // 7: KẾT THÚC 2 (Cổng đen - Thua)
];

type ViewMode = "MAIN_MAP" | "STAGE_READY" | "MINI_GAME" | "QUESTION";

export default function GamePage() {
  const game = useGameController();

  const [viewMode, setViewMode] = useState<ViewMode>("MAIN_MAP");
  const [visualStageIdx, setVisualStageIdx] = useState(0); 
  const [hasStarted, setHasStarted] = useState(false);

  // --- STATE MINI-GAME ---
  const [miniCharX, setMiniCharX] = useState(10);
  const [facingRight, setFacingRight] = useState(true);
  const [walkStep, setWalkStep] = useState(false);

  const miniCharXRef = useRef(miniCharX);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    miniCharXRef.current = miniCharX;
  }, [miniCharX]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // =========================================================================
  // XỬ LÝ KHI THẮNG / THUA
  // =========================================================================
  useEffect(() => {
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
  // ĐIỀU KHIỂN MINI GAME
  // =========================================================================
  useEffect(() => {
    if (viewMode !== "MINI_GAME") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === "a" || key === "arrowleft") {
        setMiniCharX((prev) => Math.max(5, prev - 3));
        setFacingRight(false);
        setWalkStep((prev) => !prev);
      } 
      else if (key === "d" || key === "arrowright") {
        setMiniCharX((prev) => Math.min(85, prev + 3));
        setFacingRight(true);
        setWalkStep((prev) => !prev);
      } 
      else if (key === "e" && miniCharXRef.current >= 75) {
        setViewMode("QUESTION");
        setWalkStep(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "a" || key === "d" || key === "arrowleft" || key === "arrowright") {
        setWalkStep(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [viewMode]);

  const handleStartGame = () => {
    setHasStarted(true);
    setVisualStageIdx(1); 
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setViewMode("STAGE_READY");
    }, 2000);
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

  // =========================================================================
  // VŨ KHÍ 4.2: ĐỘC LẬP HÓA HOÀN TOÀN ĐỒ HỌA BƯỚC ĐI
  // =========================================================================
  const handleAnswerSubmit = (key: string) => {
    const isLastQuestion = game.currentQuestionIdx === game.totalQuestionsInStage - 1;
    
    const currentMapIndex = visualStageIdx; 
    const nextMapIndex = currentMapIndex + 1; 
    
    game.handleAnswer(key);

    if (isLastQuestion) {
      setViewMode("MAIN_MAP");
      setVisualStageIdx(currentMapIndex); 
      setMiniCharX(10); 
      setFacingRight(true);
      setWalkStep(false);

      setTimeout(() => {
        if (nextMapIndex <= 5) { 
          setVisualStageIdx(nextMapIndex); 
        }
      }, 100);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      if (nextMapIndex <= 5) {
        timeoutRef.current = setTimeout(() => {
          setViewMode("STAGE_READY");
        }, 2100); 
      }
    }
  };

  // =========================================================================
  // HIỆU ỨNG RUNG LẮC (SCREEN SHAKE) TĂNG DẦN VÀ NHIỄU HẠT (NOISE)
  // =========================================================================
  const getShakeClass = () => {
    // Không rung nếu chưa bắt đầu, hoặc game đã có kết quả
    if (!hasStarted || game.gameState === "WON" || game.gameState === "LOST") return "";
    
    // Rung theo từng cấp độ máu
    if (game.hearts === 4) return "animate-shake-1"; // Rung rất nhẹ
    if (game.hearts === 3) return "animate-shake-2"; // Rung vừa
    if (game.hearts === 2) return "animate-shake-3"; // Rung mạnh
    
    // CÒN 1 TIM: Rung dữ dội + báo đỏ + NHIỄU SÓNG
    if (game.hearts <= 1) return "animate-shake-4 animate-noise";  
    
    return "";
  };

  const currentPos = MAP_COORDINATES[visualStageIdx] || MAP_COORDINATES[0];

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
      
      {/* KHAI BÁO CSS RUNG LẮC VÀ NHIỄU */}
      <style>{`
        /* Level 1 (4 Tim): Rung siêu nhẹ, thoang thoảng */
        @keyframes shakeLevel1 {
          0% { transform: translate(0.5px, 0.5px) rotate(0deg); }
          25% { transform: translate(-0.5px, -1px) rotate(-0.2deg); }
          50% { transform: translate(-1px, 0px) rotate(0.2deg); }
          75% { transform: translate(1px, 0.5px) rotate(0deg); }
          100% { transform: translate(0.5px, -0.5px) rotate(-0.2deg); }
        }
        /* Level 2 (3 Tim): Rung rõ hơn một chút */
        @keyframes shakeLevel2 {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          25% { transform: translate(-1px, -2px) rotate(-0.5deg); }
          50% { transform: translate(-2px, 0px) rotate(0.5deg); }
          75% { transform: translate(2px, 1px) rotate(0deg); }
          100% { transform: translate(1px, -1px) rotate(-0.5deg); }
        }
        /* Level 3 (2 Tim): Bắt đầu giật mạnh */
        @keyframes shakeLevel3 {
          0% { transform: translate(2px, 2px) rotate(0deg); }
          20% { transform: translate(-2px, -3px) rotate(-1deg); }
          40% { transform: translate(-3px, 1px) rotate(1deg); }
          60% { transform: translate(3px, 2px) rotate(0deg); }
          80% { transform: translate(1px, -2px) rotate(1deg); }
          100% { transform: translate(-2px, 3px) rotate(-1deg); }
        }
        /* Level 4 (1 Tim): Giật bần bật, nhịp nhanh */
        @keyframes shakeLevel4 {
          0% { transform: translate(4px, 4px) rotate(0deg); }
          20% { transform: translate(-4px, -5px) rotate(-2deg); }
          40% { transform: translate(-5px, 2px) rotate(2deg); }
          60% { transform: translate(5px, 4px) rotate(0deg); }
          80% { transform: translate(2px, -4px) rotate(2deg); }
          100% { transform: translate(-4px, 5px) rotate(-2deg); }
        }

        .animate-shake-1 { animation: shakeLevel1 0.5s infinite; }
        .animate-shake-2 { animation: shakeLevel2 0.4s infinite; }
        .animate-shake-3 { animation: shakeLevel3 0.25s infinite; }
        .animate-shake-4 { 
          animation: shakeLevel4 0.15s infinite; 
          box-shadow: 0 0 35px rgba(220, 38, 38, 0.8); /* Viền đỏ rực rỡ báo động */
        }

        /* --- HIỆU ỨNG NHIỄU HẠT TĨNH ĐIỆN --- */
        .animate-noise::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 40; /* Đặt dưới các popup game over, nhưng trên mọi thứ khác */
          pointer-events: none; /* Không cản trở click chuột */
          opacity: 0.25; /* Độ mờ của nhiễu (tăng nhẹ để dễ nhìn hơn) */
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noiseJitter 0.1s infinite; /* Nháy siêu nhanh */
          mix-blend-mode: overlay; /* Hòa trộn vào màu nền giúp chân thực hơn */
        }

        /* Làm cho lớp nhiễu giật giật đổi vị trí liên tục */
        @keyframes noiseJitter {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-1%, 1%); }
          50% { transform: translate(1%, -1%); }
          75% { transform: translate(-2%, -2%); }
          100% { transform: translate(1%, 2%); }
        }
      `}</style>

      {/* ÁP DỤNG getShakeClass() VÀO KHUNG NÀY */}
      <div className={`relative w-full max-w-5xl h-[70vh] min-h-[500px] bg-blue-50 border-8 border-gray-700 rounded-xl overflow-hidden shadow-2xl transition-shadow ${getShakeClass()}`}>
        
        {/* LỚP NỀN: BẢN ĐỒ LỚN */}
        <div className="absolute inset-0 z-0 bg-blue-100">
          <img 
            src="/images/game/game-map.png" 
            alt="Bản đồ chính" 
            className="w-full h-full object-cover block absolute inset-0 z-0"
          />
          
          <div
            className="absolute z-10"
            style={{ 
              top: currentPos.top, 
              left: currentPos.left,
              transitionProperty: "top, left",
              transitionDuration: "2000ms",
              transitionTimingFunction: "ease-in-out", 
              transform: "translate(-50%, -50%)" 
            }}
          >
            <div className={viewMode === "MAIN_MAP" && hasStarted ? "animate-bounce" : ""}>
              <img 
                src="/images/game/walking.png" 
                alt="Nhân vật Map Lớn" 
                className="drop-shadow-2xl h-[60px] w-auto"
              />
            </div>
          </div>

          {!hasStarted && viewMode === "MAIN_MAP" && (
            <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
              <button 
                onClick={handleStartGame}
                className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-2xl rounded-full shadow-xl transform hover:scale-110 transition-transform border-4 border-yellow-600 animate-pulse"
              >
                🚀 KHỞI HÀNH
              </button>
            </div>
          )}

          {viewMode === "STAGE_READY" && (
            <div className="absolute inset-0 z-20 bg-black/50 flex flex-col items-center justify-center p-4 animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-all">
                  <h2 className="text-3xl font-bold text-blue-800 mb-2">
                    {game.currentStage?.stage || "Chặng Bí Ẩn"}
                  </h2>
                  <p className="text-gray-600 mb-6">Sẵn sàng khám phá chưa?</p>
                  <button 
                    onClick={startMiniGame}
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-lg transition-colors"
                  >
                    {game.currentStageIdx === 0 ? "▶ BẮT ĐẦU CHƠI" : "▶ TIẾP TỤC"}
                  </button>
                </div>
            </div>
          )}
        </div>

        {/* LỚP PHỦ: BÊN TRONG CHẶNG VÀ CÂU HỎI */}
        {(viewMode === "MINI_GAME" || viewMode === "QUESTION") && (
          <div className="absolute inset-0 z-20 bg-gray-900 animate-fade-in">
            <img 
              src="/images/game/ingame-map.jpg" 
              alt="Bản đồ Ingame" 
              className={`w-full h-full object-cover transition-all duration-300 ${viewMode === "QUESTION" ? "opacity-50 blur-sm" : ""}`}
            />

            {viewMode === "MINI_GAME" && (
              <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg font-bold">
                ⌨️ Dùng [A/D] hoặc [←/→] để di chuyển
              </div>
            )}
            
            <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              Câu hỏi: {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
            </div>

            <div
              className="absolute transition-all duration-100 ease-linear w-[80px] h-[100px]"
              style={{ bottom: "36%", left: `${miniCharX}%` }}
            >
              <img 
                src={walkStep ? "/images/game/walking.png" : "/images/game/5hearts.png"}
                alt="Nhân vật Mini game" 
                className="absolute bottom-0 left-1/2 drop-shadow-xl max-w-none h-full w-auto"
                style={{ 
                  transform: facingRight ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(-1)", 
                  transformOrigin: "bottom center",
                }}
              />
            </div>

            <div className="absolute transform -translate-x-1/2 flex justify-center items-end" style={{ bottom: "36%", left: "85%" }}>
              <div className="animate-bounce">
                <span className="text-6xl drop-shadow-xl">🎁</span> 
              </div>
            </div>

            {miniCharX >= 75 && viewMode === "MINI_GAME" && (
              <div className="absolute transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl font-bold animate-pulse shadow-lg whitespace-nowrap border-2 border-yellow-600" style={{ bottom: "60%", left: "85%" }}>
                Nhấn [E] để mở rương!
              </div>
            )}

            {viewMode === "QUESTION" && game.currentQuestion && (
              <div className="absolute inset-0 z-30 bg-black/40 flex flex-col items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center my-auto animate-fade-in">
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
                        className="p-4 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-800 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-blue-600 shadow-sm"
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

        {/* LỚP PHỦ GAME OVER (THUA) */}
        {game.gameState === "LOST" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
            {/* Video Background */}
            <video 
              src="/video/bad-ending.mp4" 
              autoPlay 
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80 z-0"
            />
            
            {/* Nội dung đè lên trên Video */}
            <div className="relative z-10 flex flex-col items-center mb-12 text-center">
              <button 
                onClick={handleRestartGame} 
                className="px-8 py-3 bg-red-600 text-white font-bold text-lg rounded-full hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-105"
              >
                🔄 Chơi lại từ đầu
              </button>
            </div>
          </div>
        )}

        {/* LỚP PHỦ CHIẾN THẮNG (THẮNG) */}
        {game.gameState === "WON" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
            {/* Video Background */}
            <video 
              src="/video/good-ending.mp4" 
              autoPlay 
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
            />

            {/* Nội dung đè lên trên Video */}
            <div className="relative z-10 flex flex-col items-center mb-12 text-center">
              <button 
                onClick={handleRestartGame} 
                className="px-8 py-3 bg-white text-blue-900 font-bold text-lg rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-105"
              >
                🔄 Chơi lại
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}