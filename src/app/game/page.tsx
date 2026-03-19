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

export default function GamePage() {
  const game = useGameController();

  // --- HỆ THỐNG LUỒNG MÀN HÌNH CHUẨN ---
  // MAIN_MAP: Bản đồ lớn di chuyển
  // STAGE_READY: Bảng thông báo "Sẵn sàng / Tiếp tục"
  // MINI_GAME: Bản đồ nhỏ chạy ngang
  // QUESTION: Bảng trả lời câu hỏi
  const [viewMode, setViewMode] = useState<"MAIN_MAP" | "STAGE_READY" | "MINI_GAME" | "QUESTION">("MAIN_MAP");
  
  // Vị trí của nhân vật trên bản đồ lớn (độc lập với logic của controller để tạo hiệu ứng mượt)
  const [visualStageIdx, setVisualStageIdx] = useState(0); 
  const [hasStarted, setHasStarted] = useState(false);

  // State Mini-game
  const [miniCharX, setMiniCharX] = useState(10);
  const [facingRight, setFacingRight] = useState(true);
  const [walkStep, setWalkStep] = useState(false);

  // Ref theo dõi chặng để biết khi nào chuyển chặng
  const prevStageRef = useRef(game.currentStageIdx);
  const miniCharXRef = useRef(miniCharX);

  useEffect(() => {
    miniCharXRef.current = miniCharX;
  }, [miniCharX]);

  // =========================================================================
  // 1. CHUYỂN CHẶNG TỰ ĐỘNG SAU KHI XONG 5 CÂU
  // =========================================================================
  useEffect(() => {
    // Nếu Controller báo đã sang chặng mới (Ví dụ xong 5 câu chặng 1 -> sang chặng 2)
    if (hasStarted && game.currentStageIdx > prevStageRef.current && game.gameState === "PLAYING") {
      
      // Bước 1: Đóng bảng câu hỏi, hiển thị Bản đồ lớn
      setViewMode("MAIN_MAP");
      
      // Bước 2: Di chuyển nhân vật tới chặng tiếp theo
      setVisualStageIdx(game.currentStageIdx + 1);

      // Bước 3: Chờ nhân vật chạy 2 giây, sau đó hiện bảng "Tiếp Tục"
      const timer = setTimeout(() => {
        setViewMode("STAGE_READY");
      }, 2000);

      prevStageRef.current = game.currentStageIdx;
      return () => clearTimeout(timer);
    }
  }, [game.currentStageIdx, hasStarted, game.gameState]);

  // =========================================================================
  // 2. XỬ LÝ KHI THẮNG / THUA GAME
  // =========================================================================
  useEffect(() => {
    if (game.gameState === "WON") {
      setViewMode("MAIN_MAP");
      setVisualStageIdx(game.hearts >= 3 ? 6 : 7); // Bay về đích
    } else if (game.gameState === "LOST") {
      setViewMode("MAIN_MAP");
    }
  }, [game.gameState, game.hearts]);

  // =========================================================================
  // 3. ĐIỀU KHIỂN NHÂN VẬT INGAME
  // =========================================================================
  useEffect(() => {
    if (viewMode !== "MINI_GAME") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") {
        setMiniCharX((prev) => Math.max(5, prev - 3));
        setFacingRight(false);
        setWalkStep((prev) => !prev);
      } 
      else if (e.key === "d" || e.key === "D") {
        setMiniCharX((prev) => Math.min(85, prev + 3));
        setFacingRight(true);
        setWalkStep((prev) => !prev);
      } 
      // Nhấn E để mở rương -> Mở Bảng Câu Hỏi
      else if ((e.key === "e" || e.key === "E") && miniCharXRef.current >= 75) {
        setViewMode("QUESTION");
        setWalkStep(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "a" || e.key.toLowerCase() === "d") {
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

  // --- CÁC HÀM NÚT BẤM ---
  const handleStartGame = () => {
    setHasStarted(true);
    setVisualStageIdx(1); // Chạy từ Bắt đầu sang Chặng 1
    setTimeout(() => {
      setViewMode("STAGE_READY");
    }, 2000);
  };

  const startMiniGame = () => {
    setMiniCharX(10); // Reset nhân vật về mép trái
    setFacingRight(true);
    setWalkStep(false);
    setViewMode("MINI_GAME");
  };

  const handleRestartGame = () => {
    setHasStarted(false);
    setVisualStageIdx(0);
    setViewMode("MAIN_MAP");
    prevStageRef.current = 0;
    game.resetGame();
  };

  // Tọa độ hiện tại để nhân vật lướt
  const currentPos = MAP_COORDINATES[visualStageIdx] || MAP_COORDINATES[0];

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[70vh] min-h-[500px] bg-blue-50 border-8 border-gray-700 rounded-xl overflow-hidden shadow-2xl">
        
        {/* ===================================================================== */}
        {/* KHÔNG GIAN 1: BẢN ĐỒ LỚN (Chỉ hiển thị khi ở map ngoài)               */}
        {/* ===================================================================== */}
        {(viewMode === "MAIN_MAP" || viewMode === "STAGE_READY") && (
          <div className="absolute inset-0">
            <img 
              src="/images/game/game-map.jpg" 
              alt="Bản đồ chính" 
              className="w-full h-full object-cover block absolute inset-0 z-0"
            />
            
            {/* Nhân vật di chuyển trên bản đồ lớn */}
            <div
              className="absolute z-10 transition-all ease-in-out"
              style={{ 
                top: currentPos.top, left: currentPos.left,
                transitionDuration: "2000ms", transform: "translate(-50%, -50%)" 
              }}
            >
              <div className={viewMode === "MAIN_MAP" && hasStarted ? "animate-bounce" : ""}>
                <img 
                  src="/images/game/walking.png" 
                  alt="Nhân vật Map Lớn" 
                  className="drop-shadow-2xl"
                  style={{ height: "60px", width: "auto" }} 
                />
              </div>
            </div>

            {/* Nút KHỞI HÀNH khi mới vào */}
            {!hasStarted && (
              <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
                <button 
                  onClick={handleStartGame}
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-2xl rounded-full shadow-xl transform hover:scale-110 transition-transform border-4 border-yellow-600 animate-pulse"
                >
                  🚀 KHỞI HÀNH
                </button>
              </div>
            )}

            {/* Bảng SẴN SÀNG / TIẾP TỤC */}
            {viewMode === "STAGE_READY" && (
              <div className="absolute inset-0 z-20 bg-black/50 flex flex-col items-center justify-center p-4 animate-fade-in">
                 <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-all">
                    <h2 className="text-3xl font-bold text-blue-800 mb-2">
                      {game.currentStage?.stage || "Chặng Bí Ẩn"}
                    </h2>
                    <p className="text-gray-600 mb-6">Sẵn sàng khám phá chưa?</p>
                    <button 
                      onClick={startMiniGame}
                      className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-lg"
                    >
                      {game.currentStageIdx === 0 ? "▶ BẮT ĐẦU CHƠI" : "▶ TIẾP TỤC"}
                    </button>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* KHÔNG GIAN 2: BÊN TRONG CHẶNG (Ingame map + Bảng Câu Hỏi)             */}
        {/* ===================================================================== */}
        {(viewMode === "MINI_GAME" || viewMode === "QUESTION") && (
          <div className="absolute inset-0 z-20 bg-gray-900">
            {/* Background 2D luon luon hien thi khi o trong chang */}
            <img 
              src="/images/game/ingame-map.jpg" 
              alt="Bản đồ Ingame" 
              className={`w-full h-full object-cover ${viewMode === "QUESTION" ? "opacity-50 blur-sm" : ""}`}
            />

            {/* UI hiển thị điều khiển */}
            {viewMode === "MINI_GAME" && (
              <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg font-bold">
                ⌨️ Dùng [A] và [D] để di chuyển
              </div>
            )}
            
            <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              Câu hỏi hiện tại: {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
            </div>

            {/* Nhân vật di chuyển ngang */}
            <div
              className="absolute transition-all duration-100 ease-linear"
              style={{ bottom: "36%", left: `${miniCharX}%`, width: "80px", height: "100px" }}
            >
              <img 
                src={walkStep ? "/images/game/walking.png" : "/images/game/walking.png"}
                alt="Nhân vật Mini game" 
                className="absolute bottom-0 left-1/2 drop-shadow-xl max-w-none"
                style={{ 
                  height: "100%", width: "auto",  
                  transform: facingRight ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(-1)", 
                  transformOrigin: "bottom center",
                }}
              />
            </div>

            {/* Rương kho báu */}
            <div className="absolute transform -translate-x-1/2 flex justify-center items-end" style={{ bottom: "36%", left: "85%" }}>
              <div className="animate-bounce">
                <span className="text-6xl drop-shadow-xl">🎁</span> 
              </div>
            </div>

            {/* Tooltip nhấn E */}
            {miniCharX >= 75 && viewMode === "MINI_GAME" && (
              <div className="absolute transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl font-bold animate-pulse shadow-lg whitespace-nowrap border-2 border-yellow-600" style={{ bottom: "60%", left: "85%" }}>
                Nhấn [E] để nhặt!
              </div>
            )}

            {/* BẢNG CÂU HỎI (Nổi bật đè lên Mini Game) */}
            {viewMode === "QUESTION" && game.currentQuestion && (
              <div className="absolute inset-0 z-30 bg-black/40 flex flex-col items-center justify-center p-4 animate-fade-in overflow-y-auto">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center my-auto">
                  <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <span className="text-xl font-bold text-blue-800">
                      {game.currentStage?.stage || "Chặng Bí Ẩn"}
                    </span>
                    <span className="text-xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full">
                      ❤️ x {game.hearts}
                    </span>
                  </div>
                  
                  <div className="mb-6 text-sm font-semibold text-gray-500 bg-gray-100 rounded-full py-2">
                     Tiến độ chặng này: Câu {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
                    {game.currentQuestion.question}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(game.currentQuestion.options).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => game.handleAnswer(key)}
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

        {/* ===================================================================== */}
        {/* MÀN HÌNH GAME OVER / CHIẾN THẮNG                                      */}
        {/* ===================================================================== */}
        
        {game.gameState === "LOST" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-40 bg-gray-900/95 flex flex-col items-center justify-center p-4 text-white animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-red-500">KẾT THÚC</h1>
            <p className="text-xl mb-2">Bạn đã bị bóng tối nuốt chửng vì hết tim!</p>
            <p className="text-gray-400 mb-8">Cổng Bóng Tối đã khép lại...</p>
            <button onClick={handleRestartGame} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Chơi lại từ đầu</button>
          </div>
        )}

        {game.gameState === "WON" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-40 bg-blue-900/95 flex flex-col items-center justify-center p-4 text-white animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-yellow-400">
              {game.hearts >= 3 ? "🏆 ĐẠI CHIẾN THẮNG 🏆" : "🎉 HOÀN THÀNH 🎉"}
            </h1>
            <p className="text-xl mb-2">Bạn đã về đích với {game.hearts} trái tim!</p>
            <p className="text-lg mb-8 opacity-80">
              {game.hearts >= 3 ? "Tuyệt vời! Bạn đã xứng đáng mở được Cổng Thiên Đường!" : "Bạn đã đi qua Cổng Bóng Tối. Lần sau hãy cố gắng giữ nhiều tim hơn nhé!"}
            </p>
            <button onClick={handleRestartGame} className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-gray-200">Chơi lại</button>
          </div>
        )}

      </div>
    </div>
  );
}