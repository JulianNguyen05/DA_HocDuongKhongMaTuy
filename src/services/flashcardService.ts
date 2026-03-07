import prisma from "@/lib/prisma";
import { DrugCategories, DrugDetail } from "@/models/Flashcard";

export const getFlashcardDataFromDB = async (): Promise<DrugCategories> => {
  // Prisma tự động hiểu allCards là mảng các Flashcard, không cần ép kiểu!
  const allCards = await prisma.flashcard.findMany();

  const filterByCategory = (catCode: string): DrugDetail[] => {
    return allCards
      // Định nghĩa trực tiếp kiểu ẩn danh cho card ở đây để TypeScript hết phàn nàn
      .filter((card: { category: string; name: string; shortDesc: string; detailedContent: string[] }) => card.category === catCode)
      .map(card => ({
        name: card.name,
        shortDesc: card.shortDesc,
        details: card.detailedContent
      }));
  };

  return {
    tu_nhien: {
      title: "🌿 Ma túy tự nhiên",
      theme: "green",
      drugs: filterByCategory("tu_nhien")
    },
    tong_hop: {
      title: "🧪 Ma túy tổng hợp",
      theme: "purple",
      drugs: filterByCategory("tong_hop")
    },
    ban_tong_hop: {
      title: "💊 Bán tổng hợp",
      theme: "orange",
      drugs: filterByCategory("ban_tong_hop")
    }
  };
};