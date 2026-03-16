"use client";
import { useState, useEffect } from "react"; // ✅ Đã thêm useEffect
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface DrugCardProps {
  name: string;
  imageUrl?: string | null;
  shortDesc?: string | null;
  scientificName?: string | null;
  otherNames?: string | null;
  concept?: string | null;
  origin?: string | null;
  distribution?: string | null;
  identification?: string[];
  harmfulEffects?: string[];
}

export default function FlashcardItem({ 
  name, 
  imageUrl, 
  shortDesc, 
  scientificName, 
  otherNames, 
  concept, 
  origin, 
  distribution, 
  identification = [], 
  harmfulEffects = [] 
}: DrugCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const imageSrc = imageUrl || "/no-image.jpg";

  // ✅ THÊM PHẦN NÀY: Khóa cuộn trang (body scroll lock) khi mở Modal
  useEffect(() => {
    if (showDetail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function để đảm bảo reset lại khi component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDetail]);

  return (
    <>
      <div 
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
            
            <div className="p-6 flex flex-col justify-between flex-grow text-center">
              <div className="flex-grow flex items-center justify-center">
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
            <h3 className="text-xl font-extrabold border-b border-white/10 pb-4 mb-4 w-full uppercase tracking-wider text-green-500 leading-snug">
              {name}
            </h3>
            
            <p className="text-base leading-relaxed mb-8 font-medium text-gray-300 line-clamp-5 overflow-hidden">
              {shortDesc || "Chưa có mô tả ngắn."}
            </p>
            
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
              className="bg-white rounded-[2rem] max-w-2xl w-full p-6 md:p-8 relative shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDetail(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-950 transition-colors z-10"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight text-gray-950 border-l-6 border-green-500 pl-4 leading-none shrink-0 pr-8">
                {name}
              </h2>
              
              {/* KHU VỰC CHỨA NỘI DUNG CUỘN */}
              <div className="space-y-6 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-grow pb-4">
                
                {/* Tên khoa học / Tên gọi khác */}
                {(scientificName || otherNames) && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {scientificName && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-bold text-gray-900">Tên khoa học: </span> 
                        <span className="italic">{scientificName}</span>
                      </p>
                    )}
                    {otherNames && (
                      <p className="text-sm text-gray-600">
                        <span className="font-bold text-gray-900">Tên gọi khác: </span> 
                        {otherNames}
                      </p>
                    )}
                  </div>
                )}

                {/* Khái niệm */}
                {concept && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Khái niệm
                    </h4>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                      {concept}
                    </p>
                  </div>
                )}

                {/* Nguồn gốc / Phân bố */}
                {(origin || distribution) && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Nguồn gốc & Phân bố
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm md:text-base leading-relaxed">
                      {origin && <li>{origin}</li>}
                      {distribution && <li>{distribution}</li>}
                    </ul>
                  </div>
                )}

                {/* Cách nhận biết */}
                {identification.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" /> Cách nhận biết
                    </h4>
                    <div className="space-y-2">
                      {identification.map((item, index) => (
                        <div key={index} className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-gray-700 text-sm md:text-base leading-relaxed">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tác hại nguy hiểm */}
                {harmfulEffects.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Tác hại nghiêm trọng
                    </h4>
                    <div className="space-y-2">
                      {harmfulEffects.map((item, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded-lg flex items-start gap-3 border border-red-100 transition-colors hover:bg-red-100/50">
                          <div className="text-red-500 mt-1 flex-shrink-0">⚠️</div>
                          <span className="text-gray-800 text-sm md:text-base font-medium leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
              
              <div className="pt-6 shrink-0 border-t border-gray-100">
                <button 
                  onClick={() => setShowDetail(false)}
                  className="w-full bg-gray-950 hover:bg-green-600 text-white py-3.5 rounded-xl text-sm tracking-widest font-bold shadow-lg transition-colors uppercase"
                >
                  Đã hiểu rõ tác hại
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}