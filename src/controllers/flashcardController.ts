import { getFlashcardDataFromDB } from "@/services/flashcardService";
import { DrugCategories } from "@/models/Flashcard";

export const fetchFlashcards = async (): Promise<DrugCategories> => {
  try {
    // Controller gọi Service để lấy dữ liệu từ Database
    const data = await getFlashcardDataFromDB();
    return data;
  } catch (error) {
    console.error("Lỗi Controller khi lấy dữ liệu Flashcard:", error);
    throw new Error("Không thể tải dữ liệu flashcard");
  }
};