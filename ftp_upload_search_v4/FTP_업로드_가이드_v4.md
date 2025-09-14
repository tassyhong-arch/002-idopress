# 🚀 이도출판 디지털 장서각 v4 FTP 업로드 가이드

## 📁 FTP 업로드 구조

이 폴더의 모든 내용을 웹호스팅 루트 디렉토리에 업로드하세요.

```
웹호스팅 루트 (public_html 또는 www)
├── index.html              # 메인 프론트엔드 페이지
├── assets/                 # CSS, JS, 이미지 파일들
│   ├── index-*.css         # 스타일시트
│   └── index-*.js          # JavaScript 번들
├── api/                    # 백엔드 API 파일들
│   ├── app.py              # Flask 메인 애플리케이션
│   ├── requirements.txt    # Python 의존성
│   └── uploads/            # 업로드 파일 저장소
├── .htaccess              # Apache 설정 (중요!)
└── FTP_업로드_가이드_v4.md  # 이 가이드 파일
```

## 🎯 업로드 단계

### 1️⃣ 전체 파일 업로드
- 이 폴더의 **모든 내용**을 웹호스팅 루트에 업로드
- 파일 권한: 644, 폴더 권한: 755로 설정

### 2️⃣ 데이터베이스 설정 (필수)

#### PostgreSQL 사용 시:
```sql
-- 데이터베이스 생성
CREATE DATABASE idopress;
CREATE USER idopress_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE idopress TO idopress_user;
```

#### MySQL 사용 시:
```sql
-- 데이터베이스 생성
CREATE DATABASE idopress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'idopress_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON idopress.* TO 'idopress_user'@'localhost';
```

### 3️⃣ 백엔드 환경 설정

#### `api/.env` 파일 생성:
```env
# 데이터베이스 URL (PostgreSQL)
DATABASE_URL=postgresql://idopress_user:your_password@localhost:5432/idopress

# 또는 MySQL 사용시
# DATABASE_URL=mysql://idopress_user:your_password@localhost:3306/idopress

# JWT 보안 키 (강력한 키로 변경하세요!)
JWT_SECRET_KEY=your-super-secure-jwt-secret-key-change-this

# 서버 설정
FLASK_ENV=production
FLASK_DEBUG=False
```

### 4️⃣ Python 의존성 설치

웹호스팅에서 Python을 지원하는 경우:
```bash
cd api
pip install -r requirements.txt
```

### 5️⃣ 파일 권한 설정
```bash
# 업로드 폴더 쓰기 권한
chmod 755 api/uploads/
chmod 644 api/*.py
chmod 644 .htaccess
```

## 🌐 웹호스팅별 설정

### 📌 **cPanel 호스팅**
1. 파일 매니저에서 `public_html` 폴더로 이동
2. 모든 파일을 `public_html`에 업로드
3. Python App 설정에서 Flask 애플리케이션 등록
4. 데이터베이스를 MySQL로 생성

### 📌 **Cafe24, 가비아 등**
1. FTP 클라이언트로 `www` 또는 `public_html` 접속
2. 모든 파일 업로드
3. 호스팅 제공업체의 Python/데이터베이스 설정 활용

### 📌 **Vercel, Netlify 등**
- 프론트엔드만 배포 (정적 파일)
- 백엔드는 별도 서버 필요 (Heroku, AWS 등)

## ⚙️ 검색 기능 확인

업로드 완료 후 다음 기능들이 작동하는지 확인:

### ✅ 프론트엔드 체크리스트
- [ ] 메인 페이지 로딩 (index.html)
- [ ] 검색창 표시 및 입력 가능
- [ ] 장르 분류 버튼들 표시
- [ ] 반응형 디자인 작동

### ✅ 백엔드 API 체크리스트
- [ ] `/api/health` - 헬스 체크 (200 응답)
- [ ] `/api/books` - 도서 목록 조회
- [ ] `/api/books?search=춘향` - 검색 기능
- [ ] `/api/books/genres` - 장르 목록
- [ ] `/api/admin/login` - 관리자 로그인

## 🔧 문제해결

### 🚨 **검색이 안 될 때**
1. 데이터베이스 연결 확인
2. `/api/health` 접속으로 백엔드 상태 체크
3. 브라우저 개발자도구에서 네트워크 탭 확인

### 🚨 **관리자 접속이 안 될 때**
1. 데이터베이스에 관리자 계정 생성:
```sql
INSERT INTO users (username, email, password_hash, is_admin, is_active) 
VALUES ('admin', 'admin@idopress.co.kr', 'hashed_password', true, true);
```

### 🚨 **파일 업로드 안 될 때**
1. `api/uploads/` 폴더 권한 확인 (755)
2. 웹서버의 파일 업로드 크기 제한 확인
3. `.htaccess` 파일의 업로드 설정 확인

## 📞 기술 지원

### 🔍 **API 테스트 URL들**
```
https://yourdomain.com/api/health
https://yourdomain.com/api/books
https://yourdomain.com/api/books?search=춘향
https://yourdomain.com/api/books/genres
```

### 📋 **샘플 데이터 삽입**
```sql
-- 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO users (username, email, password_hash, is_admin, is_active) 
VALUES ('admin', 'admin@example.com', 'pbkdf2:sha256:260000$...', true, true);

-- 샘플 도서 데이터
INSERT INTO books (title, author, genre, era, description, is_public) VALUES
('춘향전', '작자 미상', '문학', '조선시대', '춘향과 몽룡의 사랑 이야기', true),
('홍길동전', '허균', '문학', '조선시대', '서자 홍길동의 활약상', true),
('삼국유사', '일연', '역사', '고려시대', '삼국시대의 역사와 설화', true);
```

---

## 🎯 최종 체크포인트

✅ 모든 파일 업로드 완료  
✅ 데이터베이스 설정 및 연결  
✅ 환경변수 (.env) 설정  
✅ 파일 권한 설정  
✅ API 엔드포인트 테스트  
✅ 검색 기능 동작 확인  
✅ 관리자 시스템 접근 확인  

**성공적인 배포를 위해 단계별로 차근차근 진행하세요!** 🚀

---
**이도출판 디지털 장서관 v4.0 - 검색기능 완료판**  
생성일: 2024년 9월 14일