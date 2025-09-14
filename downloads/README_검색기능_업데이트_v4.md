# 이도출판 디지털 장서각 - 검색기능 완료 버전 v4

## 📥 다운로드 파일 정보
- **파일명**: `idopress_complete_with_search_v4.tar.gz`
- **버전**: v4.0 (검색 및 분류 기능 완료)
- **크기**: 433KB
- **생성일**: 2024년 9월 14일

## 🎯 새로 추가된 기능들

### ✅ 완성된 검색 시스템
1. **실시간 검색 기능**
   - 작품명, 저자명, 설명으로 통합 검색
   - 한국어 완벽 지원 (춘향전, 홍길동전 등)
   - 검색 버튼 + Enter 키 지원
   - 검색 결과 실시간 카운트 표시

2. **분류별 찾기 (장르 필터링)**
   - 문학, 역사 등 동적 장르 로딩
   - 각 장르별 도서 필터링
   - 전체/개별 장르 선택 가능
   - 장르별 도서 수량 표시

3. **페이지네이션 시스템**
   - 완전한 페이지 네비게이션
   - 이전/다음 페이지 이동
   - 페이지 번호 직접 선택
   - 현재 페이지 및 전체 페이지 정보 표시

4. **향상된 사용자 경험**
   - 로딩 상태 표시
   - 검색 결과 범위 표시 ("1-20권 표시 중")
   - 검색 초기화 및 전체 보기 옵션
   - 반응형 디자인

## 📁 포함된 파일 구조

```
idopress/
├── backend/               # Flask 백엔드
│   ├── app.py            # 메인 API 서버
│   ├── requirements.txt  # Python 의존성
│   └── uploads/          # 업로드 파일 저장소
├── frontend/             # React 프론트엔드
│   ├── src/
│   │   ├── App.jsx      # 메인 애플리케이션 (검색기능 포함)
│   │   ├── components/   # 컴포넌트들
│   │   └── ebook/       # 이북 뷰어
│   ├── dist/            # 빌드된 정적 파일
│   ├── package.json     # 의존성 정보
│   └── vite.config.js   # Vite 설정
├── supervisord_frontend.conf  # 프론트엔드 서버 설정
└── database/            # 데이터베이스 관련
```

## 🚀 설치 및 실행 가이드

### 1️⃣ 파일 압축 해제
```bash
tar -xzf idopress_complete_with_search_v4.tar.gz
cd idopress
```

### 2️⃣ 백엔드 설정 및 실행
```bash
# Python 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는 venv\Scripts\activate  # Windows

# 의존성 설치
cd backend
pip install -r requirements.txt

# 데이터베이스 초기화 (PostgreSQL 필요)
# DATABASE_URL 환경변수 설정 후:
python app.py
```

### 3️⃣ 프론트엔드 설정 및 실행
```bash
# Node.js 의존성 설치
cd frontend
npm install

# 개발 서버 실행
npm run dev

# 또는 빌드 후 정적 파일 서빙
npm run build
python3 -m http.server 3000 --directory dist
```

### 4️⃣ Supervisor를 이용한 자동 관리 (권장)
```bash
# 프론트엔드 자동 관리
supervisord -c supervisord_frontend.conf
supervisorctl -c supervisord_frontend.conf status

# PM2를 이용한 백엔드 관리 (Node.js 환경)
pm2 start backend/app.py --name idopress-backend
```

## 🔗 접속 정보
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:5000
- **관리자 패널**: 웹사이트 헤더의 "관리자" 버튼

## ✨ 주요 검색 기능 사용법

### 🔍 텍스트 검색
1. 메인 페이지 상단 검색창에 키워드 입력
2. "춘향", "홍길동", "삼국유사" 등 작품명이나 저자명 검색
3. 검색 버튼 클릭 또는 Enter 키로 실행
4. 결과에서 "전체보기" 클릭으로 검색 해제

### 📚 장르별 분류 찾기
1. "분류별 찾기" 섹션의 장르 버튼 클릭
2. "문학", "역사" 등 원하는 장르 선택
3. "전체" 버튼으로 전체 도서 보기
4. 각 장르의 도서 수량 확인 가능

### 📄 페이지 탐색
1. 하단 페이지네이션에서 페이지 번호 클릭
2. "이전", "다음" 버튼으로 페이지 이동
3. 현재 페이지와 전체 페이지 정보 확인
4. 검색 상태에서도 페이지 이동 가능

## 🔧 기술 정보

### Backend (Flask)
- **검색 API**: `/api/books?search=키워드`
- **장르 필터**: `/api/books?genre=장르명`
- **페이지네이션**: `/api/books?page=페이지번호&per_page=20`
- **장르 목록**: `/api/books/genres`

### Frontend (React + Vite)
- **상태 관리**: React Hooks를 이용한 검색/필터 상태
- **API 통신**: Fetch API로 백엔드 연동
- **URL 인코딩**: 한국어 검색어 자동 인코딩
- **반응형 UI**: Tailwind CSS 기반 모바일 지원

## 📋 체크리스트

### ✅ 완료된 기능
- [x] 실시간 텍스트 검색
- [x] 장르별 필터링
- [x] 페이지네이션
- [x] 한국어 지원
- [x] 로딩 상태 관리
- [x] 검색 결과 카운트
- [x] 관리자 시스템
- [x] 이북 뷰어 (원문/현대어 번역)
- [x] 반응형 디자인

### 🔄 향후 개선 가능 사항
- [ ] 고급 검색 옵션 (시대별, 저자별)
- [ ] 검색 기록 저장
- [ ] 북마크 기능
- [ ] 사용자 리뷰 시스템
- [ ] 소셜 공유 기능

## 🆘 지원 및 문의
- 설치나 사용 중 문제가 있으시면 개발자에게 연락주세요
- 데이터베이스 연결 문제는 PostgreSQL 설정을 확인해주세요
- 포트 충돌 시 `vite.config.js`와 `app.py`에서 포트 변경 가능

---
**이도출판 디지털 장서각 v4.0 - 검색 및 분류 기능 완료판**
생성일: 2024년 9월 14일