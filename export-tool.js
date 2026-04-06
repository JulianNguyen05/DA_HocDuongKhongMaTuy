const fs = require('fs');
const path = require('path');

const outputFile = 'tong_hop_code.txt';
const rootDir = __dirname;

// 1. Các file cấu hình nằm ở thư mục gốc cần lấy
const rootFiles = [
    'Dockerfile',
    'docker-compose.yml',
    'docker-compose.prod.yml',
    '.dockerignore',
    'package.json',
    'tsconfig.json',
    'next.config.ts',
    'tailwind.config.ts',
    'prisma.config.ts',
    'eslint.config.mjs',
    'postcss.config.mjs'
];

// 2. Các thư mục chứa mã nguồn cần quét
const dirsToScan = ['src', 'prisma'];

// 3. Định dạng file cho phép trong thư mục nguồn
const allowedExtensions = ['.ts', '.tsx', '.js', '.json', '.prisma', '.css'];

// Xóa file cũ nếu đã tồn tại
fs.writeFileSync(outputFile, '');

function appendToFile(filePath) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/'); // Chuẩn hóa đường dẫn cho dễ nhìn
        
        const separator = `\n\n==================================================\n📁 File: ${relativePath}\n==================================================\n\n`;
        fs.appendFileSync(outputFile, separator + content);
        console.log(`✅ Đã gộp: ${relativePath}`);
    }
}

// Xử lý các file ở thư mục gốc
rootFiles.forEach(file => {
    appendToFile(path.join(rootDir, file));
});

// Hàm quét đệ quy các thư mục
function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            traverseDir(fullPath);
        } else {
            const ext = path.extname(fullPath);
            if (allowedExtensions.includes(ext)) {
                appendToFile(fullPath);
            }
        }
    }
}

dirsToScan.forEach(dir => {
    traverseDir(path.join(rootDir, dir));
});

console.log(`\n🎉 Hoàn tất! Toàn bộ code đã được xuất ra file: ${outputFile}`);