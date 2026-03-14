"use client";

import { useState, useEffect } from "react";
import { useGameController } from "../../controllers/gameController";

// --- DANH SÁCH TỌA ĐỘ CÁC CHẶNG ---
// Bạn có thể tự chỉnh lại số % này cho khớp mắt nhất với ảnh của bạn nhé
const MAP_COORDINATES = [
  { top: "68%", left: "20%" }, // Vị trí 0: BẮT ĐẦU (Start)
  { top: "52%", left: "24%" }, // Vị trí 1: Chặng 1
  { top: "25%", left: "24%" }, // Vị trí 2: Chặng 2
  { top: "40%", left: "38%" }, // Vị trí 3: Làng Tình Huống
  { top: "25%", left: "45%" }, // Vị trí 4: Chặng 3
  { top: "40%", left: "60%" }, // Vị trí 5: Thành Phố Phá Án
  { top: "25%", left: "75%" }, // Vị trí 6: Chặng 5
  { top: "50%", left: "80%" }, // Vị trí 7: Rương Cuối
];

export default function GamePage() {
  const game = useGameController();

  // State lưu vị trí hiện tại của nhân vật (Khởi đầu ở vị trí 0)
  const [characterPos, setCharacterPos] = useState(MAP_COORDINATES[0]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  
  // State để bật/tắt hoạt ảnh nhảy tưng tưng
  const [isMoving, setIsMoving] = useState(false);

  // --- EFFECT: TỰ ĐỘNG LẮNG NGHE KHI QUA CHẶNG MỚI ---
  useEffect(() => {
    // 1. Ẩn bảng câu hỏi và bật chế độ "Đang di chuyển" (nhảy)
    setShowQuestionModal(false);
    setIsMoving(true);

    // 2. Lấy tọa độ mục tiêu (Chặng hiện tại + 1, vì index 0 là Bắt Đầu)
    const targetCoord = MAP_COORDINATES[game.currentStageIdx + 1] || MAP_COORDINATES[0];

    // Đợi 0.5s rồi cho nhân vật trượt đi
    const moveTimer = setTimeout(() => {
      setCharacterPos(targetCoord);
    }, 500);

    // 3. Đợi nhân vật trượt xong (2.5 giây) -> Tắt nhảy đứng im thở, hiện bảng câu hỏi
    const showModalTimer = setTimeout(() => {
      setIsMoving(false);
      
      // Nếu chưa thắng hay thua thì mới hiện câu hỏi
      if (game.gameState === "PLAYING") {
        setShowQuestionModal(true);
      }
    }, 2500);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(showModalTimer);
    };
  }, [game.currentStageIdx, game.gameState]); // Chạy lại mỗi khi chặng thay đổi

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
      
      {/* KHUNG CHỨA BẢN ĐỒ */}
      <div className="relative w-full max-w-5xl aspect-video min-h-[400px] bg-blue-50 border-8 border-gray-700 rounded-xl overflow-hidden shadow-2xl">
        
        {/* ẢNH BẢN ĐỒ */}
        <img 
          src="/images/game/game-map.jpg" 
          alt="Bản đồ game" 
          className="w-full h-full object-cover block"
        />

        {/* NHÂN VẬT 5 HEARTS */}
        <div
          className="absolute z-10 transition-all ease-in-out"
          style={{ 
            top: characterPos.top, 
            left: characterPos.left,
            transitionDuration: "2000ms", // Trượt đi trong 2 giây
            transform: "translate(-50%, -50%)" 
          }}
        >
          {/* HOẠT ẢNH: Đang đi thì nhảy (bounce), đứng xem câu hỏi thì nhịp thở nhẹ (pulse) */}
          <div className={isMoving ? "animate-bounce" : "animate-pulse"}>
            <img 
              src="/images/game/5hearts.png" 
              alt="Nhân vật" 
              // SIZE TO HƠN: Mình đã tăng lên w-20/28 (Gấp rưỡi bản cũ)
              className="w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* BẢNG CÂU HỎI */}
        {showQuestionModal && game.currentQuestion && (
          <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
              
              {/* Tiêu đề chặng & Số mạng */}
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <span className="text-xl font-bold text-blue-800">
                  {game.currentStage?.stage || "Chặng Bí Ẩn"}
                  <span className="text-sm font-normal text-gray-500 block">
                    Câu hỏi {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
                  </span>
                </span>
                <span className="text-xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full">
                  ❤️ x {game.hearts}
                </span>
              </div>

              {/* Nội dung câu hỏi */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
                {game.currentQuestion.question}
              </h2>

              {/* Các đáp án */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(game.currentQuestion.options).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => game.handleAnswer(key)}
                    className="p-4 bg-gray-50 hover:bg-green-500 hover:text-white text-gray-800 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-green-600 shadow-sm"
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
          <div className="absolute inset-0 z-30 bg-red-900/90 flex flex-col items-center justify-center p-4 text-white">
            <h1 className="text-5xl font-bold mb-4">GAME OVER</h1>
            <p className="text-xl mb-8">Bạn đã hết mạng rồi!</p>
            <button onClick={game.resetGame} className="px-6 py-3 bg-white text-red-900 font-bold rounded-xl hover:bg-gray-200">Chơi lại từ đầu</button>
          </div>
        )}

        {game.gameState === "WON" && (
          <div className="absolute inset-0 z-30 bg-green-900/90 flex flex-col items-center justify-center p-4 text-white">
            <h1 className="text-5xl font-bold mb-4">🎉 CHIẾN THẮNG 🎉</h1>
            <p className="text-xl mb-8">Chúc mừng bạn đã hoàn thành hành trình!</p>
            <button onClick={game.resetGame} className="px-6 py-3 bg-white text-green-900 font-bold rounded-xl hover:bg-gray-200">Chơi lại</button>
          </div>
        )}

      </div>
    </div>
  );
}