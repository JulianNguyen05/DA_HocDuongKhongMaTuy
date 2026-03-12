"use client";
import { motion } from "framer-motion";
import { LawNodeData } from "@/models/Tree";

interface Props {
  selectedLaw: LawNodeData;
  onClose: () => void;
}

export default function TreeDetailModal({ selectedLaw, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      // ✅ SỬA 1: Đổi "fixed" thành "absolute" để bảng chỉ nằm gọn lỏn trong khung chứa cây.
      // ✅ SỬA 2: Đổi "h-[100dvh]" thành "h-full" để không bị tràn qua Header.
      // ✅ SỬA 3: Tăng chiều rộng w-[...] lên 60% (và 55% cho màn hình cực to) để bảng vươn sát lại trục quay.
      className="absolute top-0 right-0 w-full md:w-[100%] lg:w-[70%] xl:w-[75%] h-full flex flex-col justify-center p-4 sm:p-6 md:pr-12 md:pl-2 z-50 pointer-events-none"
    >
      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-emerald-100 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500 relative pointer-events-auto w-full">
        
        {/* NÚT ĐÓNG */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors font-bold text-lg z-10"
        >
          ✕
        </button>

        {/* TIÊU ĐỀ */}
        <div className="mb-6 border-b-2 border-emerald-50 pb-5 text-center mt-6 md:mt-0 px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-emerald-800 mb-2">{selectedLaw.article}</h2>
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-600">{selectedLaw.name}</h3>
        </div>

        {/* NỘI DUNG CHI TIẾT */}
        <div className="space-y-4 md:space-y-5">
          {selectedLaw.details.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-emerald-50/60 p-4 md:p-6 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors"
            >
              <h4 className="font-extrabold text-emerald-800 text-base md:text-lg mb-2">{detail.title}</h4>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">{detail.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}