"use client";

import { useState, useEffect } from "react";

// --- Types ---
type QuestionType = "IMAGE" | "TEXT" | "SITUATION" | "DETECTIVE";

interface Question {
  id: number;
  type: QuestionType;
  content: string;
  options: string[];
  correctIdx: number;
  image?: string;
  hints?: string[]; // Dành cho câu hỏi phá án
}

// --- Mock Data (Bạn có thể fetch từ Prisma sau) ---
const STAGE_QUESTIONS: Question[] = [
  {
    id: 1,
    type: "IMAGE",
    content: "Bạn thấy một vật phẩm hình viên kẹo màu sắc sặc sỡ này trên bàn. Bạn sẽ làm gì?",
    options: ["Thử một chút xem sao", "Bỏ đi và báo người lớn"],
    correctIdx: 1,
    image: "/images/drug-candy.jpg"
  },
  {
    id: 2,
    type: "DETECTIVE",
    content: "Vụ án: Có một gói bột lạ trong ngăn kéo của A. Hãy xem gợi ý để kết luận.",
    hints: ["Gói bột không có nhãn mác", "A dạo này rất hay cáu gắt", "A thường xuyên thức đêm khuya"],
    options: ["Bột mì nấu ăn", "Chất cấm gây nghiện", "Phấn rôm"],
    correctIdx: 1
  }
];

export default function GamePage() {
  // --- Game State ---
  const [stage, setStage] = useState(1);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [isDistorted, setIsDistorted] = useState(false); // Hiệu ứng phê thuốc
  const [showHintIdx, setShowHintIdx] = useState<number[]>([]);
  const [gameState, setGameState] = useState<"PLAYING" | "WON" | "LOST">("PLAYING");

  const currentQuestion = STAGE_QUESTIONS[currentQuestionIdx];

  // --- Handlers ---
  const handleAnswer = (index: number) => {
    if (index === currentQuestion.correctIdx) {
      // TRẢ LỜI ĐÚNG
      if (currentQuestionIdx + 1 < STAGE_QUESTIONS.length) {
        setCurrentQuestionIdx(prev => prev + 1);
        setShowHintIdx([]); // Reset gợi ý cho câu sau
      } else {
        setGameState("WON"); // Hoàn thành chặng
      }
    } else {
      // TRẢ LỜI SAI
      setHearts(prev => prev - 1);
      
      // Nếu là câu hỏi nhận biết ma túy mà chọn "Thử"
      if (currentQuestion.type === "IMAGE" || currentQuestion.type === "TEXT") {
        triggerDistortion();
      }

      if (hearts - 1 <= 0) {
        setGameState("LOST");
      }
    }
  };

  const triggerDistortion = () => {
    setIsDistorted(true);
    setTimeout(() => setIsDistorted(false), 3000); // Hết nhiễu sau 3 giây
  };

  // --- Render Logic ---
  if (gameState === "WON") return <VideoEndScreen type="SUCCESS" />;
  if (gameState === "LOST") return <VideoEndScreen type="FAIL" />;

  return (
    <div className={`min-h-screen pt-24 p-8 transition-all duration-500 ${isDistorted ? "distort-effect" : "bg-slate-50"}`}>
      
      {/* HUD: Thông tin người chơi */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border-2 border-emerald-100">
        <div>
          <span className="text-xl font-bold text-emerald-700">CHẶNG {stage}</span>
          <p className="text-sm text-slate-500">Câu hỏi: {currentQuestionIdx + 1}/5</p>
        </div>
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-2xl ${i < hearts ? "grayscale-0" : "grayscale opacity-30"}`}>❤️</span>
          ))}
        </div>
      </div>

      {/* Giao diện câu hỏi */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white">
        {currentQuestion.image && (
          <img src={currentQuestion.image} alt="Drug" className="w-full h-48 object-cover" />
        )}
        
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">{currentQuestion.content}</h2>

          {/* Phần gợi ý cho câu hỏi phá án */}
          {currentQuestion.type === "DETECTIVE" && (
            <div className="flex gap-2 mb-6">
              {currentQuestion.hints?.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setShowHintIdx(prev => [...prev, i])}
                  className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm hover:bg-amber-200"
                >
                  🔍 Gợi ý {i + 1}
                </button>
              ))}
            </div>
          )}
          
          {/* Nội dung gợi ý đang xem */}
          <div className="mb-6 space-y-2">
            {showHintIdx.map(idx => (
              <p key={idx} className="text-sm italic text-slate-600 bg-slate-100 p-2 rounded">
                - {currentQuestion.hints?.[idx]}
              </p>
            ))}
          </div>

          {/* Danh sách đáp án */}
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full p-4 text-left border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-colors font-medium text-slate-700"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pixel Art Character Placeholder */}
      <div className="fixed bottom-10 left-10 w-24 h-24 bg-blue-400 rounded-lg flex items-center justify-center text-white border-4 border-blue-600">
        [Player]
      </div>

      <style jsx>{`
        .distort-effect {
          filter: hue-rotate(180deg) contrast(150%) blur(1px);
          animation: shake 0.2s infinite;
        }
        @keyframes shake {
          0% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, -2px); }
          100% { transform: translate(2px, 2px); }
        }
      `}</style>
    </div>
  );
}

function VideoEndScreen({ type }: { type: "SUCCESS" | "FAIL" }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-center flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        {type === "SUCCESS" ? "CHÚC MỪNG BẠN ĐÃ CHIẾN THẮNG!" : "BẠN ĐÃ THẤT BẠI..."}
      </h1>
      <div className="aspect-video w-full max-w-4xl bg-slate-800 rounded-lg overflow-hidden border-2 border-white shadow-2xl">
         {/* Thay src bằng link video AI của bạn */}
         <video 
            src={type === "SUCCESS" ? "/videos/happy-life.mp4" : "/videos/dark-life.mp4"} 
            autoPlay 
            controls 
            className="w-full h-full object-contain"
          />
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-emerald-400"
      >
        CHƠI LẠI
      </button>
    </div>
  );
}