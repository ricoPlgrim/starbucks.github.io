const fs = require('fs');
const path = require('path');

// 빌드 경로 (docs 폴더)
const buildPath = path.join(__dirname, '..', 'docs');
const indexPath = path.join(buildPath, 'index.html');
const notFoundPath = path.join(buildPath, '404.html');

// index.html이 존재하는지 확인
if (fs.existsSync(indexPath)) {
  // index.html을 404.html로 복사
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('✅ 404.html 파일이 생성되었습니다.');
} else {
  console.error('❌ index.html 파일을 찾을 수 없습니다:', indexPath);
  process.exit(1);
}

