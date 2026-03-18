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

  // --- CÁC TRẠNG THÁI CỦA VIEW (MÀN HÌNH) ---
  const [viewMode, setViewMode] = useState<"MAIN_MAP" | "READY" | "MINI_GAME" | "QUESTION">("MAIN_MAP");

  // State của Map lớn
  const [characterPos, setCharacterPos] = useState(MAP_COORDINATES[0]);
  const [isMovingOnMainMap, setIsMovingOnMainMap] = useState(false);

  // State của Mini-game
  const [miniCharX, setMiniCharX] = useState(10); // Tọa độ X của nhân vật (10% -> 90%)
  
  // Dùng để theo dõi số tim, nếu giảm tim (trả lời sai) thì bắt chơi lại mini-game
  const prevHearts = useRef(game.hearts);

  // --- 1. EFFECT: KHI QUA CHẶNG TRÊN MAP LỚN ---
  useEffect(() => {
    setViewMode("MAIN_MAP");
    setIsMovingOnMainMap(true);

    const targetCoord = MAP_COORDINATES[game.currentStageIdx + 1] || MAP_COORDINATES[0];

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
  }, [game.currentStageIdx, game.gameState]);

  // --- 2. EFFECT: BỊ TRỪ TIM (TRẢ LỜI SAI) -> CHƠI LẠI MAP ---
  useEffect(() => {
    if (game.hearts < prevHearts.current && game.gameState === "PLAYING") {
      setViewMode("READY");
    }
    prevHearts.current = game.hearts;
  }, [game.hearts, game.gameState]);

  // --- 3. EFFECT: ĐIỀU KHIỂN MINI-GAME BẰNG BÀN PHÍM (A, D, E) ---
  useEffect(() => {
    if (viewMode !== "MINI_GAME") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") {
        setMiniCharX((prev) => Math.max(5, prev - 3));
      } 
      else if (e.key === "d" || e.key === "D") {
        setMiniCharX((prev) => Math.min(85, prev + 3));
      } 
      else if ((e.key === "e" || e.key === "E") && miniCharX >= 75) {
        setViewMode("QUESTION");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, miniCharX]);

  const startMiniGame = () => {
    setMiniCharX(10);
    setViewMode("MINI_GAME");
  };

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
      
      {/* SỬA LỖI LAYOUT: Thay vì dùng aspect-video dễ bị sập, ta dùng h-[70vh] kết hợp min-h để giữ cứng khung */}
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
                  alt="Nhân vật" 
                  className="w-20 h-20 md:w-24 md:h-24 drop-shadow-2xl"
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
        {/* VIEW 3: MINI GAME (Màn hình In-game 2D di chuyển A D E)  */}
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

            {/* NHÂN VẬT ĐỨNG TRÊN CỎ: Căn chuẩn bottom 36% */}
            <div
              className="absolute transition-all duration-100 ease-linear"
              style={{ bottom: "36%", left: `${miniCharX}%`, transform: "translateX(-50%)" }}
            >
              <img 
                src="/images/game/5hearts.png" 
                alt="Nhân vật" 
                className="w-24 h-24 md:w-36 md:h-36 drop-shadow-xl"
              />
            </div>

            {/* VẬT PHẨM: Căn chuẩn bottom 36% để ngang hàng với nhân vật */}
            <div className="absolute transform -translate-x-1/2" style={{ bottom: "36%", left: "85%" }}>
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
            <p className="text-xl mb-8">Chúc mừng bạn đã hoàn thành hành trình!</p>
            <button onClick={game.resetGame} className="px-6 py-3 bg-white text-green-900 font-bold rounded-xl hover:bg-gray-200">Chơi lại</button>
          </div>
        )}

      </div>
    </div>
  );
}