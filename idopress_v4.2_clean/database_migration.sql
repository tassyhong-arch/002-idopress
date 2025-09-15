-- 관리자 업로드 기능을 위한 데이터베이스 마이그레이션
-- 기존 데이터베이스에 새 필드들을 추가하는 SQL

-- 1. books 테이블에 파일 업로드 관련 컬럼 추가 (이미 존재하면 오류 무시)
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS file_path VARCHAR(255),
ADD COLUMN IF NOT EXISTS file_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS file_size INT,
ADD COLUMN IF NOT EXISTS uploaded_by INT;

-- 2. 외래키 제약조건 추가 (이미 존재하면 오류 무시)
ALTER TABLE books 
ADD CONSTRAINT fk_books_uploaded_by 
FOREIGN KEY (uploaded_by) REFERENCES users(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- 3. 업로드된 파일들을 위한 추가 인덱스
CREATE INDEX IF NOT EXISTS idx_books_uploaded_by ON books(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_books_file_type ON books(file_type);

-- 4. 마이그레이션 완료 확인
SELECT '✅ 관리자 업로드 기능을 위한 데이터베이스 마이그레이션이 완료되었습니다!' as message;