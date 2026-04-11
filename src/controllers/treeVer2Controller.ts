import { LawArticleData } from "@/models/Tree";

// Dữ liệu hard-code (copy từ laws.json trong seed.ts hoặc file bạn đã cung cấp)
const LAWS_VER2_DATA: LawArticleData[] = [
  // === Dán toàn bộ mảng laws.json vào đây (đã có sẵn trong file bạn gửi) ===
  // Ví dụ 2 điều đầu (bạn dán hết vào):
  {
    id: "247",
    articleNum: "247",
    name: "Tội trồng cây thuốc phiện, cây côca, cây cần sa hoặc cây khác có chứa chất ma túy",
    x: 120,
    y: 80,
    clauses: [ /* ... toàn bộ clauses của Điều 247 ... */ ]
  },
  // ... (dán hết 13 điều còn lại)
];

export const getTreeLawsVer2 = async (): Promise<LawArticleData[]> => {
  return LAWS_VER2_DATA; // hard-code, không query DB
};