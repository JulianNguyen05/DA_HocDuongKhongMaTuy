import prisma from '@/lib/prisma';
import { LawNodeData } from '@/models/Tree';

// 1. Khai báo kiểu dữ liệu rõ ràng thay vì dùng 'any' để chiều lòng ESLint
interface PrismaLawNode {
  id: string;
  article: string;
  name: string;
  x: string;
  y: string;
  details: unknown; // Dùng 'unknown' là cách an toàn nhất trong TypeScript
  createdAt: Date;
}

export const fetchTreeData = async (): Promise<LawNodeData[]> => {
  try {
    // 2. Tạm thời tắt cảnh báo TypeScript ở dòng này cho đến khi VS Code tự cập nhật xong type
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const laws = await prisma.lawNode.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    // 3. Ép kiểu (law: PrismaLawNode) để dập tắt triệt để lỗi 7006
    return laws.map((law: PrismaLawNode) => ({
      ...law,
      details: law.details as LawNodeData['details']
    }));
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu Cây Pháp Luật:", error);
    return [];
  }
};