import { useState } from "react";
import gameData from "@/lib/data/question.json"; // Đường dẫn tới file JSON của bạn

// --- Export Types để dùng lại được ở các file khác ---
export interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correctOption: string;
  type?: "IMAGE" | "TEXT" | "SITUATION" | "DETECTIVE";
  image?: string;
  hints?: string[];
}

export interface StageData {
  stage: string;
  questions: Question[];
}

export function useGameController() {
  const stages: StageData[] = gameData as StageData[];

  // --- Game State ---
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [isDistorted, setIsDistorted] = useState(false);
  const [showHintIdx, setShowHintIdx] = useState<number[]>([]);
  const [gameState, setGameState] = useState<"PLAYING" | "WON" | "LOST">("PLAYING");

  // Dữ liệu hiển tại
  const currentStage = stages[currentStageIdx];
  const currentQuestion = currentStage?.questions[currentQuestionIdx];

  // --- Actions ---
  const triggerDistortion = () => {
    setIsDistorted(true);
    setTimeout(() => setIsDistorted(false), 3000);
  };

  const handleAnswer = (selectedKey: string) => {
    if (!currentQuestion) return;

    // KIỂM TRA ĐÚNG/SAI
    const isCorrect = selectedKey === currentQuestion.correctOption;

    if (isCorrect) {
      // TRẢ LỜI ĐÚNG
      // (Có thể thêm code cộng điểm ở đây)
    } else {
      // TRẢ LỜI SAI
      setHearts((prev) => prev - 1);
      triggerDistortion();

      if (hearts - 1 <= 0) {
        setGameState("LOST");
        return; // Hết tim thì ngưng luôn, không chuyển câu nữa
      }
    }

    // ĐOẠN NÀY LÀ LOGIC CHUYỂN CÂU/CHUYỂN CHẶNG DÙNG CHUNG CHO CẢ ĐÚNG LẪN SAI
    if (currentQuestionIdx + 1 < currentStage.questions.length) {
      // Qua câu tiếp theo trong cùng chặng
      setCurrentQuestionIdx((prev) => prev + 1);
      setShowHintIdx([]);
    } else {
      // Hết câu của chặng -> Chuyển chặng mới
      if (currentStageIdx + 1 < stages.length) {
        setCurrentStageIdx((prev) => prev + 1);
        setCurrentQuestionIdx(0);
        setShowHintIdx([]);
      } else {
        // Hết tất cả chặng -> Thắng game
        setGameState("WON");
      }
    }
  };

  const revealHint = (index: number) => {
    if (!showHintIdx.includes(index)) {
      setShowHintIdx((prev) => [...prev, index]);
    }
  };

  const resetGame = () => {
    setCurrentStageIdx(0);
    setCurrentQuestionIdx(0);
    setHearts(5);
    setIsDistorted(false);
    setShowHintIdx([]);
    setGameState("PLAYING");
  };

  // Trả về các state và hàm để giao diện (page.tsx) sử dụng
  return {
    currentStage,
    currentQuestion,
    currentQuestionIdx,
    totalQuestionsInStage: currentStage?.questions.length || 0,
    hearts,
    isDistorted,
    showHintIdx,
    gameState,
    handleAnswer,
    revealHint,
    resetGame,
  };
}