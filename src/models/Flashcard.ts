export interface DrugDetail {
  name: string;
  imageUrl?: string | null;
  shortDesc?: string | null;
  scientificName?: string | null;
  otherNames?: string | null;
  concept?: string | null;
  origin?: string | null;
  distribution?: string | null;
  identification: string[];
  harmfulEffects: string[];
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