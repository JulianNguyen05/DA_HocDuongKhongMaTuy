"use client";
import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LawNodeData } from "@/models/Tree";

// Import các sub-components
import TreeParticles from "./TreeParticles";
import TreeBackground from "./TreeBackground";
import TreeDetailModal from "./TreeDetailModal";
import { treeCoords } from "./treeConstants";

interface LawTreeProps {
  initialData: LawNodeData[];
}

export default function LawTree({ initialData }: LawTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [treeRotation, setTreeRotation] = useState(0);

  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_LEAVES = initialData.length;
  const ANGLE_STEP = 360 / TOTAL_LEAVES;
  const RADIUS = 300;

  const activeIndex = initialData.findIndex((l) => l.id === activeId);

  const selectedLaw = useMemo(
    () => initialData.find((l) => l.id === activeId),
    [activeId, initialData],
  );

  const handleLeafClick = (id: string, index: number) => {
    if (activeId === id) {
      setActiveId(null);
      return;
    }
    setActiveId(id);

    const targetAngle = -(index * ANGLE_STEP);
    let currentMod = treeRotation % 360;
    if (currentMod < 0) currentMod += 360;
    let targetMod = targetAngle % 360;
    if (targetMod < 0) targetMod += 360;

    let diff = targetMod - currentMod;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    setTreeRotation(treeRotation + diff);
  };

  const springTransition = {
    duration: 0.7,
    type: "spring" as const,
    stiffness: 70,
    damping: 15,
  };

  const snapToNearest = () => {
    setTreeRotation((currentRotation) => {
      let index = Math.round(-currentRotation / ANGLE_STEP) % TOTAL_LEAVES;
      if (index < 0) index += TOTAL_LEAVES;
      setActiveId(initialData[index].id);

      const targetAngle = -(index * ANGLE_STEP);
      let currentMod = currentRotation % 360;
      if (currentMod < 0) currentMod += 360;
      let targetMod = targetAngle % 360;
      if (targetMod < 0) targetMod += 360;

      let diff = targetMod - currentMod;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      return currentRotation + diff;
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center font-sans overflow-hidden">
      <TreeParticles />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{ width: 1400, height: 900 }}
        animate={{ opacity: activeId ? 0 : 1, scale: activeId ? 0.9 : 1 }}
        transition={{ duration: 0.6 }}
      >
        <TreeBackground dataLength={TOTAL_LEAVES} />
      </motion.div>

      <AnimatePresence>
        {activeId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 cursor-pointer"
            onClick={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute top-1/2 z-30"
        style={{ width: RADIUS * 2, height: RADIUS * 2, y: "-50%" }}
        onWheel={(e) => {
          if (!activeId) return;
          setTreeRotation((prev) => prev + e.deltaY * 0.15);
          if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
          wheelTimeout.current = setTimeout(() => snapToNearest(), 150);
        }}
        animate={{
          left: activeId ? "0%" : "50%",
          x: activeId ? "-70%" : "-50%",
          rotate: activeId ? treeRotation : 0,
        }}
        transition={springTransition}
      >
        <motion.div
          animate={{ opacity: activeId ? 1 : 0 }}
          className="absolute inset-0 rounded-full border border-emerald-500/30 border-dashed"
        />

        {initialData.map((law, index) => {
          const isActive = activeId === law.id;
          const angleRad = (index * ANGLE_STEP * Math.PI) / 180;
          const arcX = RADIUS * Math.cos(angleRad);
          const arcY = RADIUS * Math.sin(angleRad);
          const coord = treeCoords[index] || { x: 0, y: 0 };

          const dist =
            activeIndex !== -1
              ? Math.min(
                  Math.abs(index - activeIndex),
                  TOTAL_LEAVES - Math.abs(index - activeIndex),
                )
              : 0;

          const leafScale =
            activeId !== null
              ? dist === 0
                ? 1.4
                : dist === 1
                  ? 1.0
                  : dist === 2
                    ? 0.85
                    : 0.7
              : 1;
          const leafOpacity =
            activeId !== null
              ? dist === 0
                ? 1
                : dist === 1
                  ? 0.8
                  : dist === 2
                    ? 0.5
                    : 0.2
              : 1;
          const zIndexLv =
            activeId !== null
              ? isActive
                ? 50
                : 40
              : hoveredId === law.id
                ? 50
                : 10;

          return (
            <motion.div
              key={law.id}
              className="absolute top-1/2 left-1/2 pointer-events-auto flex items-center justify-center"
              onMouseEnter={() => setHoveredId(law.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ zIndex: zIndexLv }}
              animate={{
                x: activeId ? arcX : coord.x,
                y: activeId ? arcY : coord.y,
                rotate: activeId ? -treeRotation : 0,
                scale: leafScale,
                opacity: activeId === null ? 1 : leafOpacity,
              }}
              transition={springTransition}
            >
              {/* QUẢ (Trái cây chứa luật) - Không còn tán lá ở đây nữa */}
              <motion.button
                onClick={() => handleLeafClick(law.id, index)}
                whileHover={{ scale: isActive ? 1 : 1.15 }}
                className="absolute w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center outline-none group"
              >
                {/* Cuống và lá nhỏ của quả */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[6px] h-[16px] bg-amber-900 rounded-sm z-0"></div>
                <div className="absolute -top-2 left-0 w-6 h-6 bg-[radial-gradient(circle_at_top_left,#4ade80,#16a34a)] rounded-[0_100%_0_100%] rotate-[20deg] z-0 drop-shadow-md border border-green-600"></div>
                <div className="absolute -top-2 right-0 w-6 h-6 bg-[radial-gradient(circle_at_top_right,#4ade80,#16a34a)] rounded-[100%_0_100%_0] rotate-[-20deg] z-0 drop-shadow-md border border-green-600"></div>

                {/* Thân quả 3D */}
                <div
                  className={`relative z-10 w-full h-full rounded-full flex flex-col items-center justify-center shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.6),3px_5px_10px_rgba(0,0,0,0.4)] transition-all duration-300
                  ${
                    isActive
                      ? "bg-[radial-gradient(circle_at_35%_30%,#fdba74,#ea580c,#7c2d12)] border border-orange-400"
                      : "bg-[radial-gradient(circle_at_35%_30%,#6ee7b7,#059669,#064e3b)] border border-emerald-400"
                  }`}
                >
                  <span
                    className={`font-black text-center leading-tight drop-shadow-md text-white ${isActive ? "text-[12px] md:text-[16px]" : "text-[10px] md:text-sm"}`}
                  >
                    {law.article}
                  </span>
                </div>

                {/* Tooltip khi di chuột */}
                {!activeId && (
                  <div className="absolute top-full mt-4 w-48 bg-emerald-900/90 text-white text-[11px] font-medium p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl text-center backdrop-blur-sm z-50">
                    {law.name}
                  </div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* KHUNG NỘI DUNG */}
      <AnimatePresence>
        {activeId && selectedLaw && (
          <TreeDetailModal
            selectedLaw={selectedLaw}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
