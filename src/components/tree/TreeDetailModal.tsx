"use client";
import { motion } from "framer-motion";
import { LawNodeData } from "@/models/Tree";

interface Props {
  selectedLaw: LawNodeData;
  onClose: () => void;
}

export default function TreeDetailModal({ selectedLaw, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="absolute right-0 w-full md:w-[80%] h-full flex flex-col justify-center p-4 md:pr-12 md:pl-2 z-40 pointer-events-none"
    >
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-emerald-100 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500 relative pointer-events-auto ml-auto w-full">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors font-bold text-lg"
        >
          ✕
        </button>

        <div className="mb-8 border-b-2 border-emerald-50 pb-6 text-center">
          <h2 className="text-4xl font-black text-emerald-800 mb-3">{selectedLaw.article}</h2>
          <h3 className="text-2xl font-bold text-gray-600">{selectedLaw.name}</h3>
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
              <h4 className="font-extrabold text-emerald-800 text-lg mb-3">{detail.title}</h4>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{detail.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}