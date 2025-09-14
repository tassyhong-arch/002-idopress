# 📋 FTP 업로드 체크리스트

## 🎯 이도출판 디지털 장서각 v4 - 검색기능 완료판

### 📦 다운로드할 파일
- **메인 FTP 패키지**: `ftp_upload_search_complete_v4.tar.gz` (323KB)
- **기본 소스코드**: `idopress_complete_with_search_v4.tar.gz` (433KB)

---

## ✅ FTP 업로드 단계별 체크리스트

### 1️⃣ **압축 파일 다운로드 및 해제**
- [ ] `ftp_upload_search_complete_v4.tar.gz` 다운로드
- [ ] 압축 해제하여 `ftp_upload_search_v4` 폴더 확인
- [ ] 다음 파일들이 있는지 확인:
  - [ ] `index.html` (메인 페이지)
  - [ ] `assets/` 폴더 (CSS, JS 파일들)
  - [ ] `api/` 폴더 (백엔드 Python 파일들)
  - [ ] `.htaccess` (Apache 설정)
  - [ ] `FTP_업로드_가이드_v4.md`

### 2️⃣ **웹호스팅 FTP 업로드**
- [ ] FTP 클라이언트로 호스팅 서버 접속
- [ ] 웹호스팅 루트 디렉토리 확인 (`public_html` 또는 `www`)
- [ ] `ftp_upload_search_v4` 폴더 **안의 모든 내용**을 루트에 업로드
- [ ] 업로드 후 파일 구조 확인:
  ```
  public_html/
  ├── index.html
  ├── assets/
  ├── api/
  ├── .htaccess
  └── FTP_업로드_가이드_v4.md
  ```

### 3️⃣ **파일 권한 설정**
- [ ] 일반 파일: 644 권한 설정
- [ ] 폴더: 755 권한 설정
- [ ] `api/uploads/` 폴더: 755 권한 (쓰기 가능)
- [ ] `.htaccess` 파일: 644 권한

### 4️⃣ **데이터베이스 설정**
- [ ] 호스팅 제공업체에서 데이터베이스 생성
- [ ] PostgreSQL 또는 MySQL 선택
- [ ] 데이터베이스 이름: `idopress`
- [ ] 사용자명: `idopress_user` 
- [ ] 비밀번호: 강력한 비밀번호 설정
- [ ] SQL 파일 실행:
  - PostgreSQL: `api/database_setup.sql`
  - MySQL: `api/database_setup_mysql.sql`

### 5️⃣ **환경 설정 파일 생성**
- [ ] `api/.env` 파일 생성
- [ ] 데이터베이스 연결 정보 입력:
  ```
  DATABASE_URL=postgresql://사용자명:비밀번호@호스트:포트/데이터베이스명
  JWT_SECRET_KEY=강력한-보안-키-여기에-입력
  FLASK_ENV=production
  ```

### 6️⃣ **Python 백엔드 설정**
- [ ] 호스팅에서 Python 지원 확인
- [ ] `api/requirements.txt`의 패키지들 설치
- [ ] Flask 애플리케이션 등록 (호스팅 제공업체 방법 따라)

---

## 🧪 기능 테스트 체크리스트

### ✅ **프론트엔드 테스트**
- [ ] 메인 페이지 로딩 (`https://yourdomain.com/`)
- [ ] 검색창 표시 및 입력 테스트
- [ ] 장르 분류 버튼들 클릭 가능
- [ ] 반응형 디자인 (모바일에서 확인)
- [ ] CSS/JS 파일 정상 로딩

### ✅ **백엔드 API 테스트**
- [ ] 헬스체크: `https://yourdomain.com/api/health`
- [ ] 도서목록: `https://yourdomain.com/api/books`
- [ ] 검색기능: `https://yourdomain.com/api/books?search=춘향`
- [ ] 장르목록: `https://yourdomain.com/api/books/genres`
- [ ] 관리자로그인: `https://yourdomain.com/api/admin/login`

### ✅ **검색기능 테스트**
- [ ] 텍스트 검색: "춘향", "홍길동", "삼국유사" 등
- [ ] 장르 필터링: "문학", "역사" 카테고리 클릭
- [ ] 페이지네이션: 페이지 번호로 이동
- [ ] 검색 결과 카운트 표시
- [ ] "전체보기" 버튼으로 검색 해제

### ✅ **관리자 시스템 테스트**
- [ ] 관리자 버튼 클릭으로 로그인 창 표시
- [ ] 기본 계정으로 로그인 (admin / admin123)
- [ ] 도서 목록 관리 기능
- [ ] 새 도서 추가 기능
- [ ] 파일 업로드 기능

---

## 🔧 문제 해결 가이드

### 🚨 **자주 발생하는 문제들**

#### 1. 페이지가 안 뜰 때
- [ ] `.htaccess` 파일이 업로드되었는지 확인
- [ ] 파일 권한이 올바른지 확인 (644/755)
- [ ] 웹호스팅의 에러 로그 확인

#### 2. 검색이 안 될 때  
- [ ] 데이터베이스 연결 상태 확인
- [ ] `/api/health` 엔드포인트 접속 테스트
- [ ] 브라우저 개발자도구에서 네트워크 오류 확인

#### 3. 관리자 로그인이 안 될 때
- [ ] 데이터베이스에 관리자 계정이 생성되었는지 확인
- [ ] `api/.env` 파일의 JWT_SECRET_KEY 설정 확인
- [ ] 비밀번호가 정확한지 확인 (기본: admin123)

#### 4. 파일 업로드가 안 될 때
- [ ] `api/uploads/` 폴더 권한이 755인지 확인
- [ ] 웹서버의 파일 업로드 크기 제한 확인
- [ ] `.htaccess`의 파일 크기 설정 확인

---

## 📞 **지원 정보**

### 🔗 **테스트 URL 패턴**
```
메인사이트: https://yourdomain.com/
API 상태: https://yourdomain.com/api/health
도서검색: https://yourdomain.com/api/books?search=키워드
장르목록: https://yourdomain.com/api/books/genres
```

### 🗃️ **기본 계정 정보**
- **관리자 ID**: admin
- **관리자 비밀번호**: admin123 (운영시 변경 필수!)

### 📊 **샘플 검색 키워드**
- "춘향" → 춘향전 검색
- "홍길동" → 홍길동전 검색  
- "삼국유사" → 역사서 검색
- "문학" → 문학 장르 필터
- "역사" → 역사 장르 필터

---

## 🎯 **성공 기준**

모든 체크리스트를 완료하면:
✅ 완전한 한국 고전문학 디지털 도서관 완성!  
✅ 실시간 검색 및 분류 기능 작동!  
✅ 관리자 시스템으로 도서 관리 가능!  
✅ 모바일/데스크톱 반응형 지원!  

**축하합니다! 🎉 검색기능이 완료된 이도출판 디지털 장서각이 성공적으로 배포되었습니다!**

---
생성일: 2024년 9월 14일  
버전: v4.0 (검색기능 완료판)