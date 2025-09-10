-- 이도출판 디지털 장서각 데이터베이스 스키마
-- PostgreSQL/MySQL 호환

-- 사용자 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 도서 테이블
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    title_original VARCHAR(200),
    author VARCHAR(100) NOT NULL,
    era VARCHAR(50),
    genre VARCHAR(50),
    description TEXT,
    content TEXT,
    content_modern TEXT,
    publication_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0
);

-- 독서 진행상황 테이블
CREATE TABLE reading_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    progress_percentage FLOAT DEFAULT 0.0,
    last_position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 리뷰 테이블
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    rating INTEGER,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_era ON books(era);
CREATE INDEX idx_books_public ON books(is_public);
CREATE INDEX idx_reading_progress_user_book ON reading_progress(user_id, book_id);
CREATE INDEX idx_reviews_book ON reviews(book_id);

-- 샘플 데이터 삽입
INSERT INTO books (title, title_original, author, era, genre, description, content, content_modern, publication_date) VALUES
('동국이상국집', '東國李相國集', '이규보', '고려시대', '시문집', '고려 후기의 대표적인 문신이자 문학가인 이규보의 시문집', 
'君不見黃河之水天上來 奔流到海不復回...', '그대는 보지 못했는가? 황하의 물이 하늘에서 와서 바다로 흘러가 다시 돌아오지 않음을...', '1241년'),

('삼국사기', '三國史記', '김부식', '고려시대', '사서', '삼국시대의 역사를 기록한 우리나라 현존 최고의 정사', 
'新羅本紀 第一 赫居世居西干...', '신라본기 제1 혁거세거서간...', '1145년'),

('훈민정음', '訓民正音', '세종대왕', '조선시대', '어학서', '조선 세종대왕이 창제한 한글의 제자원리와 사용법을 설명한 해설서',
'國之語音 異乎中國 與文字不相流通...', '우리나라의 말이 중국과 달라 한자와 서로 통하지 아니하므로...', '1446년');