import Image from "next/image";

export default function Home() {
  return (
    // Giữ nguyên container cha
    <main className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#D1FAE0]">
      
      {/* KHỐI CHỨA ẢNH NỀN RESPONSIVE */}
      {/* THAY ĐỔI: Thêm flex, items-center, justify-center để ảnh nằm giữa container (88dvh) */}
      <div className="absolute left-0 right-0 bottom-0 top-[10dvh] z-0 overflow-hidden flex items-center justify-center">
        
        {/* THAY ĐỔI TRÊN ẢNH DESKTOP: Đổi object-cover thành object-contain */}
        <Image
          src="/hero-bg3.jpeg"
          alt="Học Đường Không Ma Túy (Desktop)"
          fill
          priority
          quality={100}
          sizes="100vw"
          // CHỈNH SỬA Ở ĐÂY: object-cover -> object-contain
          className="object-contain object-center hidden md:block" 
        />
        
        {/* THAY ĐỔI TRÊN ẢNH MOBILE: Đổi object-cover thành object-contain */}
        <Image
          src="/hero-bg4.jpg"
          alt="Học Đường Không Ma Túy (Mobile)"
          fill
          priority
          quality={100}
          sizes="(max-width: 768px) 100vw, 100vw"
          // CHỈNH SỬA Ở ĐÂY: object-cover -> object-contain
          className="object-contain object-center md:hidden block" 
        />
      </div>
      
      {/* KHỐI NỘI DUNG NỔI LÊN TRÊN */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto">
        {/* Nội dung khác ở đây */}
      </div>
    </main>
  );
}