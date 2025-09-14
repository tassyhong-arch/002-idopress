-- 후이즈 호스팅 MySQL 설정용 SQL
-- phpMyAdmin에서 실행하세요

-- 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS reading_progress;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

-- 사용자 테이블
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 도서 테이블
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    title_original VARCHAR(200),
    author VARCHAR(100) NOT NULL,
    era VARCHAR(50),
    genre VARCHAR(50),
    description TEXT,
    content LONGTEXT,
    content_modern LONGTEXT,
    publication_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    file_path VARCHAR(255),
    file_type VARCHAR(20),
    file_size INT,
    uploaded_by INT,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 관리자 계정 생성 (ID: admin, 비밀번호: admin123)
INSERT INTO users (username, email, password_hash, is_admin, is_active) VALUES 
('admin', 'admin@idopress.co.kr', 'pbkdf2:sha256:260000$salt$hash', TRUE, TRUE);

-- 샘플 도서 데이터
INSERT INTO books (title, title_original, author, era, genre, description, content, content_modern, publication_date, is_public, view_count) VALUES
('춘향전', '春香傳', '작자 미상', '조선시대', '문학', '조선후기의 대표적인 판소리계 소설', '남원 부사의 아들 이몽룡이...', '남원 부사의 아들 이몽룡이...', '18세기', TRUE, 2342),
('홍길동전', '洪吉童傳', '허균', '조선시대', '문학', '한국 최초의 한글 소설', '홍판서 홍태는...', '홍판서 홍태는...', '1612년', TRUE, 1987),
('삼국유사', '三國遺事', '일연', '고려시대', '역사', '삼국시대의 역사와 설화를 기록', '고조선 단군왕검...', '옛 조선의 단군왕검...', '1281년', TRUE, 1249);

-- 검색용 인덱스 생성
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE FULLTEXT INDEX idx_books_search ON books(title, author, description);

-- 설정 완료 확인
SELECT '데이터베이스 설정 완료!' as status, COUNT(*) as total_books FROM books;