"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Kiểm tra nếu đang ở trang /tree thì không render Footer (ẩn đi)
  if (pathname === '/tree' || pathname === '/flashcard') {
    return null;
  }

  return (
    // Bỏ hẳn bo góc (rounded) để tràn viền 100% và lấp đầy 2 bên
    // Xóa -mt-2 để tránh đè lên nội dung
    <footer className="w-full bg-gray-950 text-gray-400 relative z-10 border-t border-brand-green/20 mt-auto">
      
      {/* Vệt sáng thanh mảnh ở cạnh trên */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand-green/60 to-transparent"></div>
      
      {/* Thu hẹp padding (py-8 thay vì pt-12 pb-8) để Footer mỏng và gọn hơn */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center text-center">
        
        {/* Logo & Tên dự án (Thu nhỏ size một chút) */}
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Học Đường Sạch
          </h3>
        </div>
        
        {/* Câu giới thiệu */}
        <p className="text-sm leading-relaxed text-gray-400 mb-4 max-w-2xl">
          Nền tảng số hiện đại giúp trang bị kiến thức và bảo vệ thế hệ trẻ trước cạm bẫy của ma túy. 
          Kiến tạo một môi trường học đường an toàn và lành mạnh.
        </p>
        
        {/* Thẻ tag trường ĐH */}
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 mb-6">
          <span className="text-brand-green">📍</span> Trường Đại học Nha Trang
        </div>

        {/* Dòng Copyright Bottom */}
        <div className="w-full pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
          <p>
            © {new Date().getFullYear()} Học Đường Sạch. Phát triển bởi <span className="text-brand-green font-bold text-sm ml-1">Julian Nguyen</span>
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}