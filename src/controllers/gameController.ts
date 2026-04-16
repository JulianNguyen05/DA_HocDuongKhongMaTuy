import { useState } from "react";
import gameData from "@/lib/data/question.json"; // Đường dẫn tới file JSON của bạn

// --- Export Types để dùng lại được ở các file khác ---
export interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correctOption: string;
  reference?: string; // Thêm reference từ file JSON mới
  type?: "IMAGE" | "TEXT" | "SITUATION" | "DETECTIVE";
  image?: string;
  hints?: string[];
}

export interface StageData {
  stage: string;
  questions: Question[];
}

// Hàm xáo trộn Fisher-Yates
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Xáo trộn thứ tự các đáp án trong câu hỏi
function shuffleOptions(options: Record<string, string>): Record<string, string> {
  const entries = Object.entries(options);
  const shuffled = shuffleArray(entries);
  return Object.fromEntries(shuffled);
}

export function useGameController() {
  // Xáo trộn câu hỏi trong mỗi chặng (chỉ 1 lần khi khởi tạo)
  const [shuffledStages, setShuffledStages] = useState<StageData[]>(() =>
    (gameData as StageData[]).map((stage) => ({
      ...stage,
      questions: shuffleArray(stage.questions),
    }))
  );
  const stages = shuffledStages;

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

    if (!isCorrect) {
      // TRẢ LỜI SAI → Trừ tim
      setHearts((prev) => prev - 1);
      triggerDistortion();

      if (hearts - 1 <= 0) {
        setGameState("LOST");
        return; // Hết tim thì ngưng luôn, không chuyển câu nữa
      }
    }

    // CHUYỂN CÂU / CHẶNG (cả đúng lẫn sai đều qua câu tiếp theo)
    if (currentQuestionIdx + 1 < currentStage.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setShowHintIdx([]);
    } else {
      // Hết câu của chặng -> Chuyển chặng mới
      if (currentStageIdx + 1 < stages.length) {
        setCurrentStageIdx((prev) => prev + 1);
        setCurrentQuestionIdx(0);
        setShowHintIdx([]);
      } else {
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

  // Chơi lại chính chặng hiện tại (giữ nguyên currentStageIdx) + xáo trộn lại câu hỏi
  const restartCurrentStage = () => {
    // Xáo trộn lại câu hỏi của chặng hiện tại
    setShuffledStages((prev) =>
      prev.map((stage, idx) =>
        idx === currentStageIdx
          ? { ...stage, questions: shuffleArray(stage.questions) }
          : stage
      )
    );
    setCurrentQuestionIdx(0);
    setHearts(5);
    setIsDistorted(false);
    setShowHintIdx([]);
    setGameState("PLAYING");
  };

  // Trừ 1 máu, trả về số máu còn lại
  const loseOneHeart = (): number => {
    const newHearts = Math.max(0, hearts - 1);
    setHearts(newHearts);
    if (newHearts <= 0) {
      setGameState("LOST");
    }
    return newHearts;
  };

  const gainOneHeart = () => {
    setHearts((prev) => Math.min(5, prev + 1));
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
    currentReference: currentQuestion?.reference, // Trả về thông tin trích dẫn điều luật
    handleAnswer,
    revealHint,
    resetGame,
    restartCurrentStage,
    loseOneHeart,
    gainOneHeart,
  };
}