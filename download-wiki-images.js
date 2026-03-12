/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "src", "lib", "data");
const IMG_DIR = path.join(__dirname, "public", "images", "flashcard");

// Map các tên tiếng Việt sang từ khóa tiếng Anh chuẩn trên Wikipedia
const drugMap = {
  // Nhóm tự nhiên
  "Cây thuốc phiện": "Papaver somniferum",
  "Thuốc phiện": "Opium",
  "Cần sa": "Cannabis",
  "Cây coca": "Erythroxylum coca",
  "Lá Khat": "Khat",
  "Nhựa Thuốc Phiện": "Opium",
  "Cần Sa (Bồ đà / Pin)": "Cannabis",
  
  // Nhóm tổng hợp
  "Ma túy đá (Methamphetamine)": "Methamphetamine",
  "Ma Túy Đá (Meth)": "Methamphetamine",
  "Thuốc lắc (Ecstasy)": "MDMA",
  "Thuốc Lắc (MDMA / Ecstasy)": "MDMA",
  "Hồng phiến (Amphetamine)": "Amphetamine",
  "Ketamine": "Ketamine",
  "Ketamine (Ke)": "Ketamine",
  "Cần sa tổng hợp (Cỏ Mỹ)": "Synthetic cannabinoids",
  "Cỏ Mỹ (Spice / K2)": "Synthetic cannabinoids",
  "Ma túy LSD (Bùa lưỡi)": "Lysergic acid diethylamide",
  "Tem Giấy (LSD)": "Lysergic acid diethylamide",
  "Bùa lưỡi": "Lysergic acid diethylamide",

  // Nhóm bán tổng hợp
  "Cocaine": "Cocaine",
  "Cocaine (Bột trắng)": "Cocaine",
  "Heroin": "Heroin",
  "Heroine": "Heroin",
  "Heroin (Cái chết trắng)": "Heroin",
  "Crack Cocaine (Cocain đá)": "Crack cocaine"
};

if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
}

// Hàm tạo tên file: "Ma túy đá" -> "ma-tuy-da.jpg"
function createFilename(name) {
  let str = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  str = str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return str + ".jpg";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWikipediaImage(drugName) {
  if (!drugName) return null;
  try {
    // Sử dụng endpoint summary của Wikipedia tiếng Anh (kho ảnh tốt nhất)
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(drugName)}`;
    const res = await fetch(url, { headers: { "User-Agent": "DrugEduProject/1.0" } });

    if (!res.ok) return null;
    const data = await res.json();

    return data.thumbnail?.source || data.originalimage?.source || null;
  } catch (error) {
    return null;
  }
}

async function downloadImage(url, filename) {
  const filepath = path.join(IMG_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`✓ Đã tồn tại: ${filename}`);
    return true;
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) return false;

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    console.log(`📥 Đã tải: ${filename}`);
    return true;
  } catch (error) {
    console.log(`✗ Lỗi tải ${filename}`);
    return false;
  }
}

async function processFile(file) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File không tồn tại: ${file}`);
    return;
  }

  let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  console.log(`\n📂 Đang xử lý: ${file}`);

  for (let item of data) {
    // Ưu tiên tìm kiếm theo: Scientific Name -> Tên map tiếng Anh -> Tên gốc
    const searchTerms = [
      item.scientificName?.split('[')[0]?.trim(), // Xóa bỏ [cite] nếu có
      drugMap[item.name],
      item.name
    ].filter(Boolean);

    let imageUrl = null;
    let foundTerm = "";

    for (const term of searchTerms) {
      imageUrl = await getWikipediaImage(term);
      if (imageUrl) {
        foundTerm = term;
        break;
      }
    }

    const filename = createFilename(item.name);

    if (!imageUrl) {
      console.log(`⚠ Không tìm thấy ảnh cho: ${item.name}`);
      continue;
    }

    const success = await downloadImage(imageUrl, filename);
    if (success) {
      item.imageUrl = `/images/flashcard/${filename}`;
    }

    // Delay để không bị Wikipedia block IP
    await delay(1000); 
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✔ Đã cập nhật JSON: ${file}`);
}

async function main() {
  console.log("🚀 BẮT ĐẦU TẢI ẢNH WIKIPEDIA (PHIÊN BẢN FIX)");
  const files = ["tu_nhien.json", "tong_hop.json", "ban_tong_hop.json"];

  for (const file of files) {
    await processFile(file);
  }
  console.log("\n🎉 HOÀN THÀNH TẢI ẢNH");
}

main();