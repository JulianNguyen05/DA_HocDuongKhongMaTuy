import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

import tuNhienData from "../src/lib/data/tu_nhien.json";
import tongHopData from "../src/lib/data/tong_hop.json";
import banTongHopData from "../src/lib/data/ban_tong_hop.json";

const prisma = new PrismaClient();

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

// Khai báo interface đàng hoàng cho LawNode để chiều lòng ESLint
interface LawNodeSeed {
  article: string;
  name: string;
  x: number;
  y: number;
  details: string;
}

async function main() {
  console.log("Bắt đầu nạp dữ liệu...");

  // Xóa sạch dữ liệu cũ của cả 2 bảng để nạp lại từ đầu
  await prisma.flashcard.deleteMany();
  await prisma.lawNode.deleteMany();

  // 1. NẠP DỮ LIỆU FLASHCARD
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
        
        // Dùng chuỗi rỗng "" thay cho null để fix lỗi TS(2322) nếu schema bắt buộc String
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

  // 2. NẠP DỮ LIỆU CÂY PHÁP LUẬT
  const lawsPath = path.join(__dirname, "../src/lib/data/laws.json");

  if (fs.existsSync(lawsPath)) {
    // Ép kiểu sang interface vừa tạo thay vì dùng any[]
    const lawsData: LawNodeSeed[] = JSON.parse(fs.readFileSync(lawsPath, "utf-8"));

    for (const law of lawsData) {
      await prisma.lawNode.create({
        data: {
          article: law.article,
          name: law.name,
          // ÉP KIỂU SANG STRING Ở ĐÂY ĐỂ FIX LỖI TS(2322)
          x: String(law.x), 
          y: String(law.y),
          details: law.details,
        },
      });
    }
    console.log(`Đã nạp ${lawsData.length} nhánh Cây Pháp Luật.`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Lỗi trong quá trình Seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });