import { PrismaClient } from '@prisma/client';

// Import trực tiếp 3 file JSON chứa dữ liệu
import tuNhienData from '../src/lib/data/tu_nhien.json';
import tongHopData from '../src/lib/data/tong_hop.json';
import banTongHopData from '../src/lib/data/ban_tong_hop.json';

const prisma = new PrismaClient();

// ĐỊNH NGHĨA RÕ RÀNG KIỂU DỮ LIỆU ĐỂ ÉP TYPESCRIPT PHẢI HIỂU
interface FlashcardSeed {
  category: string;
  name: string;
  imageUrl: string;
  shortDesc: string;
  detailedContent: string[];
}

async function main() {
  console.log('Bắt đầu nạp dữ liệu Flashcard...');

  // Xóa dữ liệu cũ để tránh bị trùng lặp khi chạy lại lệnh
  await prisma.flashcard.deleteMany();

  // Ép kiểu (as FlashcardSeed[]) cho tất cả các file JSON
  const allData: FlashcardSeed[] = [
    ...(tuNhienData as FlashcardSeed[]), 
    ...(tongHopData as FlashcardSeed[]), 
    ...(banTongHopData as FlashcardSeed[])
  ];

  // Duyệt qua từng thẻ và lưu vào Database
  for (const card of allData) {
    await prisma.flashcard.create({
      data: {
        category: card.category,
        name: card.name,
        imageUrl: card.imageUrl, // Hết báo lỗi đỏ ở đây nhé!
        shortDesc: card.shortDesc,
        detailedContent: card.detailedContent,
      },
    });
  }

  console.log(`Nạp thành công ${allData.length} thẻ Flashcard vào Database!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Lỗi khi nạp dữ liệu:', e);
    await prisma.$disconnect();
    process.exit(1);
  });