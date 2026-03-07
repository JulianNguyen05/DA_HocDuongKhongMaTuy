"use client";
import { useState } from "react";

interface DrugCardProps {
  name: string;
  shortDesc: string;
  details: string[];
  theme: "green" | "purple" | "orange";
}

export default function FlashcardItem({ name, shortDesc, details, theme }: DrugCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Chọn màu gradient tùy theo nhóm ma túy
  const themeStyles = {
    green: "from-brand-green to-emerald-400 border-brand-green/30 text-brand-green",
    purple: "from-brand-purple to-fuchsia-400 border-brand-purple/30 text-brand-purple",
    orange: "from-brand-orange to-amber-400 border-brand-orange/30 text-brand-orange"
  };

  const bgGradient = `bg-gradient-to-br ${themeStyles[theme].split(' ').slice(0, 2).join(' ')}`;
  const textTitle = themeStyles[theme].split(' ')[3];
  const borderFront = themeStyles[theme].split(' ')[2];

  return (
    <>
      <div 
        className="relative w-full h-72 cursor-pointer group perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`w-full h-full duration-700 relative preserve-3d transition-transform ${isFlipped ? "rotate-y-180" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ----- MẶT TRƯỚC ----- */}
          <div 
            className={`absolute w-full h-full backface-hidden bg-white border-2 ${borderFront} rounded-[2rem] shadow-sm flex flex-col items-center justify-center p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 text-4xl shadow-inner ${bgGradient} text-white`}>
              {theme === "green" ? "🌿" : theme === "purple" ? "🧪" : "💊"}
            </div>
            <h3 className={`text-2xl font-black uppercase tracking-tight ${textTitle}`}>{name}</h3>
            <p className="text-gray-400 text-sm mt-4 font-medium animate-bounce">Chạm để lật ↺</p>
          </div>

          {/* ----- MẶT SAU ----- */}
          <div 
            className={`absolute w-full h-full backface-hidden text-white rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-6 text-center rotate-y-180 ${bgGradient}`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <h3 className="text-xl font-bold border-b-2 border-white/20 pb-2 mb-4 w-full uppercase">{name}</h3>
            <p className="text-base leading-relaxed mb-6 line-clamp-3 drop-shadow-sm font-medium">{shortDesc}</p>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
              className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-6 py-2 rounded-full font-bold hover:bg-white hover:text-gray-900 transition shadow-lg"
            >
              Phân tích chi tiết 🔍
            </button>
          </div>
        </div>
      </div>

      {/* ----- CỬA SỔ CHI TIẾT ----- */}
      {showDetail && (
        <div className="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 relative shadow-2xl animate-fade-in-up border-4 border-white">
            <button 
              onClick={() => setShowDetail(false)}
              className="absolute top-4 right-4 bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
            <h2 className={`text-2xl font-black mb-6 uppercase ${textTitle}`}>{name}</h2>
            <div className="space-y-4 mb-8">
              {details.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                  <span className="text-brand-orange text-xl">⚠️</span>
                  <span className="text-gray-700 text-sm font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowDetail(false)}
              className={`w-full text-white py-3 rounded-2xl font-bold shadow-lg transition ${bgGradient} hover:opacity-90`}
            >
              Đã ghi nhớ!
            </button>
          </div>
        </div>
      )}
    </>
  );
}