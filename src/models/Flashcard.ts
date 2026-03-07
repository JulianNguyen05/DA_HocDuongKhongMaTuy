export interface DrugDetail {
  name: string;
  imageUrl?: string | null;
  shortDesc: string;
  details: string[];
}

export interface DrugCategory {
  title: string;
  drugs: DrugDetail[];
}

export type DrugCategories = {
  tu_nhien: DrugCategory;
  tong_hop: DrugCategory;
  ban_tong_hop: DrugCategory;
};