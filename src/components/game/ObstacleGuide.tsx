"use client";

import { useState } from "react";

export default function ObstacleGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* NÚT BẤM HIỂN THỊ GÓC MÀN HÌNH */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-50 bg-blue-600/90 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white/50 backdrop-blur-sm transition-transform active:scale-90 flex items-center gap-2"
      >
        <span className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white text-blue-600 font-black rounded-full text-sm md:text-base">
          i
        </span>
        <span className="hidden md:inline font-bold pr-2">Luật vật cản</span>
      </button>

      {/* BẢNG THÔNG BÁO (MODAL) */}
      {isOpen && (
        <div className="absolute inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 animate-fade-in touch-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-4 border-blue-400 overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-blue-500 text-white text-center py-4 font-black text-xl md:text-2xl uppercase tracking-wider">
              Sổ tay sinh tồn
            </div>

            {/* Nội dung luật chơi */}
            <div className="p-4 md:p-6 space-y-4">
              
              {/* Thùng rác */}
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="text-4xl">🗑️</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Thùng rác, Hộp gỗ</h4>
                  <p className="text-sm text-gray-600">An toàn. Không bị gì, có thể nhảy lên hoặc đi qua bình thường.</p>
                </div>
              </div>

              {/* Ma túy, Kim tiêm */}
              <div className="flex items-center gap-4 bg-red-50 p-3 rounded-xl border border-red-200">
                <div className="text-4xl">💉</div>
                <div>
                  <h4 className="font-bold text-red-600 text-lg">Ma túy, Cần sa, Kim tiêm</h4>
                  <p className="text-sm text-gray-700">
                    Nguy hiểm! Chạm vào bị <span className="font-bold text-red-500">-1 Tim 💔</span>. Hãy tránh xa!
                  </p>
                </div>
              </div>

              {/* Lọt hố */}
              <div className="flex items-center gap-4 bg-orange-50 p-3 rounded-xl border border-orange-200">
                <div className="text-4xl">🕳️</div>
                <div>
                  <h4 className="font-bold text-orange-600 text-lg">Lọt xuống hố</h4>
                  <p className="text-sm text-gray-700">
                    Bị <span className="font-bold text-red-500">-1 Tim 💔</span>. Nhân vật sẽ được hồi sinh và chơi lại tại chặng hiện tại.
                  </p>
                </div>
              </div>

            </div>

            {/* Nút Đóng */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
              >
                Đã hiểu!
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}