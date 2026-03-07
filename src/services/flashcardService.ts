import prisma from "@/lib/prisma";
import { DrugCategories, DrugDetail } from "@/models/Flashcard";

export const getFlashcardDataFromDB = async (): Promise<DrugCategories> => {
  const allCards = await prisma.flashcard.findMany();

  const filterByCategory = (catCode: string): DrugDetail[] => {
    return allCards
      .filter(card => card.category === catCode)
      .map(card => ({
        name: card.name,
        imageUrl: card.imageUrl,
        shortDesc: card.shortDesc,
        details: card.detailedContent
      }));
  };

  return {
    tu_nhien: {
      title: "Ma túy tự nhiên",
      drugs: filterByCategory("tu_nhien")
    },
    tong_hop: {
      title: "Ma túy tổng hợp",
      drugs: filterByCategory("tong_hop")
    },
    ban_tong_hop: {
      title: "Bán tổng hợp",
      drugs: filterByCategory("ban_tong_hop")
    }
  };
};