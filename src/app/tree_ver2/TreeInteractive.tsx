"use client";

import { useState, useEffect } from "react";
import { treeBranches } from "@/lib/constants/treeVer2Constants";
import treeMindmapData from "@/lib/data/tree_mindmap.json";

// Định nghĩa kiểu dữ liệu cho Mindmap Node
type MindmapNode = {
  name: string;
  children?: MindmapNode[];
};

// ==================== COMPONENT ĐỆ QUY VẼ MINDMAP (STYLE NOTEBOOKLM) ====================
const MindmapNodeComponent = ({
  node,
  level = 0,
}: {
  node: MindmapNode;
  level?: number;
}) => {
  // Mặc định mở nhánh gốc (level 0)
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = !!node.children && node.children.length > 0;

  return (
    <div className="flex items-start md:items-center relative">
      {/* 1. Đường gạch ngang nối TỪ trục dọc VÀO node hiện tại (chỉ áp dụng cho node con) */}
      {level > 0 && (
        <div className="w-6 md:w-10 h-[2px] bg-blue-300 mt-[20px] md:mt-0 shrink-0"></div>
      )}

      {/* 2. Khung chứa Nội dung Node */}
      <div className="flex items-center py-2">
        <div
          className={`
            relative z-10 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl shadow-sm border transition-all duration-200
            ${level === 0 ? "bg-indigo-100 border-indigo-300 text-indigo-900 font-bold text-base md:text-lg" : "bg-[#E3EBFB] border-blue-200 text-slate-800 text-sm md:text-base"}
            ${hasChildren ? "cursor-pointer hover:shadow-md hover:bg-indigo-50" : ""}
            max-w-[280px] md:max-w-[380px]
          `}
          onClick={() => hasChildren && setIsOpen(!isOpen)}
        >
          {/* Chữ nội dung */}
          <span className="leading-snug">{node.name}</span>

          {/* Nút bấm hình tròn có mũi tên (giống NotebookLM) */}
          {hasChildren && (
            <div
              className={`
              w-6 h-6 shrink-0 rounded-full bg-white flex items-center justify-center text-sm font-bold text-indigo-500 shadow-sm transition-transform duration-300
              ${isOpen ? "rotate-90 bg-indigo-500 text-white" : ""}
            `}
            >
              ›
            </div>
          )}
        </div>

        {/* 3. Đường gạch ngang nối TỪ node hiện tại RA trục dọc (nếu đang mở) */}
        {hasChildren && isOpen && (
          <div className="w-6 md:w-10 h-[2px] bg-blue-300 shrink-0"></div>
        )}
      </div>

      {/* 4. Trục dọc và các Node con */}
      {hasChildren && isOpen && (
        <div className="flex flex-col relative border-l-[2px] border-blue-300 py-2">
          {node.children!.map((child, idx) => (
            <MindmapNodeComponent key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== COMPONENT CHÍNH ====================
export default function TreeInteractive() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    // Nếu có activeKey (nghĩa là đang mở modal), phát sự kiện ẩn Navbar
    if (activeKey) {
      window.dispatchEvent(new Event("hideNavbar"));
    } else {
      // Khi đóng modal (activeKey = null), phát sự kiện hiện Navbar
      window.dispatchEvent(new Event("showNavbar"));
    }

    // Cleanup: Chắc chắn hiện lại Navbar khi rời khỏi trang này
    return () => {
      window.dispatchEvent(new Event("showNavbar"));
    };
  }, [activeKey]);

  // Lấy dữ liệu nhánh hiện tại đang được click
  const currentMindmapData = activeKey
    ? (treeMindmapData as Record<string, MindmapNode>)[activeKey]
    : null;

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col items-center pt-[11dvh] md:pt-[17dvh] pb-5 px-4">
      {/* ==================== KHUNG HÌNH CHÍNH ==================== */}
      <div className="relative w-full md:w-[60vw] lg:w-[45vw] h-auto z-10 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-4 md:p-6 flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0D593E]">
            CÂY PHÁP LUẬT
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Pháp luật về phòng chống ma túy
          </p>
        </div>

        <div className="relative w-full h-auto rounded-2xl shadow-inner overflow-hidden">
          <img
            src="/images/tree/tree_ver2.jpg"
            alt="Cây Pháp Luật"
            className="w-full h-auto block"
          />

          {treeBranches.map((branch) => (
            <div
              key={branch.id}
              onClick={() => setActiveKey(branch.contentKey)}
              className={`
                absolute flex items-center justify-center text-center 
                cursor-pointer transition-transform duration-300 hover:scale-110
                ${branch.bgColorClass} ${branch.textColorClass}
              `}
              style={{
                top: branch.top,
                left: branch.left,
                width: branch.width,
                transform: "translate(-50%, -50%)",
                textShadow:
                  "2px 2px 3px rgba(255,255,255,0.9), -2px -2px 3px rgba(255,255,255,0.9), 0px 0px 6px rgba(255,255,255,1)",
              }}
              title={`Nhấn để xem chi tiết: ${branch.title}`}
            >
              {/* - text-[9px]: Kích thước siêu nhỏ cho điện thoại màn hình hẹp
                - sm:text-xs: Lớn hơn xíu cho điện thoại thường
                - md:text-base: Cho Tablet
                - lg:text-xl xl:text-2xl: Cho màn hình Laptop/PC
                - break-words: Ép chữ phải xuống dòng cho gọn gàng, không bị tràn viền
              */}
              <span className="font-extrabold text-[9px] sm:text-xs md:text-base lg:text-xl xl:text-2xl leading-[1.1] sm:leading-tight break-words">
                {branch.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== MODAL MINDMAP (POPUP) ==================== */}
      {activeKey && currentMindmapData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header của Modal */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center shrink-0 rounded-t-2xl shadow-md z-20">
              <h2 className="text-white font-bold text-lg md:text-xl flex items-center gap-2">
                <span className="text-indigo-200">Sơ đồ tư duy:</span>{" "}
                {currentMindmapData.name}
              </h2>
              <button
                onClick={() => setActiveKey(null)}
                className="text-white hover:text-red-200 bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors font-bold"
                title="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Nội dung Mindmap - Cấu hình cuộn ngang/dọc tự do (Canvas) */}
            <div className="p-6 md:p-10 overflow-auto bg-[#F8FAFC] rounded-b-2xl flex-1 custom-scrollbar relative">
              {/* min-w-max bắt buộc vùng chứa mở rộng theo chiều ngang để không bóp méo Sơ đồ */}
              <div className="min-w-max pb-10 pr-10">
                <MindmapNodeComponent node={currentMindmapData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
