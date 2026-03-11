import Image from "next/image";

export default function Home() {
  return (
    // THÊM: bg-[#e6f4eb] (Đây là mã màu xanh nhạt mình đoán từ ảnh của bạn)
    <main className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#D1FAE0]">
      
      {/* KHỐI CHỨA ẢNH NỀN */}
      <div className="absolute left-0 right-0 bottom-0 top-[4dvh] z-0">
        <Image
          src="/hero-bg3.jpeg"
          alt="Học Đường Không Ma Túy"
          fill 
          priority 
          quality={100} 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover object-center md:object-center" 
        />
      </div>

      {/* KHỐI NỘI DUNG NỔI LÊN TRÊN */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto">
         {/* Sau này nếu bạn muốn thêm nút bấm hay text động thì viết code ở đây */}
      </div>

    </main>
  );
}