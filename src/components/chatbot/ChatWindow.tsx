"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatOptions from "./ChatOptions";
import { getChatbotResponse } from "@/controllers/chatbotController";

type Message = { id: string; text: string; sender: "bot" | "user" };

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
      text: "Xin chào! Tôi là Trợ lý AI 24/7.\nBạn có thể chọn câu hỏi bên dưới hoặc **gõ từ khóa** để tra cứu nhé!",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const processMessage = async (query: string, displayLabel: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: displayLabel, sender: "user" },
    ]);
    setIsLoading(true);
    const responseText = await getChatbotResponse(query);
    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), text: responseText, sender: "bot" },
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
    // THU NHỎ KÍCH THƯỚC: w-[380px], h-[600px]
    <div className="flex flex-col w-[90vw] sm:w-[380px] h-[600px] bg-[#f9fbf9] rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 relative">
      {/* Header */}
      <div className="bg-emerald-600 px-5 py-3 flex items-center justify-between shadow-md z-10 shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner mr-3">
            🤖
          </div>
          <div>
            <h2 className="text-white font-bold text-base">Trợ lý ảo 24/7</h2>
            <p className="text-emerald-100 text-xs">Sẵn sàng hỗ trợ</p>
          </div>
        </div>

        {/* Nút Đóng (X) */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 hover:bg-emerald-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xl font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Vùng Chat */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-emerald-200 pb-20">
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
          <div className="flex items-center text-emerald-600 text-xs mt-2 ml-4">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animation-delay-400"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ô Nhập */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shrink-0">
        <form onSubmit={handleSubmitText} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Nhập câu hỏi..."
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            aria-label="Gửi tin nhắn" // Thêm dòng này cho trình đọc màn hình
            title="Gửi" // Thêm dòng này để hiện tooltip khi di chuột vào
            className="text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl px-4 py-2.5 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-4 h-4 transform rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
