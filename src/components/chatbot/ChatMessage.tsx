"use client";

import React from "react";

export default function ChatMessage({ text, sender }: { text: string; sender: "bot" | "user" }) {
  const isBot = sender === "bot";
  
  // Hàm xử lý định dạng text cơ bản (xuống dòng và in đậm)
  const renderText = (content: string) => {
    return content.split('\n').map((line, idx) => (
      <span key={idx} className="block min-h-[1.2rem]">
        {line.split(/(\*\*.*?\*\*)/).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="italic text-emerald-700">{part.slice(1, -1)}</em>;
          }
          return part;
        })}
      </span>
    ));
  };

  return (
    <div className={`flex w-full mb-4 ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed ${
          isBot
            ? "bg-white text-gray-700 border border-emerald-100 rounded-tl-none shadow-sm"
            : "bg-emerald-500 text-white rounded-tr-none shadow-md"
        }`}
      >
        {renderText(text)}
      </div>
    </div>
  );
}