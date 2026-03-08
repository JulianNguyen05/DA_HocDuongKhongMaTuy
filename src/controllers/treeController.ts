import { fetchTreeData } from '@/services/treeService';

export const getTreeLaws = async () => {
  return await fetchTreeData();
};