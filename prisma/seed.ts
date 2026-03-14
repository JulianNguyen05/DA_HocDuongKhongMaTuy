import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

import tuNhienData from "../src/lib/data/tu_nhien.json";
import tongHopData from "../src/lib/data/tong_hop.json";
import banTongHopData from "../src/lib/data/ban_tong_hop.json";

const prisma = new PrismaClient();

// 1. GIAO DIỆN CHO FLASHCARD
interface FlashcardSeed {
  indexCode?: string;      
  category: string;
  name: string;
  scientificName?: string; 
  otherNames?: string;
  imageUrl?: string;
  shortDesc?: string;
  concept?: string;
  origin?: string;         
  distribution?: string;   
  identification: string[];
  harmfulEffects: string[];
}

// 2. GIAO DIỆN MỚI CHO CÂY PHÁP LUẬT (Chuẩn hóa 3 cấp)
interface LawPointSeed {
  pointLetter: string | null;
  content: string;
}

interface LawClauseSeed {
  clauseNum: number;
  penaltySummary: string;
  isAdditional: boolean;
  points: LawPointSeed[];
}

interface LawArticleSeed {
  articleNum: string;
  name: string;
  x: number;
  y: number;
  clauses: LawClauseSeed[];
}

async function main() {
  console.log("Bắt đầu nạp dữ liệu...");

  // Xóa sạch dữ liệu cũ. Lưu ý thứ tự xóa: Bảng con xóa trước, bảng cha xóa sau
  // Hoặc nếu đã cài onDelete: Cascade trong schema, chỉ cần xóa bảng cha là đủ
  await prisma.flashcard.deleteMany();
  await prisma.lawPoint.deleteMany();
  await prisma.lawClause.deleteMany();
  await prisma.lawArticle.deleteMany();

  // ==========================================
  // 1. NẠP DỮ LIỆU FLASHCARD (Giữ nguyên)
  // ==========================================
  const allData: FlashcardSeed[] = [
    ...(tuNhienData as FlashcardSeed[]),
    ...(tongHopData as FlashcardSeed[]),
    ...(banTongHopData as FlashcardSeed[]),
  ];

  for (const card of allData) {
    await prisma.flashcard.create({
      data: {
        indexCode: card.indexCode || null,
        category: card.category,
        name: card.name,
        scientificName: card.scientificName || null,
        otherNames: card.otherNames || null, 
        imageUrl: card.imageUrl || null,
        shortDesc: card.shortDesc || "",
        concept: card.concept || "", 
        origin: card.origin || null,
        distribution: card.distribution || null,
        identification: card.identification || [], 
        harmfulEffects: card.harmfulEffects || [], 
      },
    });
  }
  console.log(`Đã nạp ${allData.length} thẻ Flashcard.`);

  // ==========================================
  // 2. NẠP DỮ LIỆU CÂY PHÁP LUẬT (Schema mới)
  // ==========================================
  const lawsPath = path.join(__dirname, "../src/lib/data/laws.json");

  if (fs.existsSync(lawsPath)) {
    const lawsData: LawArticleSeed[] = JSON.parse(fs.readFileSync(lawsPath, "utf-8"));

    for (const law of lawsData) {
      // Sử dụng Prisma Nested Writes để tạo Điều -> Khoản -> Điểm cùng lúc
      await prisma.lawArticle.create({
        data: {
          articleNum: law.articleNum,
          name: law.name,
          x: law.x,        // Đã đổi sang Float trong Schema nên không cần ép String()
          y: law.y,
          clauses: {
            create: law.clauses.map((clause) => ({
              clauseNum: clause.clauseNum,
              penaltySummary: clause.penaltySummary,
              isAdditional: clause.isAdditional,
              points: {
                create: clause.points.map((point) => ({
                  pointLetter: point.pointLetter,
                  content: point.content,
                })),
              },
            })),
          },
        },
      });
    }
    console.log(`Đã nạp ${lawsData.length} Điều luật (kèm các Khoản và Điểm tương ứng).`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Hoàn tất Seed!");
  })
  .catch(async (e) => {
    console.error("Lỗi trong quá trình Seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });