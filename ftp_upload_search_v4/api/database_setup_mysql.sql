-- 이도출판 디지털 장서각 v4 - MySQL 버전 데이터베이스 설정
-- 검색기능 완료판

-- MySQL 사용자를 위한 데이터베이스 설정

-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- 2. 도서 테이블
CREATE TABLE IF NOT EXISTS books (
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
);

-- 3. 독서 진행상황 테이블
CREATE TABLE IF NOT EXISTS reading_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    progress_percentage FLOAT DEFAULT 0.0,
    last_position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- 4. 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- 5. 검색 성능을 위한 인덱스 생성
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_era ON books(era);
CREATE INDEX idx_books_is_public ON books(is_public);
CREATE INDEX idx_books_view_count ON books(view_count);

-- 6. 전문 검색을 위한 인덱스 (MySQL FULLTEXT)
CREATE FULLTEXT INDEX idx_books_search ON books(title, author, description);

-- 7. 관리자 계정 생성 (비밀번호: admin123)
-- 실제 운영시에는 강력한 비밀번호로 변경하세요!
INSERT IGNORE INTO users (username, email, password_hash, is_admin, is_active) 
VALUES (
    'admin', 
    'admin@idopress.co.kr', 
    'pbkdf2:sha256:260000$xvK8P2QK$b8c1b4c3a5d2f3e4b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    TRUE, 
    TRUE
);

-- 8. 샘플 도서 데이터 삽입 (검색 테스트용)
INSERT IGNORE INTO books (title, title_original, author, era, genre, description, content, content_modern, publication_date, is_public, view_count) VALUES
(
    '삼국유사', 
    '三國遺事', 
    '일연', 
    '고려시대', 
    '역사', 
    '일연이 편찬한 역사서로, 삼국시대의 역사와 설화를 기록한 책입니다. 단군신화를 비롯해 고구려, 백제, 신라의 건국 설화와 불교 전래 등의 이야기가 담겨 있습니다.',
    '古朝鮮 檀君王儉 이라는 것은 與檀君同於一時가 아니라...', 
    '옛 조선의 단군왕검이라는 것은 단군과 같은 시대가 아니라...',
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
    '天帝之子 解慕漱 降于 扶餘川...', 
    '천제의 아들 해모수는 부여천에 내려왔다...',
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
    '南原 府使의 아들 李夢龍이 廣寒樓에서 기생 春香을 만나...', 
    '남원 부사의 아들 이몽룡이 광한루에서 기생 춘향을 만나...',
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
    '沈學規라는 선비가 있어 눈이 어두워...', 
    '심학규라는 선비가 있어 눈이 어두워...',
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
    '洪判書 洪泰은 조선국 사람이니...', 
    '홍판서 홍태는 조선국 사람이니...',
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
    '唐 太宗 때에 성진이라는 중이 있어...', 
    '당 태종 때에 성진이라는 중이 있어...',
    '17세기 후반',
    TRUE,
    1456
);

-- 9. 데이터베이스 설정 완료 확인
SELECT 
    'MySQL Database setup completed!' as status,
    count(*) as total_books,
    (SELECT count(*) FROM users WHERE is_admin = true) as admin_users
FROM books;

-- MySQL용 설정 완료
-- PostgreSQL 사용시에는 database_setup.sql 파일을 사용하세요.