import Image from "next/image";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* KHỐI CHỨA ẢNH NỀN */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg2.jpg"
          alt="Học Đường Không Ma Túy"
          fill 
          priority 
          quality={100} 
          className="object-cover object-center" 
        />
        {/* ĐÃ XÓA LỚP PHỦ MÀU ĐEN (bg-black/10) Ở ĐÂY ĐỂ ẢNH SÁNG RỰC RỠ 100% */}
      </div>

      {/* KHỐI NỘI DUNG NỔI LÊN TRÊN */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
         {/* Sau này nếu bạn muốn thêm nút bấm hay text động thì viết code ở đây */}
      </div>

    </main>
  );
}