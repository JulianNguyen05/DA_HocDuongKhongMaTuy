import { fetchTreeData } from '@/services/treeService';
import { LawArticleData } from '@/models/Tree'; // Nhớ import interface này

export const getTreeLaws = async (): Promise<LawArticleData[]> => {
  try {
    const data = await fetchTreeData();
    return data;
  } catch (error) {
    console.error("Lỗi tại Controller getTreeLaws:", error);
    // Trả về mảng rỗng nếu lỗi để giao diện không bị sập màn hình đen
    return []; 
  }
};