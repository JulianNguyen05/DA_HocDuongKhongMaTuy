// src/components/flashcard/FlashcardBoard.tsx
"use client";
import { useState } from "react";
import FlashcardItem from "./FlashcardItem";

// ===== ĐỊNH NGHĨA KHOẢN MỤC DỮ LIỆU ĐỂ TRÁNH LỖI 'any' CỦA ESLINT =====
export interface DrugItem {
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

export interface FlashcardData {
  [key: string]: {
    title: string;
    drugs: DrugItem[];
  };
}

export default function FlashcardBoard({ initialData }: { initialData: FlashcardData }) {
  const tabs = Object.keys(initialData);
  
  // Khởi tạo tab mặc định ngay từ đầu, KHÔNG dùng useEffect để tránh lỗi React cascading renders
  const [activeTab, setActiveTab] = useState<string>(tabs[0] || "");

  // Nếu không có tab nào hoặc dữ liệu chưa sẵn sàng thì không hiển thị
  if (!activeTab || !initialData[activeTab]) return null;

  return (
    <div className="w-full pt-8 pb-24">
      {/* TABS MENU */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-16 max-w-3xl mx-auto px-4">
        {tabs.map((key) => {
          const isActive = activeTab === key;
          
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-gray-900 text-white shadow-md scale-105"
                  : "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {initialData[key].title}
            </button>
          );
        })}
      </div>

      {/* HIỂN THỊ THẺ MA TÚY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {initialData[activeTab].drugs.map((drug: DrugItem, index: number) => (
          <FlashcardItem 
            key={index}
            name={drug.name}
            imageUrl={drug.imageUrl}
            shortDesc={drug.shortDesc}
            scientificName={drug.scientificName}
            otherNames={drug.otherNames}
            concept={drug.concept}
            origin={drug.origin}
            distribution={drug.distribution}
            identification={drug.identification || []}
            harmfulEffects={drug.harmfulEffects || []}
          />
        ))}
      </div>
    </div>
  );
}