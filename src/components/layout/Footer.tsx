"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-950 text-gray-400 relative z-10 border-t border-green-500/20 mt-auto">
      {/* Vệt sáng thanh mảnh ở cạnh trên */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-green-500/60 to-transparent"></div>

      {/* Đã giảm py-8 xuống py-5 để footer thấp hơn */}
      <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col items-center text-center">
        
        {/* Logo & Tên dự án */}
        {/* Đã giảm mb-3 xuống mb-2 */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
            Học đường không ma túy
          </h3>
        </div>

        {/* Câu giới thiệu */}
        {/* Đã giảm mb-6 xuống mb-4 */}
        <p className="text-sm leading-relaxed text-gray-400 mb-4 max-w-2xl">
          Nền tảng số hiện đại giúp trang bị kiến thức và bảo vệ thế hệ trẻ
          trước cạm bẫy của ma túy. Kiến tạo một môi trường học đường an toàn và
          lành mạnh.
        </p>

        {/* Thẻ tag trường ĐH */}
        {/* Đã giảm mb-8 xuống mb-5 và padding py-2 xuống py-1.5 */}
        <div className="inline-flex items-center gap-2 text-xs font-medium text-white/80 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mb-5 hover:bg-white/10 transition-colors cursor-default">
          <span className="text-green-400">📍</span> Trường Đại học Nha Trang
        </div>

        {/* Dòng Copyright Bottom */}
        {/* Đã xóa justify-between, dùng justify-center để căn giữa hoàn toàn, giảm pt-6 xuống pt-4 */}
        <div className="w-full pt-4 border-t border-white/10 flex justify-center items-center gap-4 text-xs font-medium text-gray-500">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} Phát triển bởi
            <span className="text-green-500 font-bold text-sm ml-1 hover:text-green-400 transition-colors cursor-pointer">
              Julian Nguyen
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}