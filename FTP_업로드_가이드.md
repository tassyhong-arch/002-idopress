# 🌐 이도출판 디지털 장서각 - FTP 업로드 가이드

## 📦 제공되는 파일들

### 1. **idopress_website_ftp.tar.gz** (프론트엔드 웹사이트)
- **용도**: 메인 웹사이트 파일 (HTML, CSS, JavaScript)
- **업로드 위치**: 웹 서버의 `public_html` 또는 `www` 디렉토리
- **포함 내용**:
  - `index.html` - 메인 페이지
  - `assets/` - CSS, JavaScript 파일
  - `.htaccess` - Apache 웹서버 설정

### 2. **idopress_backend_ftp.tar.gz** (백엔드 API)
- **용도**: Python Flask API 서버
- **업로드 위치**: 서브 디렉토리 (예: `public_html/api/`)
- **포함 내용**:
  - `app.py` - 메인 Flask 애플리케이션
  - `wsgi.py` - 웹서버 배포용 WSGI 파일
  - `requirements.txt` - Python 의존성 패키지 목록
  - `database_schema.sql` - 데이터베이스 스키마
  - `.env.example` - 환경 변수 예시 파일
  - `.htaccess` - Apache 설정

### 3. **idopress_complete_ftp.tar.gz** (전체 패키지)
- **용도**: 프론트엔드와 백엔드가 모두 포함된 완전한 패키지
- **권장**: 처음 업로드 시 이 파일 사용

---

## 🚀 배포 방법

### **방법 1: 공유 호스팅 (cPanel 등)**

#### 1단계: 파일 업로드
```bash
# FTP 또는 cPanel 파일매니저로 업로드
1. idopress_complete_ftp.tar.gz 파일을 public_html에 업로드
2. 압축 해제 (Extract)
3. 필요시 파일 권한 설정 (644 for files, 755 for folders)
```

#### 2단계: 데이터베이스 설정
```sql
-- cPanel > MySQL Databases에서 새 데이터베이스 생성
-- phpMyAdmin에서 database_schema.sql 실행
```

#### 3단계: 환경 설정
```bash
# idopress_backend/.env.example을 .env로 복사
# 데이터베이스 정보 수정
DATABASE_URL=mysql://username:password@localhost/database_name
```

#### 4단계: Python 패키지 설치
```bash
# SSH 접속 가능한 경우
cd public_html/idopress_backend
pip install -r requirements.txt
```

### **방법 2: VPS/전용 서버**

#### 1단계: 파일 업로드
```bash
# SCP로 업로드
scp idopress_complete_ftp.tar.gz user@yourserver:/var/www/html/
ssh user@yourserver
cd /var/www/html
tar -xzf idopress_complete_ftp.tar.gz
```

#### 2단계: 웹서버 설정 (Apache)
```apache
# /etc/apache2/sites-available/idopress.conf
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/html/idopress_website
    
    # 백엔드 API 프록시
    ProxyPass /api/ http://localhost:5000/api/
    ProxyPassReverse /api/ http://localhost:5000/api/
    
    # 정적 파일 서빙
    <Directory "/var/www/html/idopress_website">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### 3단계: Python 애플리케이션 설정
```bash
# 가상환경 생성
python3 -m venv /var/www/idopress_venv
source /var/www/idopress_venv/bin/activate

# 패키지 설치
cd /var/www/html/idopress_backend
pip install -r requirements.txt

# Gunicorn으로 실행
gunicorn --bind 0.0.0.0:5000 wsgi:application
```

---

## 🗄️ 데이터베이스 설정

### **PostgreSQL 사용 시**
```sql
-- 사용자 및 데이터베이스 생성
CREATE USER idopress_user WITH PASSWORD 'your_password';
CREATE DATABASE idopress_db OWNER idopress_user;
GRANT ALL PRIVILEGES ON DATABASE idopress_db TO idopress_user;

-- 스키마 적용
\c idopress_db
\i database_schema.sql
```

### **MySQL 사용 시**
```sql
-- 데이터베이스 생성
CREATE DATABASE idopress_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'idopress_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON idopress_db.* TO 'idopress_user'@'localhost';

-- 스키마 적용 (MySQL 문법으로 수정 필요)
-- SERIAL → AUTO_INCREMENT
-- BOOLEAN → TINYINT(1)
```

---

## ⚙️ 환경 변수 설정

### **필수 설정 항목**
```bash
# .env 파일 생성 (idopress_backend/.env)
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost/dbname
```

### **선택적 설정**
```bash
# CORS 설정
CORS_ORIGINS=https://yourdomain.com

# 로깅
LOG_LEVEL=INFO
LOG_FILE=/var/log/idopress.log

# 업로드 설정
UPLOAD_FOLDER=/var/www/uploads
MAX_CONTENT_LENGTH=16777216
```

---

## 🔧 트러블슈팅

### **일반적인 문제들**

1. **500 Internal Server Error**
   - Python 패키지 설치 확인: `pip list`
   - 로그 확인: Apache error log 또는 Flask 로그
   - 파일 권한 확인: 644 (파일), 755 (폴더)

2. **데이터베이스 연결 오류**
   - `.env` 파일의 `DATABASE_URL` 확인
   - 데이터베이스 서버 실행 상태 확인
   - 사용자 권한 확인

3. **CORS 오류**
   - 백엔드 `.htaccess`의 CORS 헤더 확인
   - `.env`의 `CORS_ORIGINS` 설정 확인

4. **정적 파일 로드 실패**
   - 프론트엔드 `.htaccess`의 RewriteRule 확인
   - 파일 경로 및 권한 확인

---

## 📞 지원

배포 과정에서 문제가 발생하면:
1. 웹서버 로그 확인
2. Python 애플리케이션 로그 확인
3. 데이터베이스 연결 테스트
4. 환경 변수 설정 재확인

---

## 📋 체크리스트

배포 완료 후 확인사항:
- [ ] 메인 웹사이트 접속 확인
- [ ] API 헬스체크 확인 (`/api/health`)
- [ ] 데이터베이스 연결 확인
- [ ] 도서 목록 API 확인 (`/api/books`)
- [ ] 사용자 등록 기능 확인
- [ ] HTTPS 설정 (SSL 인증서)
- [ ] 보안 설정 확인

**성공적인 배포를 위해 단계별로 차근차근 진행하시기 바랍니다! 🎉**