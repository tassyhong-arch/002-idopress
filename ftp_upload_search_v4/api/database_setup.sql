-- 이도출판 디지털 장서각 v4 데이터베이스 설정
-- 검색기능 완료판

-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 2. 도서 테이블
CREATE TABLE IF NOT EXISTS books (
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
    view_count INTEGER DEFAULT 0,
    file_path VARCHAR(255),
    file_type VARCHAR(20),
    file_size INTEGER,
    uploaded_by INTEGER REFERENCES users(id)
);

-- 3. 독서 진행상황 테이블
CREATE TABLE IF NOT EXISTS reading_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    book_id INTEGER REFERENCES books(id) NOT NULL,
    progress_percentage FLOAT DEFAULT 0.0,
    last_position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    book_id INTEGER REFERENCES books(id) NOT NULL,
    rating INTEGER,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 검색 성능을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_era ON books(era);
CREATE INDEX IF NOT EXISTS idx_books_is_public ON books(is_public);
CREATE INDEX IF NOT EXISTS idx_books_view_count ON books(view_count);

-- 6. 전문 검색을 위한 인덱스 (PostgreSQL)
CREATE INDEX IF NOT EXISTS idx_books_search ON books USING gin(to_tsvector('korean', title || ' ' || author || ' ' || COALESCE(description, '')));

-- 7. 관리자 계정 생성 (비밀번호: admin123)
-- 실제 운영시에는 강력한 비밀번호로 변경하세요!
INSERT INTO users (username, email, password_hash, is_admin, is_active) 
VALUES (
    'admin', 
    'admin@idopress.co.kr', 
    'pbkdf2:sha256:260000$xvK8P2QK$b8c1b4c3a5d2f3e4b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    TRUE, 
    TRUE
) ON CONFLICT (username) DO NOTHING;

-- 8. 샘플 도서 데이터 삽입 (검색 테스트용)
INSERT INTO books (title, title_original, author, era, genre, description, content, content_modern, publication_date, is_public, view_count) VALUES
(
    '삼국유사', 
    '三國遺事', 
    '일연', 
    '고려시대', 
    '역사', 
    '일연이 편찬한 역사서로, 삼국시대의 역사와 설화를 기록한 책입니다. 단군신화를 비롯해 고구려, 백제, 신라의 건국 설화와 불교 전래 등의 이야기가 담겨 있습니다.',
    '古朝鮮 檀君王儉...', 
    '옛 조선의 단군왕검은...',
    '1281년',
    TRUE,
    1249
),
(
    '동명왕편', 
    '東明王篇', 
    '이규보', 
    '고려시대', 
    '문학', 
    '이규보가 지은 영웅서사시로, 고구려 건국시조 동명왕 주몽의 일생을 노래한 작품입니다. 한국 문학사상 최초의 영웅서사시로 평가받습니다.',
    '天帝之子 解慕漱...', 
    '천제의 아들 해모수는...',
    '1193년',
    TRUE,
    567
),
(
    '춘향전', 
    '春香傳', 
    '작자 미상', 
    '조선시대', 
    '문학', 
    '조선후기의 대표적인 판소리계 소설로, 춘향과 몽룡의 사랑 이야기를 통해 신분제 사회의 모순을 비판한 작품입니다.',
    '南原 府使의 아들 李夢龍이...', 
    '남원 부사의 아들 이몽룡이...',
    '18세기',
    TRUE,
    2342
),
(
    '심청전', 
    '沈淸傳', 
    '작자 미상', 
    '조선시대', 
    '문학', 
    '효녀 심청이 아버지의 눈을 뜨게 하기 위해 인당수에 몸을 던지는 효행담을 그린 조선후기의 판소리계 소설입니다.',
    '沈學規라는 선비가...', 
    '심학규라는 선비가...',
    '18세기',
    TRUE,
    1876
),
(
    '홍길동전', 
    '洪吉童傳', 
    '허균', 
    '조선시대', 
    '문학', 
    '허균이 지은 한국 최초의 한글 소설로, 서자 출신인 홍길동이 사회적 신분제의 모순에 맞서는 이야기를 그린 작품입니다.',
    '洪判書 洪泰은...', 
    '홍판서 홍태는...',
    '1612년',
    TRUE,
    1987
),
(
    '구운몽', 
    '九雲夢', 
    '김만중', 
    '조선시대', 
    '문학', 
    '김만중이 지은 고전소설로, 성진이 꿈속에서 양소유로 환생하여 8명의 여인과 만나는 이야기를 통해 인생무상을 그린 작품입니다.',
    '唐 太宗 때에...', 
    '당 태종 때에...',
    '17세기 후반',
    TRUE,
    1456
) ON CONFLICT (title, author) DO NOTHING;

-- 9. 업데이트 트리거 설정 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. 데이터베이스 설정 완료 확인
SELECT 
    'Database setup completed!' as status,
    count(*) as total_books,
    (SELECT count(*) FROM users WHERE is_admin = true) as admin_users
FROM books;

-- MySQL용 대체 스크립트는 database_setup_mysql.sql 파일 참조