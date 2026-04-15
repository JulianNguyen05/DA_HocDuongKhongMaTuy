// src\app\chatbot\page.tsx
export const dynamic = "force-dynamic";

import ChatWindow from "@/components/chatbot/ChatWindow";

export const metadata = {
  title: "Trợ lý ảo 24/7 - Học đường Không Ma túy",
};

export default function ChatbotPage() {
  return (
    <main className="min-h-screen bg-emerald-50/40 pt-28 pb-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-emerald-800 mb-4">
          Hỗ Trợ Trực Tuyến 24/7
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Giải đáp tự động các thắc mắc về tác hại, dấu hiệu nhận biết ma túy và hướng dẫn kỹ năng phản ứng nhanh giúp bạn thoát hiểm an toàn.
        </p>
      </div>
      
      <ChatWindow />
    </main>
  );
}