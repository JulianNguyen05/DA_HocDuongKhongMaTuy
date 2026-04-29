"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { treeBranches } from "@/lib/constants/treeVer2Constants";
import treeMindmapData from "@/lib/data/tree_mindmap.json";
import { MindmapNodeComponent, MindmapNodeType } from "./MindmapNode";

export default function TreeInteractive() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleBranchClick = (contentKey: string) => {
    setSelectedKey(contentKey);
    setTimeout(() => setShowModal(true), 800);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedKey(null), 400);
  };

  const getTreeImage = () => {
    switch (selectedKey) {
      case "responsibility":
        return "/images/tree/tree_ver2_2_green.png";
      case "prevention":
        return "/images/tree/tree_ver2_2_red.png";
      case "rehabilitation":
        return "/images/tree/tree_ver2_2_purple.png";
      case "enforcement":
        return "/images/tree/tree_ver2_2_orange.png";
      default:
        return "/images/tree/tree_ver2_2.png";
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-[11dvh] md:pt-[17dvh] pb-5 px-4 overflow-hidden">
      {/* 1. KHUNG HÌNH CHÍNH */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full md:w-[60vw] lg:w-[45vw] z-10 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-4 md:p-6 flex flex-col gap-4"
      >
        <div className="text-center">
          <motion.h1
            layout
            className="text-2xl md:text-3xl font-extrabold text-[#0D593E]"
          >
            CÂY PHÁP LUẬT
          </motion.h1>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Pháp luật về phòng chống ma túy
          </p>
        </div>

        <div className="relative w-full h-auto rounded-2xl shadow-inner overflow-hidden bg-white">
          {/* Nâng cấp Crossfade: Tắt mode="wait" để ảnh mới đè lên ảnh cũ mượt mà hơn, kết hợp Blur */}
          <AnimatePresence>
            <motion.img
              key={getTreeImage()}
              src={getTreeImage()}
              initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(8px)", scale: 1.02 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full h-auto block absolute inset-0 object-cover"
            />
          </AnimatePresence>
          {/* Cần 1 ảnh tĩnh ẩn phía dưới để giữ layout không bị sập khi dùng absolute */}
          <img
            src="/images/tree/tree_ver2_2.png"
            className="w-full h-auto block opacity-0 pointer-events-none"
            alt="placeholder"
          />

          {treeBranches.map((branch) => {
            const isClicked = selectedKey === branch.contentKey;
            const isOtherClicked = selectedKey && !isClicked;

            return (
              <motion.div
                key={branch.id}
                onClick={() => handleBranchClick(branch.contentKey)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isOtherClicked ? 0 : 1,
                  scale: isOtherClicked ? 0.8 : 1,
                  filter: isOtherClicked ? "blur(8px)" : "blur(0px)",
                }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                whileHover={
                  !selectedKey
                    ? {
                        scale: 1.15,
                        rotate: [-1, 1.5, -1.5, 0],
                        transition: { type: "tween", duration: 0.4 }, // Ép dùng tween riêng cho lúc hover
                      }
                    : {}
                }
                className={`absolute flex items-center justify-center text-center cursor-pointer ${branch.textColorClass}`}
                style={{
                  top: branch.top,
                  left: branch.left,
                  width: branch.width,
                  transform: "translate(-50%, -50%)",
                  textShadow:
                    branch.id === 5
                      ? "2px 2px 0 #5C3A21, -1px -1px 0 #5C3A21, 1px -1px 0 #5C3A21, -1px 1px 0 #5C3A21, 3px 3px 8px rgba(0,0,0,0.6)"
                      : "2px 2px 3px rgba(255,255,255,0.9), -2px -2px 3px rgba(255,255,255,0.9), 0px 0px 6px rgba(255,255,255,1)",
                }}
              >
                <span
                  className={`font-extrabold leading-[1.1] break-words ${branch.id === 5 ? "text-[12px] sm:text-sm md:text-xl lg:text-3xl xl:text-4xl" : "text-[9px] sm:text-xs md:text-base lg:text-xl xl:text-2xl"}`}
                >
                  {branch.title}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 2. MODAL NÂNG CẤP */}
      <AnimatePresence>
        {showModal && selectedKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            {/* Nền mờ phủ ngoài */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/50"
            />

            {/* Nội dung Modal - Hiệu ứng Glassmorphism nảy lên */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ scale: 0.95, opacity: 0, y: 20, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white flex flex-col overflow-hidden"
            >
              <div className="bg-indigo-600/90 backdrop-blur-md p-4 md:p-5 flex justify-between items-center shrink-0 shadow-sm border-b border-indigo-500">
                <h2 className="text-white font-extrabold text-lg md:text-xl tracking-wide">
                  {
                    (treeMindmapData as Record<string, MindmapNodeType>)[
                      selectedKey
                    ]?.name
                  }
                </h2>
                <motion.button
                  whileHover={{
                    rotate: 90,
                    scale: 1.1,
                    backgroundColor: "rgba(255,255,255,0.3)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="text-white bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              <div className="p-6 md:p-10 overflow-auto bg-slate-50/50 flex-1 custom-scrollbar">
                <div className="min-w-max pb-10">
                  <MindmapNodeComponent
                    node={
                      (treeMindmapData as Record<string, MindmapNodeType>)[
                        selectedKey
                      ]
                    }
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
