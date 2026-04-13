"use client";

import { GameQuestion } from "@/lib/constants/gameConstants";

interface StageResultModalProps {
  correctCount: number;
  totalQuestions: number;
  incorrectQuestions: GameQuestion[];
  onClose: () => void;
}

export default function StageResultModal({
  correctCount,
  totalQuestions,
  incorrectQuestions,
  onClose,
}: StageResultModalProps) {
  return (
    <div className="absolute inset-0 z-[110] bg-black/80 flex flex-col items-center justify-center p-2 md:p-4 animate-fade-in touch-auto">
      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-2xl w-[95%] max-w-3xl max-h-[95vh] md:max-h-[90vh] flex flex-col relative border-4 border-blue-400">
        {/* HEADER */}
        <div className="text-center mb-4 md:mb-6 shrink-0">
          <h2 className="text-2xl md:text-4xl font-black text-blue-600 uppercase drop-shadow-sm">
            Hoàn thành chặng!
          </h2>
          <div className="mt-2 inline-block bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-full text-sm md:text-lg border-2 border-blue-200">
            Số câu trả lời đúng:{" "}
            <span className="text-green-600 text-lg md:text-xl">
              {correctCount}
            </span>{" "}
            / {totalQuestions}
          </div>
        </div>

        {/* CÂU SAI & LỜI KHUYÊN */}
        <div className="overflow-y-auto flex-1 mb-4 space-y-3 md:space-y-4 pr-1 md:pr-2 no-scrollbar">
          {incorrectQuestions.length > 0 ? (
            <>
              <h3 className="font-bold text-red-500 mb-2 md:text-lg text-center underline underline-offset-4">
                Ôn tập lại các câu sai:
              </h3>
              {incorrectQuestions.map((q, idx) => {
                const correctKey = q.correctOption || q.correctAnswer || "";

                const answerText = correctKey
                  ? q.options[correctKey]
                  : "Không có dữ liệu";

                return (
                  <div
                    key={idx}
                    className="bg-red-50 p-3 md:p-5 rounded-xl border-l-4 border-red-400 shadow-sm"
                  >
                    <p className="font-bold text-gray-800 text-xs md:text-base mb-2">
                      <span className="text-red-500">❌ Câu hỏi:</span>{" "}
                      {q.question}
                    </p>
                    
                    {/* Hiển thị đáp án đúng */}
                    <div className="text-xs md:text-sm text-green-700 font-bold mb-2 bg-green-100 p-2 rounded-lg flex items-start gap-1">
                      <span>✅ Đáp án đúng:</span>
                      <span>
                        {correctKey && `${correctKey}.`} {answerText}
                      </span>
                    </div>

                    {/* HIỂN THỊ REFERENCE (TRÍCH DẪN ĐIỀU LUẬT) */}
                    {q.reference && (
                      <div className="text-[10px] md:text-xs text-blue-700 italic bg-blue-50 p-2 rounded-lg border border-blue-100 mt-1 flex items-center gap-1">
                        <span className="not-italic">📖 Căn cứ pháp lý:</span>
                        <span className="font-semibold">{q.reference}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <span className="text-6xl md:text-8xl mb-4">🏆</span>
              <h3 className="text-green-600 font-black text-xl md:text-3xl">
                Tuyệt vời!
              </h3>
              <p className="text-gray-600 font-bold md:text-lg mt-2">
                Bạn đã trả lời đúng tất cả các câu hỏi trong chặng này!
              </p>
            </div>
          )}
        </div>

        {/* NÚT TIẾP TỤC */}
        <div className="shrink-0 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black text-lg md:text-xl rounded-xl shadow-[0_5px_15px_rgba(59,130,246,0.4)] hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all outline-none"
          >
            🚀 Tiếp tục hành trình
          </button>
        </div>
      </div>
    </div>
  );
}