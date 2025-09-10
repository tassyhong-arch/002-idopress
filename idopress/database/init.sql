-- 이도출판 디지털 장서각 데이터베이스 초기화

-- 데이터베이스 생성 (Docker에서 자동 생성되지만 명시)
CREATE DATABASE idopress;

-- 사용자 생성 및 권한 부여 (Docker에서 자동 생성되지만 명시)
CREATE USER idopress_user WITH PASSWORD 'idopress_password';
GRANT ALL PRIVILEGES ON DATABASE idopress TO idopress_user;

-- 한국 고전 샘플 데이터 삽입 (Flask 앱 실행 후 테이블이 생성된 다음 실행)
-- 이 부분은 별도의 스크립트로 분리하여 실행