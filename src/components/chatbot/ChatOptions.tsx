"use client";

type Option = { id: string; label: string };

interface ChatOptionsProps {
  options: Option[];
  onSelect: (id: string, label: string) => void;
  disabled: boolean;
}

export default function ChatOptions({ options, onSelect, disabled }: ChatOptionsProps) {
  return (
    <div className="flex flex-col gap-2.5 mt-2 w-full max-w-[85%]">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id, opt.label)}
          disabled={disabled}
          className="text-left bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-500 hover:text-white transition-all px-4 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          💬 {opt.label}
        </button>
      ))}
    </div>
  );
}