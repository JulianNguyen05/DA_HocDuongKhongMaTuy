"use client";
import { useState } from "react";
import FlashcardItem from "./FlashcardItem";
import { DrugCategories } from "@/models/Flashcard";

type CategoryKey = keyof DrugCategories;

export default function FlashcardBoard({ initialData }: { initialData: DrugCategories }) {
  const [activeTab, setActiveTab] = useState<CategoryKey>("tu_nhien");

  return (
    <div className="w-full pt-8 pb-24">
      {/* TABS MENU - Phong cách tối giản (Minimalist Tabs) */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-16 max-w-3xl mx-auto px-4">
        {(Object.keys(initialData) as CategoryKey[]).map((key) => {
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
        {initialData[activeTab].drugs.map((drug, index) => (
          <FlashcardItem 
            key={index}
            name={drug.name}
            imageUrl={drug.imageUrl} // Lấy ảnh từ DB truyền vào
            shortDesc={drug.shortDesc}
            details={drug.details}
          />
        ))}
      </div>
    </div>
  );
}