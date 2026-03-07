/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "src", "lib", "data");
const IMG_DIR = path.join(__dirname, "public", "images", "flashcard");

const drugMap = {
  "Nhựa Thuốc Phiện": "Opium",
  "Cần Sa (Bồ đà / Pin)": "Cannabis",
  "Lá Khát (Khat)": "Khat",
  "Nấm Thức Thần": "Psilocybin mushroom",
  "Lá Coca": "Coca leaf",
  "Cà Độc Dược (Datura)": "Datura",
  "Cây Xô Thơm (Salvia)": "Salvia divinorum",
  "Xương Rồng Peyote": "Peyote",
  "Hạt Bìm Bìm Biếc": "Morning glory seeds",
  "Cây Ma Hoàng (Ephedra)": "Ephedra",
  "Quả Anh Túc (Poppy Pods)": "Opium poppy",
  "Nấm Ruồi (Amanita Muscaria)": "Amanita muscaria",
  "Hạt Nhục Đậu Khấu": "Nutmeg",

  "Ma Túy Đá (Meth)": "Methamphetamine",
  "Thuốc Lắc (MDMA / Ecstasy)": "MDMA",
  "Ketamine (Ke)": "Ketamine",
  "Cỏ Mỹ (Spice / K2)": "Synthetic cannabinoids",
  "Muối Tắm (Flakka)": "Alpha-PVP",
  "Nước Biển (GHB)": "Gamma-Hydroxybutyrate",
  "Bụi Thiên Thần (PCP)": "Phencyclidine",
  "Hồng Phiến (Amphetamine)": "Amphetamine",
  "Thuốc Ngủ Rohypnol": "Flunitrazepam",
  "Mephedrone (Meow Meow)": "Mephedrone",
  "Popper (Amyl Nitrite)": "Amyl nitrite",
  "Dextromethorphan (DXM liều cao)": "Dextromethorphan",
  "N-Bomb (25I-NBOMe)": "25I-NBOMe",

  "Heroin (Cái chết trắng)": "Heroin",
  "Cocaine (Bột trắng)": "Cocaine",
  "Tem Giấy (LSD)": "Lysergic acid diethylamide",
  "Crack Cocaine (Cocain đá)": "Crack cocaine",
  "Krokodil (Desomorphine)": "Desomorphine",
  "Oxycodone (OxyContin)": "Oxycodone",
  "Hydrocodone (Vicodin)": "Hydrocodone"
};

if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
}

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
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      drugName
    )}`;

    const res = await fetch(url);

    if (!res.ok) return null;

    const data = await res.json();

    if (data.thumbnail) {
      return data.thumbnail.source;
    }

    if (data.originalimage) {
      return data.originalimage.source;
    }

    return null;
  } catch {
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

    if (!response.ok) {
      console.log(`✗ Lỗi HTTP ${response.status}`);
      return false;
    }

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

  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  console.log(`\n📂 Đang xử lý: ${file}`);

  for (const item of data) {
    const filename = createFilename(item.name);

const searchName = drugMap[item.name] || item.name;
const imageUrl = await getWikipediaImage(searchName);

    if (!imageUrl) {
      console.log(`⚠ Không tìm thấy ảnh: ${item.name}`);
      continue;
    }

    const success = await downloadImage(imageUrl, filename);

    if (success) {
      item.imageUrl = `/images/flashcard/${filename}`;
    }

    await delay(2500);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`✔ Đã cập nhật JSON: ${file}`);
}

async function main() {
  console.log("🚀 BẮT ĐẦU TẢI ẢNH WIKIPEDIA");

  const files = ["tu_nhien.json", "tong_hop.json", "ban_tong_hop.json"];

  for (const file of files) {
    await processFile(file);
  }

  console.log("\n🎉 HOÀN THÀNH TẢI ẢNH");
}

main();

