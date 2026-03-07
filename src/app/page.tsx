import Image from "next/image";

export default function Home() {
  return (
    // Sử dụng relative, w-full và h-screen (hoặc min-h-screen) để bọc kín màn hình
    <main className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* KHỐI CHỨA ẢNH NỀN */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png" // Đường dẫn tới file ảnh trong thư mục public
          alt="Học Đường Không Ma Túy"
          fill // Thuộc tính quan trọng giúp ảnh tự động giãn lấp đầy không gian
          priority // Ưu tiên tải ảnh này đầu tiên để tránh chớp màn hình
          quality={100} // Giữ chất lượng ảnh sắc nét nhất
          className="object-cover object-center" 
        />
        {/* Lớp phủ mờ (overlay) nhẹ giúp chữ trên Navbar (nếu có) dễ đọc hơn */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
      </div>

      {/* KHỐI NỘI DUNG NỔI LÊN TRÊN (Tạm thời để trống vì ảnh đã có nội dung) */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
         {/* Sau này nếu bạn muốn thêm nút bấm hay text động thì viết code ở đây nhé */}
      </div>

    </main>
  );
}