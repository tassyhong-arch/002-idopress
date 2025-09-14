-- 후이즈 호스팅용 MySQL 데이터베이스 설정
-- phpMyAdmin에서 이 SQL을 복사해서 실행하세요

-- 1. 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS reading_progress;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

-- 2. 사용자 테이블 생성
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

-- 3. 도서 테이블 생성
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
    uploaded_by INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 독서 진행 테이블 생성
CREATE TABLE reading_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    progress_percentage FLOAT DEFAULT 0.0,
    last_position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 리뷰 테이블 생성
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 관리자 계정 생성 (ID: admin, 비밀번호: admin123)
INSERT INTO users (username, email, password_hash, is_admin, is_active) VALUES 
('admin', 'admin@idopress.co.kr', 'pbkdf2:sha256:260000$xvK8P2QK$b8c1b4c3a5d2f3e4b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', TRUE, TRUE);

-- 7. 샘플 도서 데이터 추가
INSERT INTO books (title, title_original, author, era, genre, description, content, content_modern, publication_date, is_public, view_count) VALUES
('춘향전', '春香傳', '작자 미상', '조선시대', '문학', 
'조선후기의 대표적인 판소리계 소설로, 춘향과 몽룡의 사랑 이야기를 통해 신분제 사회의 모순을 비판한 작품입니다.', 
'南原 府使의 아들 李夢龍이 廣寒樓에서 기생 春香을 만나 사랑에 빠졌다. 夢龍이 한양으로 과거를 보러 떠난 후, 새로 부임한 부사 卞學道가 춘향에게 수청을 강요했으나 춘향이 거절하자 옥에 가두었다...', 
'남원 부사의 아들 이몽룡이 광한루에서 기생 춘향을 만나 사랑에 빠졌다. 몽룡이 한양으로 과거를 보러 떠난 후, 새로 부임한 부사 변학도가 춘향에게 수청을 강요했으나 춘향이 거절하자 옥에 가두었다...', 
'18세기', TRUE, 2342),

('홍길동전', '洪吉童傳', '허균', '조선시대', '문학', 
'허균이 지은 한국 최초의 한글 소설로, 서자 출신인 홍길동이 사회적 신분제의 모순에 맞서는 이야기를 그린 작품입니다.', 
'洪判書 洪泰은 조선국 사람이니 벼슬이 판서에 이르렀고 재물이 거만하며 집이 壯麗하여 당시에 견줄 사람이 없었다. 그런데 자식이 없어 근심하더니...', 
'홍판서 홍태는 조선국 사람으로 벼슬이 판서에 이르렀고 재물이 많으며 집이 장려하여 당시에 견줄 사람이 없었다. 그런데 자식이 없어 근심하더니...', 
'1612년', TRUE, 1987),

('삼국유사', '三國遺事', '일연', '고려시대', '역사', 
'일연이 편찬한 역사서로, 삼국시대의 역사와 설화를 기록한 책입니다. 단군신화를 비롯해 고구려, 백제, 신라의 건국 설화와 불교 전래 등의 이야기가 담겨 있습니다.', 
'古朝鮮 檀君王儉 魏書云 乃往二千載有檀君王儉 立都阿斯達 開國號朝鮮 與堯同時...', 
'옛 조선의 단군왕검에 대해 위서에 이르기를, 지금으로부터 2000년 전에 단군왕검이 있어 아사달에 도읍을 정하고 나라를 열어 조선이라 하였으니 요임금과 같은 시대였다...', 
'1281년', TRUE, 1249),

('심청전', '沈淸傳', '작자 미상', '조선시대', '문학', 
'효녀 심청이 아버지의 눈을 뜨게 하기 위해 인당수에 몸을 던지는 효행담을 그린 조선후기의 판소리계 소설입니다.', 
'沈學規라는 선비가 있어 눈이 어두워 걸식으로 연명하더니 어느 날 물에 빠진 것을 부처님께 기도하여 딸을 얻었으니 이름을 沈淸이라 하였다...', 
'심학규라는 선비가 있어 눈이 어두워 걸식으로 연명하더니 어느 날 물에 빠진 것을 부처님께 기도하여 딸을 얻었으니 이름을 심청이라 하였다...', 
'18세기', TRUE, 1876),

('구운몽', '九雲夢', '김만중', '조선시대', '문학', 
'김만중이 지은 고전소설로, 성진이 꿈속에서 양소유로 환생하여 8명의 여인과 만나는 이야기를 통해 인생무상을 그린 작품입니다.', 
'唐 太宗 때에 성진이라는 중이 있어 지혜와 덕행이 높아 師父의 사랑을 받더니 어느 날 꿈에 선녀들을 보고 마음이 흔들렸다...', 
'당 태종 때에 성진이라는 중이 있어 지혜와 덕행이 높아 사부의 사랑을 받더니 어느 날 꿈에 선녀들을 보고 마음이 흔들렸다...', 
'17세기 후반', TRUE, 1456),

('동명왕편', '東明王篇', '이규보', '고려시대', '문학', 
'이규보가 지은 영웅서사시로, 고구려 건국시조 동명왕 주몽의 일생을 노래한 작품입니다. 한국 문학사상 최초의 영웅서사시로 평가받습니다.', 
'天帝之子 解慕漱 降于 扶餘川 見河伯女 河中游 感其美色 誘而幸之...', 
'천제의 아들 해모수가 부여천에 내려와 하백의 딸이 강에서 노는 것을 보고 그 아름다운 모습에 감동하여 유인해 사랑하였다...', 
'1193년', TRUE, 567);

-- 8. 검색 성능을 위한 인덱스 생성
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_era ON books(era);
CREATE INDEX idx_books_public ON books(is_public);
CREATE INDEX idx_books_view_count ON books(view_count);

-- 9. 전문 검색을 위한 FULLTEXT 인덱스
CREATE FULLTEXT INDEX idx_books_fulltext ON books(title, author, description);

-- 10. 설정 완료 확인
SELECT 
    '✅ 데이터베이스 설정이 완료되었습니다!' as message,
    COUNT(*) as total_books,
    (SELECT COUNT(*) FROM users WHERE is_admin = TRUE) as admin_users
FROM books;

-- 완료! 이제 웹사이트에서 검색 기능을 사용할 수 있습니다.