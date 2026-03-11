"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Khung Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-4 origin-bottom-right"
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút bật tắt với thiết kế UI cực xịn của bạn */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Mở trợ lý ảo"
            className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 p-4 rounded-full shadow-[0_10px_25px_rgba(124,58,237,0.5)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-center justify-center border border-white/20 relative outline-none"
          >
            {/* Icon Chat trắng tinh tế */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>

            {/* Chữ */}
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 text-white font-bold transition-all duration-500 ease-in-out whitespace-nowrap">
              Trợ lý giải đáp thắc mắc
            </span>

            {/* Badge thông báo nhỏ */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}