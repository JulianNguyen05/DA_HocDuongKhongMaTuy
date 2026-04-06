"use client";

import { GameQuestion } from "@/lib/constants/gameConstants";

interface QuestionModalProps {
  stageName: string;
  hearts: number;
  totalQuestions: number;
  displayQuestion: GameQuestion | null;
  displayIdx: number;
  frozenQuestion: GameQuestion | null;
  selectedKey: string | null;
  damageAnim: boolean;
  onAnswerSubmit: (key: string) => void;
}

export default function QuestionModal({
  stageName,
  hearts,
  totalQuestions,
  displayQuestion,
  displayIdx,
  frozenQuestion,
  selectedKey,
  damageAnim,
  onAnswerSubmit,
}: QuestionModalProps) {
  if (!displayQuestion) return null;

  return (
    <div className="absolute inset-0 z-[80] bg-black/70 flex flex-col items-center justify-center p-2 md:p-4">
      {/* HIỆU ỨNG TIM VỠ (-1 MÁU) */}
      {damageAnim && (
        <div className="absolute z-[90] pointer-events-none flex flex-col items-center justify-center">
          <span className="text-6xl md:text-8xl drop-shadow-2xl animate-heart-break">
            💔
          </span>
          <span className="text-red-500 text-3xl md:text-4xl font-black mt-2 drop-shadow-lg animate-heart-break stroke-black">
            -1 TIM
          </span>
        </div>
      )}

      <div
        className={`bg-white p-4 md:p-8 rounded-xl shadow-2xl w-[95%] max-w-2xl max-h-[90vh] md:max-h-[85vh] flex flex-col transition-transform ${damageAnim ? "scale-95 border-4 border-red-500" : "scale-100 animate-fade-in"}`}
      >
        {/* HEADER CÂU HỎI */}
        <div className="flex justify-between items-center mb-3 md:mb-6 border-b pb-2 md:pb-3 shrink-0">
          <span className="text-sm md:text-xl font-bold text-blue-800 line-clamp-1">
            {stageName || "Chặng Bí Ẩn"}
          </span>
          <span className="text-sm md:text-xl font-bold text-red-500 bg-red-50 px-2 md:px-3 py-1 rounded-full border border-red-100 whitespace-nowrap ml-2">
            ❤️ x {hearts}
          </span>
        </div>

        {/* NỘI DUNG */}
        <div className="overflow-y-auto no-scrollbar flex-1 pb-2">
          <div className="mb-2 text-[10px] md:text-sm font-semibold text-gray-500 bg-gray-100 rounded-full py-0.5 md:py-1 w-fit mx-auto px-3">
            Câu: {displayIdx + 1} / {totalQuestions}
          </div>

          <h2 className="text-base md:text-2xl font-bold text-gray-800 mb-4 md:mb-8 text-center">
            {displayQuestion.question}
          </h2>

          {/* CÁC LỰA CHỌN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {Object.entries(displayQuestion.options).map(([key, value]) => {
              let btnClass =
                "p-2 md:p-4 rounded-lg transition-all border-2 shadow-sm text-left flex items-start gap-1 md:gap-3 outline-none";

              // LOGIC ĐỔI MÀU NÚT KHI ĐÓNG BĂNG ĐÁP ÁN
              if (frozenQuestion) {
                const correctKey =
                  displayQuestion.correctOption ||
                  displayQuestion.correctAnswer;
                const isCorrect = correctKey ? key === correctKey : false;
                const isSelected = key === selectedKey;

                if (isCorrect) {
                  btnClass +=
                    " bg-green-500 border-green-500 text-white font-bold scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.8)] z-10";
                } else if (isSelected) {
                  btnClass +=
                    " bg-red-500 border-red-600 text-white font-bold opacity-90 shadow-[0_0_15px_rgba(239,68,68,0.8)]";
                } else {
                  btnClass +=
                    " bg-gray-200 border-gray-300 text-gray-400 font-semibold opacity-50";
                }
              } else {
                btnClass +=
                  " bg-gray-50 border-gray-200 text-gray-800 font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-pointer active:scale-95";
              }

              return (
                <button
                  key={key}
                  onClick={() => onAnswerSubmit(key)}
                  disabled={!!frozenQuestion}
                  className={btnClass}
                >
                  <span
                    className={`font-bold mr-2 ${frozenQuestion ? "" : "text-blue-600"}`}
                  >
                    {key}.
                  </span>
                  <span className="leading-snug">
                    {value as React.ReactNode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
