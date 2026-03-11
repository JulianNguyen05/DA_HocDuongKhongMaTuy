"use client";
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";

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

const TreeParticles = () => {
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

    // Bọc trong setTimeout để tránh cảnh báo của React và trì hoãn việc render đom đóm 1 chút xíu
    const timer = setTimeout(() => {
      setParticles(generatedParticles);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute bg-emerald-400/60 rounded-full blur-[1px]"
          style={{ width: particle.size, height: particle.size, left: `${particle.x}vw`, top: `${particle.y}vh` }}
          animate={{
            y: [0, particle.moveY, 0],
            x: [0, particle.moveX, 0],
            opacity: [0.1, 0.7, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
        />
      ))}
    </div>
  );
};

export default memo(TreeParticles);