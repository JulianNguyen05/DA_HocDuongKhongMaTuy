// src\components\chatbot\ChatWindow.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatOptions from "./ChatOptions";
import { getChatbotResponse } from "@/controllers/chatbotController";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
};

const FIXED_OPTIONS = [
  { id: "q_tac_hai", label: "Dấu hiệu nhận biết và tác hại?" },
  { id: "q_ky_nang", label: "Kỹ năng thoát hiểm?" },
  { id: "q_phap_luat", label: "Khung hình phạt pháp luật?" },
];

interface ChatWindowProps {
  onClose?: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Xin chào! Tôi là Trợ lý AI 24/7.\nBạn có thể chọn câu hỏi bên dưới hoặc gõ từ khóa để tra cứu nhé!",
      sender: "bot",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const processMessage = async (query: string, displayLabel: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: displayLabel,
        sender: "user",
      },
    ]);

    setIsLoading(true);

    const responseText = await getChatbotResponse(query);

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
      },
    ]);

    setIsLoading(false);
  };

  const handleSelectOption = (id: string, label: string) => {
    processMessage(id, label);
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    processMessage(userText, userText);
  };

  return (
    <div
      className="
      flex flex-col

      w-[92vw] max-w-[360px]
      h-[75dvh] max-h-[520px]

      landscape:h-[85dvh]

      sm:w-[380px]
      md:w-[420px]

      sm:h-[50vh]
      sm:min-h-[450px]

      bg-[#f8faf9]

      rounded-[1.4rem]
      sm:rounded-[2rem]

      shadow-2xl
      overflow-hidden
      border-2 border-[#D1FAE0]

      z-[60]
    "
    >
      {/* HEADER */}
      <div className="bg-emerald-600 px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-sm border-2 border-[#D1FAE0]">
            🛡️
          </div>

          <div>
            <h2 className="text-white font-bold text-base sm:text-lg leading-tight">
              Trợ lý 24/7
            </h2>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#D1FAE0] animate-pulse"></span>

              <p className="text-[#D1FAE0] text-[11px] sm:text-xs font-medium">
                Sẵn sàng hỗ trợ
              </p>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ chat"
            className="text-white bg-white/10 hover:bg-white/20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 scrollbar-thin scrollbar-thumb-emerald-200">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} text={msg.text} sender={msg.sender} />
        ))}

        {!isLoading && messages[messages.length - 1].sender === "bot" && (
          <div className="mb-2">
            <ChatOptions
              options={FIXED_OPTIONS}
              onSelect={handleSelectOption}
              disabled={isLoading}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex w-full mb-4 justify-start">
            <div className="bg-[#D1FAE0] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>

              <div
                className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />

              <div
                className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="bg-white border-t border-emerald-100 p-3 sm:p-4 shrink-0">
        <form onSubmit={handleSubmitText} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Nhập câu hỏi..."
            className="
            flex-1
            bg-gray-50
            border border-emerald-100
            text-gray-800

            text-sm sm:text-[15px]

            rounded-xl sm:rounded-2xl

            focus:ring-2 focus:ring-[#D1FAE0]
            focus:border-emerald-400

            block w-full

            px-3 py-2
            sm:px-4 sm:py-3

            outline-none
            transition-all
            "
          />

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            aria-label="Gửi tin nhắn"
            className="
            text-white
            bg-emerald-600
            hover:bg-emerald-700

            rounded-xl sm:rounded-2xl

            w-10 h-10
            sm:w-12 sm:h-12

            flex items-center justify-center

            disabled:opacity-50
            disabled:cursor-not-allowed

            transition-colors
            "
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}