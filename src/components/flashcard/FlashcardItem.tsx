"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface DrugCardProps {
  name: string;
  imageUrl?: string | null;
  shortDesc: string;
  details: string[];
}

export default function FlashcardItem({ name, imageUrl, shortDesc, details }: DrugCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const imageSrc = imageUrl || "/no-image.jpg";

  return (
    <>
      <div 
        // Điều chỉnh chiều cao thẻ gọn lại một chút (h-[28rem] ~ 448px)
        className="relative w-full max-w-[480px] h-[28rem] mx-auto cursor-pointer group perspective-1000 z-10"
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div 
          className={`w-full h-full duration-700 relative preserve-3d transition-transform ${isFlipped ? "rotate-y-180" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ----- MẶT TRƯỚC ----- */}
          <div 
            className="absolute w-full h-full backface-hidden bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Ảnh minh họa */}
            <div className="relative w-full h-2/5 bg-gray-50 border-b border-gray-100 flex items-center justify-center p-2">
              <Image 
                src={imageSrc} 
                alt={name} 
                fill 
                unoptimized
                priority
                className="object-contain p-4" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            {/* Chữ mặt trước */}
            <div className="p-6 flex flex-col justify-between flex-grow text-center">
              <div className="flex-grow flex items-center justify-center">
                {/* Đã giảm size: text-2xl md:text-3xl */}
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-950 leading-tight">
                  {name}
                </h3>
              </div>
              
              <p className="text-gray-400 text-xs mt-4 font-bold tracking-widest uppercase bg-gray-50 px-4 py-1.5 rounded-full w-fit mx-auto">
                Chạm để lật
              </p>
            </div>
          </div>

          {/* ----- MẶT SAU ----- */}
          <div 
            className="absolute w-full h-full backface-hidden bg-gray-950 text-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center rotate-y-180 border border-gray-800"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Đã giảm size: text-xl */}
            <h3 className="text-xl font-extrabold border-b border-white/10 pb-4 mb-4 w-full uppercase tracking-wider text-green-500 leading-snug">
              {name}
            </h3>
            
            {/* Đã giảm size: text-base */}
            <p className="text-base leading-relaxed mb-8 font-medium text-gray-300 line-clamp-5 overflow-hidden">
              {shortDesc}
            </p>
            
            {/* FIX NÚT HOVER: Dùng text-gray-900 mặc định, hover sang nền green-600 chữ trắng an toàn tuyệt đối */}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
              className="bg-white hover:bg-green-600 text-gray-900 hover:text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Xem chi tiết tác hại
            </button>
          </div>
        </div>
      </div>

      {/* ----- CỬA SỔ CHI TIẾT (Modal) ----- */}
      <AnimatePresence>
        {showDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[120] flex items-center justify-center p-4 md:p-6 backdrop-blur-md" 
            onClick={() => setShowDetail(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] max-w-xl w-full p-8 relative shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDetail(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-950 transition-colors"
              >
                ✕
              </button>
              
              {/* Đã giảm size: text-2xl */}
              <h2 className="text-2xl font-black mb-8 uppercase tracking-tight text-gray-950 border-l-6 border-green-500 pl-4 leading-none">
                {name}
              </h2>
              
              {/* Đã giảm size: text-base */}
              <div className="space-y-3 mb-8 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin">
                {details.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl flex items-start gap-3 border border-gray-100 transition-hover hover:border-green-500/20 hover:bg-green-500/5">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-base font-medium leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setShowDetail(false)}
                className="w-full bg-gray-950 hover:bg-green-600 text-white py-3.5 rounded-xl text-sm tracking-widest font-bold shadow-lg transition-colors uppercase"
              >
                Đã hiểu rõ tác hại
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}