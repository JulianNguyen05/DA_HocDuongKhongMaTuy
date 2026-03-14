"use client";

// Import cái Hook Controller ta vừa tạo ở trên
import { useGameController } from "../../controllers/gameController";

export default function GamePage() {
  // Gọi controller để lấy ra các thông tin cần thiết
  const {
    currentStage,
    currentQuestion,
    currentQuestionIdx,
    totalQuestionsInStage,
    hearts,
    isDistorted,
    showHintIdx,
    gameState,
    handleAnswer,
    revealHint,
    resetGame,
  } = useGameController();

  // --- Render Logic ---
  if (gameState === "WON") return <VideoEndScreen type="SUCCESS" onReset={resetGame} />;
  if (gameState === "LOST") return <VideoEndScreen type="FAIL" onReset={resetGame} />;
  if (!currentStage || !currentQuestion) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className={`min-h-screen pt-10 pb-20 p-8 transition-all duration-500 ${isDistorted ? "distort-effect" : "bg-slate-50"}`}>
      
      {/* HUD: Thông tin người chơi */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border-2 border-emerald-100">
        <div>
          <span className="text-xl font-bold text-emerald-700">{currentStage.stage.toUpperCase()}</span>
          <p className="text-sm text-slate-500">Câu hỏi: {currentQuestionIdx + 1} / {totalQuestionsInStage}</p>
        </div>
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-2xl ${i < hearts ? "grayscale-0" : "grayscale opacity-30"}`}>❤️</span>
          ))}
        </div>
      </div>

      {/* BẢN ĐỒ GAME */}
      <div className="max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-slate-300">
        <img src="/images/game/game-map.jpg" alt="Game Map" className="w-full h-auto object-cover max-h-64" />
      </div>

      {/* Giao diện câu hỏi */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white relative z-10">
        {currentQuestion.image && (
          <img src={currentQuestion.image} alt="Question" className="w-full h-48 object-cover" />
        )}
        
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">{currentQuestion.question}</h2>

          {/* Nút Gợi ý */}
          {currentQuestion.hints && (
            <div className="flex gap-2 mb-6">
              {currentQuestion.hints.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => revealHint(i)}
                  className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm hover:bg-amber-200"
                >
                  🔍 Gợi ý {i + 1}
                </button>
              ))}
            </div>
          )}
          
          {/* Nội dung gợi ý */}
          <div className="mb-6 space-y-2">
            {showHintIdx.map((idx) => (
              <p key={idx} className="text-sm italic text-slate-600 bg-slate-100 p-2 rounded">
                - {currentQuestion.hints?.[idx]}
              </p>
            ))}
          </div>

          {/* Các nút đáp án */}
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className="w-full p-4 text-left border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex items-center gap-3"
              >
                <span className="font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg">{key}</span>
                <span className="font-medium text-slate-700">{value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pixel Art Character */}
      <div className="fixed bottom-10 left-10 w-24 h-24 bg-blue-400 rounded-lg flex items-center justify-center text-white border-4 border-blue-600">
        [Player]
      </div>

      <style jsx>{`
        .distort-effect {
          filter: hue-rotate(90deg) contrast(150%) blur(2px);
          animation: shake 0.2s infinite;
        }
        @keyframes shake {
          0% { transform: translate(3px, 3px); }
          50% { transform: translate(-3px, -3px); }
          100% { transform: translate(3px, 3px); }
        }
      `}</style>
    </div>
  );
}

// Component Màn hình kết thúc
function VideoEndScreen({ type, onReset }: { type: "SUCCESS" | "FAIL", onReset: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      <h1 className={`text-4xl font-bold mb-8 text-center ${type === "SUCCESS" ? "text-emerald-400" : "text-red-500"}`}>
        {type === "SUCCESS" ? "CHÚC MỪNG BẠN ĐÃ VƯỢT QUA CÁM DỖ!" : "BẠN ĐÃ BỊ CÁM DỖ..."}
      </h1>
      <div className="aspect-video w-full max-w-4xl bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-600 shadow-2xl">
         <video 
            src={type === "SUCCESS" ? "/videos/happy-life.mp4" : "/videos/dark-life.mp4"} 
            autoPlay 
            controls 
            className="w-full h-full object-contain"
          />
      </div>
      <button 
        onClick={onReset}
        className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-slate-200"
      >
        CHƠI LẠI
      </button>
    </div>
  );
}