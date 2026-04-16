// src/app/flashcard/page.tsx
import { fetchFlashcards } from "@/controllers/flashcardController";
import FlashcardBoard, { FlashcardData, DrugItem } from "@/components/flashcard/FlashcardBoard";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Từ Điển Nhận Diện",
  description: "Trang bị khiên chắn kiến thức bảo vệ bản thân.",
};

export default async function FlashcardPage() {
  // 1. Lấy dữ liệu từ Database và ép kiểu (Tránh lỗi 'any')
  const flashcardData = (await fetchFlashcards()) as FlashcardData;

  // 2. Quét thư mục public/images/ma_tuy_nup_bong
  const dirPath = path.join(process.cwd(), "public", "images", "ma_tuy_nup_bong");
  let nupBongDrugs: DrugItem[] = []; // Định nghĩa kiểu rõ ràng thay vì any[]

  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      
      nupBongDrugs = files
        .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file)) // Chỉ lấy file ảnh
        .map((file, index): DrugItem => {
          return {
            name: `Ma túy núp bóng ${index + 1}`, // Đánh số tự động: 1, 2, 3...
            imageUrl: `/images/ma_tuy_nup_bong/${file}`,
            shortDesc: "Ma túy núp bóng", // Nội dung hiển thị ở mặt sau thẻ lật
            
            // Các trường chi tiết để trống để thẻ tự động ẩn nút "Xem chi tiết"
            scientificName: null,
            otherNames: null,
            concept: null,
            origin: null,
            distribution: null,
            identification: [],
            harmfulEffects: []
          };
        });
    }
  } catch (error) {
    console.error("Lỗi khi quét thư mục ảnh ma túy núp bóng:", error);
  }

  // 3. Gộp dữ liệu từ DB và dữ liệu quét từ thư mục
  const finalData: FlashcardData = { ...flashcardData };

  // Nếu thư mục có chứa ảnh, tạo thêm tab "Ma túy núp bóng" ngang hàng
  if (nupBongDrugs.length > 0) {
    finalData["nup_bong"] = {
      title: "Ma túy núp bóng",
      drugs: nupBongDrugs,
    };
  }

  return (
    <div className="min-h-screen relative pt-40 md:pt-48 pb-24 px-4 bg-gradient-to-b from-green-50 via-white to-green-100 overflow-hidden">
      {/* ===== HIỆU ỨNG NỀN ÁNH SÁNG XANH ===== */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[30rem] h-[30rem] md:w-[45rem] md:h-[45rem] rounded-full bg-green-300/30 blur-[120px]"></div>
        <div className="absolute top-[30%] right-[-10%] w-[25rem] h-[25rem] md:w-[40rem] md:h-[40rem] rounded-full bg-emerald-300/20 blur-[120px]"></div>
      </div>

      {/* ===== TIÊU ĐỀ TRANG ===== */}
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-green-900 mb-6 tracking-tight uppercase">
          Từ Điển{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
            Nhận Diện
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
          Trang bị “khiên chắn” kiến thức để bảo vệ bản thân và bạn bè.
          Khám phá và nhận biết hình dáng cũng như tác hại của các nhóm
          chất gây nghiện phổ biến hiện nay.
        </p>
      </div>

      {/* ===== DANH SÁCH FLASHCARD ===== */}
      <div className="relative z-10">
        <FlashcardBoard initialData={finalData} />
      </div>
    </div>
  );
}