"use client";

import { useState, useEffect, useRef } from "react";
import { useGameController } from "../../controllers/gameController";

// --- DANH SÁCH TỌA ĐỘ CÁC CHẶNG (BẢN ĐỒ LỚN) ---
const MAP_COORDINATES = [
  { top: "65%", left: "18%" }, // Vị trí 0: BẮT ĐẦU
  { top: "56%", left: "24%" }, // Vị trí 1: CHẶNG 1
  { top: "25%", left: "26%" }, // Vị trí 2: CHẶNG 2
  { top: "23%", left: "44%" }, // Vị trí 3: CHẶNG 3 (Index 3 trong mảng)
  { top: "40%", left: "56%" }, // Vị trí 4: CHẶNG 4 (Index 4 trong mảng)
  { top: "23%", left: "73%" }, // Vị trí 5: CHẶNG 5 (Index 5 trong mảng)
  { top: "18%", left: "85%" }, // Vị trí 6: KẾT THÚC 1 (Cổng trắng)
  { top: "50%", left: "85%" }, // Vị trí 7: KẾT THÚC 2 (Cổng đen)
];

export default function GamePage() {
  const game = useGameController();

  // --- CÁC TRẠNG THÁI CỦA VIEW ---
  const [viewMode, setViewMode] = useState<"MAIN_MAP" | "READY" | "MINI_GAME" | "QUESTION">("MAIN_MAP");

  // State Map lớn
  const [characterPos, setCharacterPos] = useState(MAP_COORDINATES[0]);
  const [isMovingOnMainMap, setIsMovingOnMainMap] = useState(false);

  // State Mini-game
  const [miniCharX, setMiniCharX] = useState(10);
  const [facingRight, setFacingRight] = useState(true);
  const [walkStep, setWalkStep] = useState(false);

  // Refs để theo dõi sự thay đổi (Qua câu hay Qua chặng)
  const prevHearts = useRef(game.hearts);
  const prevQuestion = useRef(game.currentQuestionIdx);
  const prevStage = useRef(game.currentStageIdx);
  const miniCharXRef = useRef(miniCharX);

  useEffect(() => {
    miniCharXRef.current = miniCharX;
  }, [miniCharX]);

  // =========================================================================
  // EFFECT 1: KHI QUA CHẶNG MỚI (CHẠY TRÊN MAP LỚN) HOẶC MỚI VÀO GAME
  // =========================================================================
  useEffect(() => {
    setViewMode("MAIN_MAP");
    setIsMovingOnMainMap(true);

    const targetCoord = MAP_COORDINATES[game.currentStageIdx + 1] || MAP_COORDINATES[MAP_COORDINATES.length - 1];

    const moveTimer = setTimeout(() => {
      setCharacterPos(targetCoord);
    }, 500);

    const showReadyTimer = setTimeout(() => {
      setIsMovingOnMainMap(false);
      if (game.gameState === "PLAYING") {
        setViewMode("READY");
      }
    }, 2500);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(showReadyTimer);
    };
  }, [game.currentStageIdx]); // <- Chỉ chạy khi số Chặng (Stage) thay đổi

  // =========================================================================
  // EFFECT 2: KHI TRẢ LỜI ĐÚNG -> QUA CÂU TIẾP THEO NHƯNG VẪN Ở CHẶNG CŨ
  // =========================================================================
  useEffect(() => {
    if (game.currentQuestionIdx !== prevQuestion.current) {
      // Chỉ kích hoạt khi tăng câu hỏi (chưa bị reset về 0 do qua chặng mới)
      if (game.currentQuestionIdx > prevQuestion.current && game.currentStageIdx === prevStage.current && game.gameState === "PLAYING") {
        // Reset Mini game để người chơi đi nhặt quà cho câu hỏi mới
        setMiniCharX(10);
        setFacingRight(true);
        setWalkStep(false);
        setViewMode("MINI_GAME"); 
      }
      prevQuestion.current = game.currentQuestionIdx;
    }
    prevStage.current = game.currentStageIdx;
  }, [game.currentQuestionIdx, game.currentStageIdx, game.gameState]);

  // =========================================================================
  // EFFECT 3: KHI TRẢ LỜI SAI (MẤT TIM)
  // =========================================================================
  useEffect(() => {
    if (game.hearts < prevHearts.current && game.gameState === "PLAYING") {
      // Mất tim -> Reset mini game bắt đi nhặt lại
      setMiniCharX(10);
      setFacingRight(true);
      setWalkStep(false);
      setViewMode("MINI_GAME");
    }
    prevHearts.current = game.hearts;
  }, [game.hearts, game.gameState]);


  // --- ĐIỀU KHIỂN BÀN PHÍM ---
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

  const startMiniGame = () => {
    setMiniCharX(10);
    setFacingRight(true);
    setWalkStep(false);
    setViewMode("MINI_GAME");
  };

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[70vh] min-h-[500px] bg-blue-50 border-8 border-gray-700 rounded-xl overflow-hidden shadow-2xl">
        
        {/* ======================================================== */}
        {/* VIEW 1: MAIN MAP (Màn hình bản đồ lớn)                     */}
        {/* ======================================================== */}
        {(viewMode === "MAIN_MAP" || viewMode === "READY" || viewMode === "QUESTION") && (
          <>
            <img 
              src="/images/game/game-map.png" 
              alt="Bản đồ chính" 
              className="w-full h-full object-cover block absolute inset-0 z-0"
            />
            
            <div
              className="absolute z-10 transition-all ease-in-out"
              style={{ 
                top: characterPos.top, left: characterPos.left,
                transitionDuration: "2000ms", transform: "translate(-50%, -50%)" 
              }}
            >
              <div className={isMovingOnMainMap ? "animate-bounce" : "animate-pulse"}>
                <img 
                  src="/images/game/5hearts.png" 
                  alt="Nhân vật Map Lớn" 
                  className="drop-shadow-2xl"
                  style={{ height: "90px", width: "auto" }} 
                />
              </div>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: MÀN HÌNH "READY" (Nút Bắt đầu chặng)               */}
        {/* ======================================================== */}
        {viewMode === "READY" && (
          <div className="absolute inset-0 z-20 bg-black/50 flex flex-col items-center justify-center p-4 animate-fade-in">
             <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-all">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">
                  {game.currentStage?.stage || "Chặng Mới"}
                </h2>
                <p className="text-gray-600 mb-6">Sẵn sàng khám phá chưa?</p>
                <button 
                  onClick={startMiniGame}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-lg"
                >
                  ▶ BẮT ĐẦU CHƠI
                </button>
             </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: MINI GAME (Màn hình In-game 2D)                    */}
        {/* ======================================================== */}
        {viewMode === "MINI_GAME" && (
          <div className="absolute inset-0 z-20 bg-gray-900">
            <img 
              src="/images/game/ingame-map.jpg" 
              alt="Bản đồ Ingame" 
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg font-bold">
              ⌨️ Dùng [A] và [D] để di chuyển
            </div>
            
            {/* Hiển thị số lượng câu hỏi trong Map nhỏ */}
            <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              Câu hỏi hiện tại: {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
            </div>

            <div
              className="absolute transition-all duration-100 ease-linear"
              style={{ 
                bottom: "36%", 
                left: `${miniCharX}%`, 
                width: "120px", 
                height: "148px",
              }}
            >
              <img 
                src={walkStep ? "/images/game/walking.png" : "/images/game/5hearts.png"}
                alt="Nhân vật Mini game" 
                className="absolute bottom-0 left-1/2 drop-shadow-xl max-w-none"
                style={{ 
                  height: "100%", 
                  width: "auto",  
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

            {miniCharX >= 75 && (
              <div className="absolute transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl font-bold animate-pulse shadow-lg whitespace-nowrap border-2 border-yellow-600" style={{ bottom: "60%", left: "85%" }}>
                Nhấn [E] để nhặt!
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: BẢNG CÂU HỎI                                     */}
        {/* ======================================================== */}
        {viewMode === "QUESTION" && game.currentQuestion && (
          <div className="absolute inset-0 z-30 bg-black/60 flex flex-col items-center justify-center p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center my-auto">
              
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <span className="text-xl font-bold text-blue-800">
                  {game.currentStage?.stage || "Chặng Bí Ẩn"}
                </span>
                <span className="text-xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full">
                  ❤️ x {game.hearts}
                </span>
              </div>
              
              {/* CẬP NHẬT: Hiển thị thanh tiến trình 1/5 */}
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
                    <span className="font-bold mr-2">{key}.</span> {value}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* MÀN HÌNH GAME OVER / CHIẾN THẮNG */}
        {game.gameState === "LOST" && (
          <div className="absolute inset-0 z-40 bg-red-900/90 flex flex-col items-center justify-center p-4 text-white">
            <h1 className="text-5xl font-bold mb-4">GAME OVER</h1>
            <p className="text-xl mb-8">Bạn đã hết mạng rồi!</p>
            <button onClick={game.resetGame} className="px-6 py-3 bg-white text-red-900 font-bold rounded-xl hover:bg-gray-200">Chơi lại từ đầu</button>
          </div>
        )}

        {game.gameState === "WON" && (
          <div className="absolute inset-0 z-40 bg-green-900/90 flex flex-col items-center justify-center p-4 text-white">
            <h1 className="text-5xl font-bold mb-4">🎉 CHIẾN THẮNG 🎉</h1>
            <p className="text-xl mb-8">Chúc mừng bạn đã hoàn thành hành trình 5 chặng!</p>
            <button onClick={game.resetGame} className="px-6 py-3 bg-white text-green-900 font-bold rounded-xl hover:bg-gray-200">Chơi lại</button>
          </div>
        )}

      </div>
    </div>
  );
}