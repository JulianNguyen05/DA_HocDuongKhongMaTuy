"use client";
import { useState } from "react";
import FlashcardItem from "./FlashcardItem";
import { DrugCategories } from "@/models/Flashcard";

type CategoryKey = keyof DrugCategories;

export default function FlashcardBoard({ initialData }: { initialData: DrugCategories }) {
  const [activeTab, setActiveTab] = useState<CategoryKey>("tu_nhien");

  return (
    <>
      {/* TABS MENU */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-16 max-w-4xl mx-auto px-4">
        {(Object.keys(initialData) as CategoryKey[]).map((key) => {
          const isActive = activeTab === key;
          const theme = initialData[key].theme;
          
          // Đổi màu Tab dựa theo theme đang chọn
          const activeBg = theme === "green" ? "bg-brand-green" : theme === "purple" ? "bg-brand-purple" : "bg-brand-orange";

          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                isActive
                  ? `${activeBg} text-white shadow-lg scale-105 -translate-y-1`
                  : `bg-white text-gray-400 hover:bg-gray-50 border-2 border-transparent`
              }`}
            >
              {initialData[key].title}
            </button>
          );
        })}
      </div>

      {/* HIỂN THỊ THẺ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {initialData[activeTab].drugs.map((drug, index) => (
          <FlashcardItem 
            key={index}
            name={drug.name}
            shortDesc={drug.shortDesc}
            details={drug.details}
            theme={initialData[activeTab].theme}
          />
        ))}
      </div>
    </>
  );
}