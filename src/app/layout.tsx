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
      </body>
    </html>
  );
}