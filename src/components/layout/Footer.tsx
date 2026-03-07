export default function Footer() {
  return (
    <footer className="bg-brand-green text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="font-bold text-lg uppercase">Dự án: Giải pháp công nghệ trong phòng, chống ma túy</p>
          <p className="text-brand-cream opacity-90 text-sm mt-1">Trường Đại học Nha Trang</p>
        </div>
        <div className="text-center md:text-right text-sm opacity-80">
          <p>© {new Date().getFullYear()} - Cùng xây dựng môi trường giáo dục an toàn.</p>
          <p className="mt-1">Hotline hỗ trợ: 1900 xxxx</p>
        </div>
      </div>
    </footer>
  );
}