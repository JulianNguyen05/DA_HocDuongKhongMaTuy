"use client";

import React from "react";

export default function ChatMessage({ text, sender }: { text: string; sender: "bot" | "user" }) {
  const isBot = sender === "bot";
  
  // Xử lý text (Bold, Italic, Xuống dòng)
  const renderText = (content: string) => {
    return content.split('\n').map((line, idx) => (
      <span key={idx} className="block min-h-[1.2rem] mb-1 last:mb-0">
        {line.split(/(\*\*.*?\*\*)/).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="italic opacity-80 text-[13px] block mt-1">{part.slice(1, -1)}</em>;
          }
          return part;
        })}
      </span>
    ));
  };

  return (
    <div className={`flex w-full mb-5 ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[88%] px-4 py-3 sm:px-5 sm:py-3.5 rounded-[1.25rem] text-[15px] leading-relaxed shadow-sm ${
          isBot
            // Bot: Nền xanh ngọc nhạt (#D1FAE0), chữ xanh lá thẫm để rõ nét
            ? "bg-[#D1FAE0] text-emerald-950 rounded-tl-sm"
            // User: Nền xanh lục (#10B981), chữ trắng
            : "bg-emerald-600 text-white rounded-tr-sm"
        }`}
      >
        {renderText(text)}
      </div>
    </div>
  );
}