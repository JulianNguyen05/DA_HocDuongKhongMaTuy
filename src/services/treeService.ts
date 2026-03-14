import prisma from '@/lib/prisma';
import { LawArticleData } from '@/models/Tree'; // Import interface mới mà chúng ta vừa tạo

export const fetchTreeData = async (): Promise<LawArticleData[]> => {
  try {
    // 1. Prisma sẽ tự động hiểu kiểu trả về, không cần ép kiểu hay ts-ignore nữa
    const laws = await prisma.lawArticle.findMany({
      include: {
        // Lấy danh sách các Khoản thuộc Điều này
        clauses: {
          include: {
            // Lấy danh sách các Điểm thuộc Khoản này
            points: true,
          },
          // Sắp xếp các Khoản theo thứ tự tăng dần (1, 2, 3...)
          orderBy: { clauseNum: 'asc' },
        },
      },
      // Sắp xếp các Điều theo thứ tự tạo (hoặc bạn có thể đổi thành articleNum: 'asc')
      orderBy: { createdAt: 'asc' },
    });

    // 2. Map dữ liệu từ DB sang Interface của Frontend một cách sạch sẽ
    return laws.map((law) => ({
      id: law.id,
      articleNum: law.articleNum,
      name: law.name,
      x: law.x, // x, y giờ đã là number ở cả DB và Interface
      y: law.y,
      clauses: law.clauses.map((clause) => ({
        id: clause.id,
        clauseNum: clause.clauseNum,
        penaltySummary: clause.penaltySummary,
        isAdditional: clause.isAdditional,
        points: clause.points.map((point) => ({
          id: point.id,
          pointLetter: point.pointLetter,
          content: point.content,
        })),
      })),
    }));
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu Cây Pháp Luật:", error);
    return [];
  }
};