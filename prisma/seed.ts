import { PrismaClient } from '@prisma/client';

// Import trực tiếp 3 file JSON bạn đã tạo ở bước trước
import tuNhienData from '../src/lib/data/tu_nhien.json';
import tongHopData from '../src/lib/data/tong_hop.json';
import banTongHopData from '../src/lib/data/ban_tong_hop.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu Flashcard...');

  // (Tùy chọn) Xóa dữ liệu cũ để tránh bị trùng lặp khi chạy lại nhiều lần
  await prisma.flashcard.deleteMany();

  // Gom tất cả dữ liệu thành 1 mảng lớn
  const allData = [...tuNhienData, ...tongHopData, ...banTongHopData];

  // Duyệt qua từng thẻ và lưu vào Database
  for (const card of allData) {
    await prisma.flashcard.create({
      data: {
        category: card.category,
        name: card.name,
        shortDesc: card.shortDesc,
        detailedContent: card.detailedContent,
      },
    });
  }

  console.log(`✅ Nạp thành công ${allData.length} thẻ Flashcard vào Database!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Lỗi khi nạp dữ liệu:', e);
    await prisma.$disconnect();
    process.exit(1);
  });