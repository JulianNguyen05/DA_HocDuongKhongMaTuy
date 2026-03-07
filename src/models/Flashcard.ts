export interface DrugDetail {
  name: string;
  shortDesc: string;
  details: string[];
}

export interface DrugCategory {
  title: string;
  theme: "green" | "purple" | "orange"; // Gắn màu đặc trưng cho từng tab
  drugs: DrugDetail[];
}

export type DrugCategories = {
  tu_nhien: DrugCategory;
  tong_hop: DrugCategory;
  ban_tong_hop: DrugCategory;
};