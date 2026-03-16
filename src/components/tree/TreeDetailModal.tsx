"use client";
import { motion } from "framer-motion";
import { LawArticleData } from "@/models/Tree"; 

interface Props {
  selectedLaw: LawArticleData; 
  onClose: () => void;
}

export default function TreeDetailModal({ selectedLaw, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="absolute top-0 right-0 w-full lg:w-[70%] xl:w-[75%] h-full flex flex-col justify-start p-4 sm:p-6 md:pr-12 md:pl-2 z-50 pointer-events-none"
    >
      {/* FIX: Bỏ overflow-y-auto ở box ngoài cùng, biến nó thành flex container 
        để cố định kích thước và giữ nút Đóng nằm im.
      */}
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-emerald-100 relative pointer-events-auto w-full max-h-full flex flex-col overflow-hidden">
        
        {/* NÚT ĐÓNG (Bây giờ sẽ luôn ghim cố định góc phải) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors font-bold text-lg z-20"
        >
          ✕
        </button>

        {/* VÙNG CUỘN NỘI DUNG 
          Đưa padding và overflow-y-auto vào đây
        */}
        <div className="p-4 md:p-8 overflow-y-auto w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* TIÊU ĐỀ: ĐIỀU LUẬT */}
          <div className="mb-6 border-b-2 border-emerald-50 pb-5 text-center mt-6 md:mt-0 px-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-emerald-800 mb-2">
              Điều {selectedLaw.articleNum}
            </h2>
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-600">
              {selectedLaw.name}
            </h3>
          </div>

          {/* NỘI DUNG CHI TIẾT: KHOẢN VÀ ĐIỂM */}
          <div className="space-y-4 md:space-y-5">
            {selectedLaw.clauses.map((clause, index) => (
              <motion.div
                key={clause.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-4 md:p-6 rounded-2xl border transition-colors ${
                  clause.isAdditional 
                    ? "bg-amber-50 border-amber-200 hover:bg-amber-100" 
                    : "bg-emerald-50/60 border-emerald-100 hover:bg-emerald-50"
                }`}
              >
                {/* TÊN KHOẢN & TÓM TẮT HÌNH PHẠT */}
                <h4 className={`font-extrabold text-base md:text-lg mb-3 ${
                  clause.isAdditional ? "text-slate-700" : "text-emerald-800"
                }`}>
                  {clause.isAdditional 
                    ? clause.penaltySummary 
                    : `Khoản ${clause.clauseNum}: ${clause.penaltySummary}` 
                  }
                </h4>

                {/* DANH SÁCH CÁC ĐIỂM (TÌNH TIẾT) */}
                {clause.points.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {clause.points.map((point) => (
                      <li key={point.id} className="flex items-start text-gray-700 leading-relaxed text-sm md:text-base">
                        {point.pointLetter && (
                          <span className="font-bold mr-2 text-emerald-700 min-w-[20px]">
                            {point.pointLetter})
                          </span>
                        )}
                        <span>{point.content}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
}