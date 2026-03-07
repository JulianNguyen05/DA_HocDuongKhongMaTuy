import { fetchFlashcards } from "@/controllers/flashcardController";
import FlashcardBoard from "@/components/flashcard/FlashcardBoard";

// Bỏ 'use client' vì đây là Server Component làm nhiệm vụ gọi API/Database
export default async function FlashcardPage() {
  // Lấy dữ liệu XỊN từ Database thông qua Controller
  const flashcardData = await fetchFlashcards();

  return (
    <div className="min-h-[75vh] py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-blue uppercase mb-4 tracking-tight drop-shadow-sm">
          Từ Điển Nhận Diện
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
          Trang bị khiên chắn kiến thức để bảo vệ bản thân và bạn bè. Khám phá các nhóm chất gây nghiện phổ biến hiện nay!
        </p>
      </div>

      {/* Bơm dữ liệu DB vào giao diện tương tác */}
      <FlashcardBoard initialData={flashcardData} />
    </div>
  );
}