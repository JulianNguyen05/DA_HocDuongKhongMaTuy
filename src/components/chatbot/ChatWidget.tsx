// src\components\chatbot\ChatWidget.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      
      {/* Khung Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="mb-0 sm:mb-4 origin-bottom-right"
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút bật tắt Widget */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Mở trợ lý ảo"
            className="bg-emerald-600 hover:bg-emerald-700 p-4 rounded-full shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-center justify-center border-2 border-[#D1FAE0] relative outline-none"
          >
            {/* Icon Chat */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>

            {/* Chữ hiển thị khi hover (Chỉ hiện trên PC) */}
            <span className="hidden sm:inline-block max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 text-white font-semibold transition-all duration-500 ease-in-out whitespace-nowrap">
              Trợ lý ảo 24/7
            </span>

            {/* Badge thông báo nhỏ */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D1FAE0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}