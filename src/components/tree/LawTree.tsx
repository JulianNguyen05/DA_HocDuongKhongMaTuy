"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LawNodeData } from "@/models/Tree";

interface LawTreeProps {
  initialData: LawNodeData[];
}

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
  duration: number;
  delay: number;
}

export default function LawTree({ initialData }: LawTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [treeRotation, setTreeRotation] = useState(0);

  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      size: Math.random() * 10 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      moveX: Math.random() * 40 - 20,
      moveY: Math.random() * -80 - 20,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }));

    const timer = setTimeout(() => {
      setParticles(generatedParticles);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const TOTAL_LEAVES = initialData.length;
  const ANGLE_STEP = 360 / TOTAL_LEAVES;
  const RADIUS = 300;

// DÁNG CÂY BẤT ĐỐI XỨNG & ĐÃ NÉ GỐC CÂY TO
  const treeCoords = [
    { x: 15, y: -180 },     // 0: Ngọn cây (hơi lệch phải xíu)
    { x: -190, y: -150 },   // 1: Trái trên (ngắn lại)
    { x: 220, y: -110 },    // 2: Phải trên 
    { x: -380, y: -40 },    // 3: Trái giữa vươn xa
    { x: -30, y: -60 },     // 4: Tâm cây (cao an toàn)
    { x: 340, y: -10 },     // 5: Phải vươn vừa phải
    { x: -520, y: 80 },     // 6: Rìa trái 
    { x: -180, y: 50 },     // 7: Cành chùm nhỏ bên trái
    { x: 270, y: 70 },      // 8: Cành trung bình bên phải
    { x: 480, y: 110 },     // 9: Rìa phải 
    { x: -340, y: 160 },    // 10: Nhánh rủ xuống bên trái (an toàn vì x=-340, xa gốc)
    { x: 140, y: 110 },     // 11: ĐÃ SỬA: Đẩy xích sang phải và nhấc lên cao hơn để thoát khỏi gốc cây
    { x: 380, y: 180 },     // 12: Nhánh rủ xuống bên phải (an toàn vì x=380, xa gốc)
    // Các vị trí dự phòng (Đã sửa để không có lá nào chui vào giữa gốc cây nữa)
    { x: -100, y: -100 },
    { x: 120, y: -40 },
    { x: -260, y: 100 },
    { x: 290, y: 130 },
    { x: -450, y: 200 },
    { x: 420, y: 220 },
    { x: -160, y: 170 },    // ĐÃ SỬA: Né trục giữa
  ];

  // LÁ TRANG TRÍ (Cũng sắp xếp bất đối xứng để tán cây tự nhiên)
  const decorativeLeaves = [
    { x: -90, y: -200, scale: 0.8, rotate: 15 },
    { x: 140, y: -180, scale: 0.9, rotate: 45 },
    { x: -260, y: -120, scale: 0.7, rotate: 78 },
    { x: 310, y: -80, scale: 0.8, rotate: 22 },
    { x: -480, y: 10, scale: 0.6, rotate: 64 },
    { x: 420, y: 30, scale: 0.7, rotate: 12 },
    { x: -560, y: 130, scale: 0.8, rotate: 85 },
    { x: 510, y: 150, scale: 0.7, rotate: 33 },
    { x: -400, y: 220, scale: 0.6, rotate: 55 },
    { x: 440, y: 240, scale: 0.8, rotate: 80 },
    { x: -200, y: 150, scale: 0.5, rotate: 7 },
    { x: 210, y: 170, scale: 0.6, rotate: 49 },
    { x: -40, y: -130, scale: 0.9, rotate: 38 },
    { x: -60, y: 100, scale: 0.6, rotate: 81 },
    { x: 90, y: 20, scale: 0.7, rotate: 26 },
  ];

  const activeIndex = initialData.findIndex((l) => l.id === activeId);

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

  const selectedLaw = initialData.find((l) => l.id === activeId);

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
    <div className="relative w-full h-full flex items-center justify-center font-sans">
      {/* ĐOM ĐÓM */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute bg-emerald-400/60 rounded-full blur-[1px]"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}vw`,
              top: `${particle.y}vh`,
            }}
            animate={{
              y: [0, particle.moveY, 0],
              x: [0, particle.moveX, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* THÂN CÂY VÀ CÀNH */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{ width: 1400, height: 900 }}
        animate={{ opacity: activeId ? 0 : 1, scale: activeId ? 0.9 : 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] bg-emerald-400/10 rounded-[100%] blur-[90px] pointer-events-none"></div>

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1400 900"
        >
          <defs>
            <linearGradient id="branchGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7a4b22" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient
              id="decoBranchGrad"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#5c3616" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* Cành cho lá trang trí */}
          {decorativeLeaves.map((leaf, i) => {
            const endX = 700 + leaf.x;
            const endY = 450 + leaf.y;
            const startX = 700;
            const startY = 600;
            // Độ cong bất đối xứng ngẫu nhiên
            const cpX = 700 + leaf.x * (i % 2 === 0 ? 0.15 : 0.3);
            const cpY = 600 + leaf.y * (i % 2 === 0 ? 0.25 : 0.4);
            return (
              <path
                key={`deco-branch-${i}`}
                d={`M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`}
                stroke="url(#decoBranchGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                className="opacity-40"
              />
            );
          })}

          {/* Cành cho lá chính */}
          {initialData.map((_, i) => {
            const coord = treeCoords[i] || { x: 0, y: 0 };
            const endX = 700 + coord.x;
            const endY = 450 + coord.y;
            const startX = 700;
            const startY = 600;
            // Tạo độ võng khác nhau cho các nhánh để nhìn thật hơn
            const cpX = 700 + coord.x * (i % 2 === 0 ? 0.2 : 0.35);
            const cpY = 600 + coord.y * (i % 2 === 0 ? 0.3 : 0.4);
            return (
              <path
                key={`main-branch-${i}`}
                d={`M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`}
                stroke="url(#branchGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                className="opacity-80 drop-shadow-[0_4px_8px_rgba(5,150,105,0.4)]"
              />
            );
          })}
        </svg>

        {/* Lá Trang Trí */}
        {decorativeLeaves.map((leaf, i) => (
          <div
            key={`deco-leaf-${i}`}
            className="absolute w-14 h-14 rounded-full flex items-center justify-center pointer-events-none"
            style={{
              left: 700 + leaf.x - 28,
              top: 450 + leaf.y - 28,
              transform: `scale(${leaf.scale}) rotate(${leaf.rotate}deg)`, // Dùng góc xoay cố định ở đây
            }}
          >
            <div className="w-full h-full bg-emerald-600/40 rounded-full border-2 border-emerald-400/20 blur-[1px] shadow-[0_0_15px_rgba(5,150,105,0.3)]"></div>
          </div>
        ))}

        {/* GỐC CÂY TO BÀNH */}
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
          <div className="absolute -top-10 w-[400px] h-[300px] bg-emerald-800/20 rounded-full blur-[60px]"></div>
          <svg
            width="320"
            height="350"
            viewBox="0 0 320 350"
            className="drop-shadow-[0_20px_40px_rgba(5,150,105,0.5)]"
          >
            <defs>
              <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4a2a0f" />
                <stop offset="35%" stopColor="#8b5a2b" />
                <stop offset="65%" stopColor="#8b5a2b" />
                <stop offset="100%" stopColor="#3d210b" />
              </linearGradient>
            </defs>
            <path
              d="M120 0 C120 150, 40 250, 0 350 L320 350 C280 250, 200 150, 200 0 Z"
              fill="url(#trunkGrad)"
            />
            <path
              d="M140 30 Q130 150, 60 320"
              stroke="#381d05"
              strokeWidth="4"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M160 80 Q180 200, 250 330"
              stroke="#381d05"
              strokeWidth="3"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M150 10 Q160 100, 140 180"
              stroke="#2e1704"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>
      </motion.div>

      {/* MÀN CHẮN CLICK OUTSIDE */}
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

      {/* CÁC LÁ CHÍNH */}
      <motion.div
        className="absolute top-1/2 z-30"
        style={{ width: RADIUS * 2, height: RADIUS * 2, y: "-50%" }}
        onWheel={(e) => {
          if (!activeId) return;
          setTreeRotation((prev) => prev + e.deltaY * 0.15);
          if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
          wheelTimeout.current = setTimeout(() => {
            snapToNearest();
          }, 150);
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

          let dist = 0;
          if (activeIndex !== -1) {
            dist = Math.abs(index - activeIndex);
            dist = Math.min(dist, TOTAL_LEAVES - dist);
          }

          let leafScale = 1;
          let leafOpacity = 1;

          if (activeId !== null) {
            if (dist === 0) {
              leafScale = 1.4;
              leafOpacity = 1;
            } else if (dist === 1) {
              leafScale = 1.0;
              leafOpacity = 0.8;
            } else if (dist === 2) {
              leafScale = 0.85;
              leafOpacity = 0.5;
            } else {
              leafScale = 0.7;
              leafOpacity = 0.2;
            }
          }

          let zIndexLv = 10;
          if (activeId !== null) {
            zIndexLv = isActive ? 50 : 40;
          } else {
            zIndexLv = hoveredId === law.id ? 50 : 10;
          }

          return (
            <motion.div
              key={law.id}
              className="absolute top-1/2 left-1/2 pointer-events-auto"
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
              <motion.button
                onClick={() => handleLeafClick(law.id, index)}
                whileHover={{ scale: isActive ? 1 : 1.15 }}
                className={`absolute w-16 h-16 md:w-20 md:h-20 -ml-8 -mt-8 md:-ml-10 md:-mt-10 rounded-full flex flex-col items-center justify-center shadow-xl border-[3px] transition-colors group
                  ${isActive ? "bg-emerald-600 border-white text-white shadow-[0_0_35px_rgba(5,150,105,0.7)]" : "bg-white border-emerald-500 text-emerald-800 hover:bg-emerald-50"}
                `}
              >
                <span
                  className={`font-black text-center leading-tight ${isActive ? "text-[12px] md:text-[16px]" : "text-[10px] md:text-sm"}`}
                >
                  {law.article}
                </span>

                {!activeId && (
                  <div className="absolute top-full mt-2 w-48 bg-emerald-900 text-white text-[11px] font-medium p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl text-center">
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
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute right-0 w-full md:w-[80%] h-full flex flex-col justify-center p-4 md:pr-12 md:pl-2 z-40 pointer-events-none"
          >
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-emerald-100 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500 relative pointer-events-auto ml-auto w-full">
              <button
                onClick={() => setActiveId(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors font-bold text-lg"
              >
                ✕
              </button>

              <div className="mb-8 border-b-2 border-emerald-50 pb-6 text-center">
                <h2 className="text-4xl font-black text-emerald-800 mb-3">
                  {selectedLaw.article}
                </h2>
                <h3 className="text-2xl font-bold text-gray-600">
                  {selectedLaw.name}
                </h3>
              </div>

              <div className="space-y-5">
                {selectedLaw.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors"
                  >
                    <h4 className="font-extrabold text-emerald-800 text-lg mb-3">
                      {detail.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                      {detail.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
