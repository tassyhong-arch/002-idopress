# 🏛️ 이도출판 디지털 장서각 - FTP 배포 가이드

## 📦 다운로드할 파일들

sandbox 환경에서 다음 파일들을 다운로드하세요:

### 1. 전체 프로젝트 패키지
- **파일명**: `idopress_deployment.tar.gz` (555KB)
- **위치**: `/home/user/webapp/idopress_deployment.tar.gz`
- **내용**: 전체 프로젝트 소스코드 (백엔드 + 프론트엔드)

### 2. 프론트엔드 정적 파일 (권장)
- **파일명**: `frontend_static.tar.gz` (473KB)  
- **위치**: `/home/user/webapp/frontend_static.tar.gz`
- **내용**: 빌드된 React 앱 정적 파일들 (HTML, CSS, JS)

## 🚀 FTP 업로드 및 배포 방법

### Option 1: 정적 호스팅 (권장)
정적 파일 호스팅 서비스 (Netlify, Vercel, GitHub Pages 등)용:

1. `frontend_static.tar.gz` 다운로드
2. 압축 해제 후 `dist/` 폴더 내용을 호스팅 서비스에 업로드
3. 환경변수 설정: `VITE_API_URL=https://your-backend-url/api`

### Option 2: 웹서버에 직접 업로드
Apache/Nginx 웹서버용:

1. `frontend_static.tar.gz` 다운로드
2. 웹서버 document root에 압축 해제
3. `dist/` 폴더 내용을 웹 루트에 복사

### Option 3: 전체 프로젝트 배포
서버에서 직접 실행용:

1. `idopress_deployment.tar.gz` 다운로드
2. 서버에 압축 해제
3. 의존성 설치 및 서비스 실행

## 🔧 배포 후 설정

### 백엔드 API 설정
```bash
# Python 의존성 설치
pip install -r requirements.txt

# 데이터베이스 초기화
python database/init_db.py
python database/sample_data.py

# Flask 서버 실행
python backend/app.py
```

### 프론트엔드 설정
```bash
# Node.js 의존성 설치
cd frontend
npm install

# 환경변수 설정
echo "VITE_API_URL=https://your-domain.com/api" > .env

# 프로덕션 빌드
npm run build
```

## 🌐 환경변수 설정

### 프론트엔드 (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### 백엔드
```python
# app.py에서 CORS 설정 확인
CORS(app, origins=["https://your-frontend-domain.com"])
```

## 📋 서버 요구사항

### 최소 요구사항
- **Python**: 3.8+
- **Node.js**: 16+
- **데이터베이스**: PostgreSQL 또는 SQLite
- **메모리**: 512MB+
- **디스크**: 1GB+

### 권장 사양
- **CPU**: 2 cores+
- **메모리**: 2GB+
- **디스크**: 10GB+

## 🔒 보안 설정

1. **HTTPS 설정** (SSL/TLS 인증서)
2. **CORS 도메인 제한**
3. **API 레이트 리미팅**
4. **데이터베이스 보안 설정**
5. **환경변수로 민감 정보 관리**

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- 브라우저 개발자 도구 콘솔
- 서버 로그 파일
- 네트워크 연결 상태
- CORS 설정

---

**🎉 이도출판 디지털 장서각이 성공적으로 배포되었습니다!**