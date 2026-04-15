// src\components\chatbot\ChatOptions.tsx
"use client";

type Option = { id: string; label: string };

interface ChatOptionsProps {
  options: Option[];
  onSelect: (id: string, label: string) => void;
  disabled: boolean;
}

export default function ChatOptions({ options, onSelect, disabled }: ChatOptionsProps) {
  return (
    <div className="flex flex-col gap-2.5 mt-2 w-full max-w-[90%] pl-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id, opt.label)}
          disabled={disabled}
          // Nút trắng viền xanh, hover vào đổi sang màu #D1FAE0
          className="text-left bg-white border border-emerald-200 text-emerald-800 hover:bg-[#D1FAE0] hover:border-[#D1FAE0] hover:text-emerald-950 transition-all duration-300 px-4 py-3 rounded-2xl text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}