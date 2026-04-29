"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export type MindmapNodeType = {
  name: string;
  children?: MindmapNodeType[];
};

export const MindmapNodeComponent = ({
  node,
  level = 0,
}: {
  node: MindmapNodeType;
  level?: number;
}) => {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = !!node.children && node.children.length > 0;

  // Tinh chỉnh hiệu ứng xuất hiện: Thêm blur để có cảm giác điện ảnh
  const nodeVariants: Variants = {
    hidden: { opacity: 0, x: -15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 350, damping: 28 },
    },
    exit: { opacity: 0, x: -10, filter: "blur(4px)", transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      layout // Giúp thẻ tự động trượt mượt mà khi chiều cao bị thay đổi
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={nodeVariants}
      className="flex items-start md:items-center relative"
    >
      {level > 0 && (
        <motion.div 
          layout 
          className="w-6 md:w-10 h-[2px] bg-blue-300 mt-[20px] md:mt-0 shrink-0"
        />
      )}

      <div className="flex items-center py-2">
        <motion.div
          layout // Khung chữ cũng trượt theo
          whileHover={
            hasChildren
              ? { scale: 1.02, boxShadow: "0px 8px 16px rgba(99, 102, 241, 0.15)" }
              : {}
          }
          whileTap={hasChildren ? { scale: 0.97 } : {}}
          className={`
            relative z-10 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl shadow-sm border transition-colors duration-300
            ${level === 0 ? "bg-indigo-100 border-indigo-300 text-indigo-900 font-bold text-base md:text-lg" : "bg-white border-blue-100 text-slate-800 text-sm md:text-base"}
            ${hasChildren ? "cursor-pointer hover:bg-indigo-50 border-transparent hover:border-indigo-200" : ""}
            max-w-[280px] md:max-w-[380px]
          `}
          onClick={() => hasChildren && setIsOpen(!isOpen)}
        >
          <span className="leading-snug">{node.name}</span>

          {hasChildren && (
            <motion.div
              layout
              animate={{
                rotate: isOpen ? 90 : 0,
                backgroundColor: isOpen ? "#6366f1" : "#ffffff",
                color: isOpen ? "#ffffff" : "#6366f1",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
            >
              ›
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {hasChildren && isOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 40, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[2px] bg-blue-300 shrink-0 origin-left"
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            layout
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }, // Tăng tốc độ xuất hiện dây chuyền
              exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
            className="flex flex-col relative border-l-[2px] border-blue-300 py-2 origin-top"
          >
            {node.children!.map((child, idx) => (
              <MindmapNodeComponent key={idx} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};