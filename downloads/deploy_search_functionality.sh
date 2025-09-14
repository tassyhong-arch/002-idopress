#!/bin/bash
# 이도출판 디지털 장서각 검색기능 배포 스크립트
# 작성일: 2024년 9월 14일

echo "🚀 이도출판 디지털 장서각 v4 설치 시작..."

# 1. 파일 압축 해제
if [ -f "idopress_complete_with_search_v4.tar.gz" ]; then
    echo "📦 압축 파일 해제 중..."
    tar -xzf idopress_complete_with_search_v4.tar.gz
    cd idopress
else
    echo "❌ 압축 파일을 찾을 수 없습니다: idopress_complete_with_search_v4.tar.gz"
    exit 1
fi

# 2. Python 가상환경 설정
echo "🐍 Python 가상환경 설정 중..."
python3 -m venv venv
source venv/bin/activate

# 3. 백엔드 의존성 설치
echo "📚 백엔드 의존성 설치 중..."
cd backend
pip install -r requirements.txt
cd ..

# 4. Node.js 의존성 설치 (frontend)
echo "⚛️ 프론트엔드 의존성 설치 중..."
cd frontend
if command -v npm &> /dev/null; then
    npm install
    echo "🏗️ 프론트엔드 빌드 중..."
    npm run build
    cd ..
else
    echo "⚠️ npm이 설치되지 않았습니다. Node.js를 먼저 설치해주세요."
    cd ..
fi

# 5. 실행 권한 부여
chmod +x backend/app.py 2>/dev/null || true

# 6. 환경 설정 파일 생성
echo "⚙️ 환경 설정 파일 생성 중..."
cat > .env << 'ENVEOF'
# 데이터베이스 설정 (PostgreSQL)
DATABASE_URL=postgresql://idopress_user:idopress_password@localhost:5432/idopress

# JWT 보안 키 (실제 운영에서는 강력한 키로 변경하세요)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# 서버 포트 설정
BACKEND_PORT=5000
FRONTEND_PORT=3000
ENVEOF

echo ""
echo "✅ 설치 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. PostgreSQL 데이터베이스 설정:"
echo "   CREATE DATABASE idopress;"
echo "   CREATE USER idopress_user WITH PASSWORD 'idopress_password';"
echo "   GRANT ALL PRIVILEGES ON DATABASE idopress TO idopress_user;"
echo ""
echo "2. 백엔드 서버 실행:"
echo "   cd backend && source ../venv/bin/activate && python app.py"
echo ""
echo "3. 프론트엔드 서버 실행 (별도 터미널):"
echo "   cd frontend && npm run dev"
echo "   또는: python3 -m http.server 3000 --directory dist"
echo ""
echo "4. 웹브라우저에서 접속:"
echo "   프론트엔드: http://localhost:3000"
echo "   백엔드 API: http://localhost:5000"
echo ""
echo "🎯 검색 기능 사용법:"
echo "- 메인 페이지 검색창에서 '춘향', '홍길동' 등 검색"
echo "- 분류별 찾기에서 '문학', '역사' 장르 선택"
echo "- 페이지 하단에서 페이지 이동 가능"
echo ""
echo "📞 문제 발생 시 README_검색기능_업데이트_v4.md 파일을 참조하세요!"
