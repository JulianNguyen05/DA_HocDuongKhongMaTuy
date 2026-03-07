import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Học Đường Không Ma Túy",
  description: "Dự án nền tảng số phòng, chống ma túy trong môi trường học đường và cộng đồng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      {/* Set màu nền kem làm chủ đạo cho body */}
      <body className={`${inter.className} bg-brand-cream text-gray-900 flex flex-col min-h-screen`}>
        
        <Navbar />
        
        {/* Phần ruột (Nội dung từng trang sẽ hiển thị ở đây) */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <Footer />

        {/* Nút Trợ lý ảo AI Chatbot (Nổi ở góc dưới cùng bên phải) */}
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            className="bg-brand-green text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-green-300"
            title="Chatbot tư vấn pháp luật & tâm lý"
          >
            💬
          </button>
        </div>
        
      </body>
    </html>
  );
}