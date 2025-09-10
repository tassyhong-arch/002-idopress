# 이도출판 디지털 장서각

한국 고전 문학의 디지털 아카이브 플랫폼

## 프로젝트 개요

이도출판 홈페이지는 200여권의 한국 고전을 디지털 형태로 제공하는 '디지털 장서각'입니다. Project Gutenberg의 성공적인 개방형 모델을 참조하여, 한국 고전 문학의 현대적 계승과 세계화를 목표로 합니다.

## 핵심 목표

1. **디지털 아카이브 구축**: 200여권의 한국 고전을 고품질 디지털 텍스트로 무료 제공
2. **현대적 재해석**: 고전 원문과 현대적 해설을 통한 대중화
3. **지식 커뮤니티 형성**: 독자들의 능동적 참여와 소통 플랫폼

## 기술 스택

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **Authentication**: Flask-JWT-Extended
- **API Documentation**: Flask-RESTful

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Vite

### Infrastructure
- **Deployment**: Docker
- **Process Management**: PM2 (Node.js), Supervisor (Python)

## 프로젝트 구조

```
idopress/
├── backend/           # Flask API 서버
├── frontend/          # React 웹 애플리케이션
├── database/          # 데이터베이스 스키마 및 샘플 데이터
├── docs/             # 프로젝트 문서
└── scripts/          # 유틸리티 스크립트
```

## 개발 로드맵

### 1단계: MVP (최소 기능 제품)
- [x] 프로젝트 구조 설정
- [ ] Flask 백엔드 API 개발
- [ ] React 프론트엔드 개발
- [ ] 한국 고전 샘플 데이터 구축
- [ ] 기본 텍스트 뷰어
- [ ] 사용자 인증 시스템

### 2단계: 확장 기능
- [ ] 고급 검색 기능
- [ ] 인터랙티브 뷰어
- [ ] 커뮤니티 기능
- [ ] 오디오북 지원

### 3단계: 고도화
- [ ] AI 기반 추천 시스템
- [ ] 다국어 지원
- [ ] 모바일 앱

## 라이선스

본 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여하기

이도출판 디지털 장서각 프로젝트에 관심을 가져주셔서 감사합니다. 기여 방법은 [CONTRIBUTING.md](docs/CONTRIBUTING.md)를 참조해주세요.