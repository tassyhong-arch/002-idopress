# 🍃 Cafe24 호스팅 설정 가이드

## 1️⃣ Cafe24에서 Python 앱 설정

### Python 버전 확인
- Cafe24 관리자 → 서비스 관리 → Python
- Python 3.8 이상 선택

### 디렉토리 구조 설정
```
public_html/
├── index.html              # 메인 프론트엔드
├── assets/                 # CSS, JS 파일
├── cgi-bin/                # Python 스크립트 위치 (Cafe24 전용)
│   └── app.py             # Flask 애플리케이션 이동
└── api_data/              # 데이터베이스 파일
    └── database.db        # SQLite 사용 (MySQL 대신)
```

### .htaccess 수정 (Cafe24 전용)
```apache
RewriteEngine On

# Python CGI로 API 요청 처리
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ /cgi-bin/app.py [QSA,L]

# 프론트엔드 SPA 라우팅
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/cgi-bin/
RewriteRule . /index.html [L]
```

## 2️⃣ 간단한 SQLite 버전으로 변경

Cafe24는 PostgreSQL 지원이 제한적이므로 SQLite로 변경:

### app.py 수정사항:
```python
# 기존
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://...'

# Cafe24용 SQLite 변경
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///api_data/idopress.db'
```

## 3️⃣ Cafe24 업로드 순서

1. 프론트엔드 파일들을 public_html에 업로드
2. app.py를 cgi-bin 폴더로 이동
3. cgi-bin/app.py 파일 권한을 755로 설정
4. api_data 폴더 생성 및 777 권한 설정
5. 수정된 .htaccess 업로드

## 4️⃣ 테스트 방법

1. https://yourdomain.co.kr/ (프론트엔드 확인)
2. https://yourdomain.co.kr/api/health (백엔드 API 확인)

## 🚨 Cafe24 주의사항

- Python CGI는 성능이 제한적입니다
- 대용량 트래픽시 다른 호스팅 고려 필요
- SQLite는 동시 접속자 수가 제한적