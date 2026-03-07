import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Học Đường Không Ma Túy",
  description: "Dự án nền tảng số phòng, chống ma túy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-brand-cream text-gray-900 min-h-screen flex flex-col`}>
        <Navbar />
        
        {/* Tối ưu: Loại bỏ giới hạn chiều rộng ở đây để từng trang tự quyết định (Full Width) */}
        <main className="flex-grow w-full overflow-x-hidden">
          {children}
        </main>
        
        <Footer />

        {/* Chatbot vẫn giữ nguyên vị trí */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="bg-brand-green text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform">
            💬
          </button>
        </div>
      </body>
    </html>
  );
}