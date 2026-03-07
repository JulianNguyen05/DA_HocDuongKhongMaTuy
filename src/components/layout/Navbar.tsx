import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Tên dự án */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-extrabold text-brand-green uppercase tracking-wide">
              🚫 Học Đường Không Ma Túy
            </Link>
          </div>
          
          {/* Menu chức năng chính */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/game" className="text-gray-700 hover:text-brand-green font-semibold transition">
              Ngã Rẽ Cuộc Đời
            </Link>
            <Link href="/flashcard" className="text-gray-700 hover:text-brand-green font-semibold transition">
              Kiến Thức
            </Link>
            {/* Đã thêm mục Sơ đồ cây (Pháp Luật) vào đây */}
            <Link href="/tree" className="text-gray-700 hover:text-brand-green font-semibold transition">
              Pháp Luật
            </Link>
            <Link href="/map" className="text-gray-700 hover:text-brand-green font-semibold transition">
              Bản Đồ Cảnh Báo
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-brand-green font-semibold transition">
              Điểm Tin
            </Link>
            
            {/* Nút Tố Giác nổi bật với màu đỏ cảnh báo */}
            <Link href="/report" className="bg-red-500 text-white px-5 py-2 rounded-full font-bold hover:bg-red-600 shadow-md transition transform hover:-translate-y-0.5">
              🚨 TỐ GIÁC NGAY
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}