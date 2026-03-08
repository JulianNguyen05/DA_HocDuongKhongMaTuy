import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

import tuNhienData from '../src/lib/data/tu_nhien.json';
import tongHopData from '../src/lib/data/tong_hop.json';
import banTongHopData from '../src/lib/data/ban_tong_hop.json';

const prisma = new PrismaClient();

interface FlashcardSeed {
  category: string;
  name: string;
  imageUrl: string;
  shortDesc: string;
  detailedContent: string[];
}

async function main() {
  console.log('Bắt đầu nạp dữ liệu...');

  await prisma.flashcard.deleteMany();

  const allData: FlashcardSeed[] = [
    ...(tuNhienData as FlashcardSeed[]),
    ...(tongHopData as FlashcardSeed[]),
    ...(banTongHopData as FlashcardSeed[])
  ];

  for (const card of allData) {
    await prisma.flashcard.create({
      data: {
        category: card.category,
        name: card.name,
        imageUrl: card.imageUrl,
        shortDesc: card.shortDesc,
        detailedContent: card.detailedContent,
      },
    });
  }
  
  console.log(`Đã nạp ${allData.length} thẻ Flashcard.`);

  const lawsPath = path.join(__dirname, '../src/lib/data/laws.json');
  
  if (fs.existsSync(lawsPath)) {
    const lawsData = JSON.parse(fs.readFileSync(lawsPath, 'utf-8'));

    // Bỏ qua lỗi TypeScript tạm thời cho lawNode
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    await prisma.lawNode.deleteMany({});

    for (const law of lawsData) {
      // Bỏ qua lỗi TypeScript tạm thời cho lawNode
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      await prisma.lawNode.create({
        data: {
          article: law.article,
          name: law.name,
          x: law.x,
          y: law.y,
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
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });