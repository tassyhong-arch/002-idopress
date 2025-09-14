#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
이도출판 디지털 장서각 - Flask Backend API
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import bcrypt
import uuid
from functools import wraps

# Flask 앱 생성 및 설정
app = Flask(__name__)

# 환경 변수 설정
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'postgresql://idopress_user:idopress_password@localhost:5432/idopress'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# 파일 업로드 설정
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 최대 파일 크기
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'epub', 'doc', 'docx', 'rtf'}

# 확장 모듈 초기화
db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
CORS(app)

# 업로드 폴더 생성
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 헬퍼 함수들
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def admin_required(f):
    """관리자 권한 필요 데코레이터"""
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated

# 데이터베이스 모델 정의

class User(db.Model):
    """사용자 모델"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)  # 관리자 권한
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # 관계
    reading_progress = db.relationship('ReadingProgress', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)
    
    def set_password(self, password):
        """비밀번호 해시 설정"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """비밀번호 확인"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class Book(db.Model):
    """도서 모델"""
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    title_original = db.Column(db.String(200))  # 원제
    author = db.Column(db.String(100), nullable=False)
    era = db.Column(db.String(50))  # 시대 (삼국시대, 고려시대, 조선시대 등)
    genre = db.Column(db.String(50))  # 장르 (역사, 철학, 문학 등)
    description = db.Column(db.Text)
    content = db.Column(db.Text)  # 원문 내용
    content_modern = db.Column(db.Text)  # 현대어 번역
    publication_date = db.Column(db.String(50))  # 원작 출간일
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_public = db.Column(db.Boolean, default=True)
    view_count = db.Column(db.Integer, default=0)
    
    # 파일 관련 필드
    file_path = db.Column(db.String(255))  # 업로드된 파일 경로
    file_type = db.Column(db.String(20))   # 파일 타입 (txt, epub, pdf 등)
    file_size = db.Column(db.Integer)      # 파일 크기 (바이트)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'))  # 업로드한 관리자
    
    # 관계
    reading_progress = db.relationship('ReadingProgress', backref='book', lazy=True)
    reviews = db.relationship('Review', backref='book', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'title_original': self.title_original,
            'author': self.author,
            'era': self.era,
            'genre': self.genre,
            'description': self.description,
            'publication_date': self.publication_date,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'view_count': self.view_count,
            'has_modern_translation': bool(self.content_modern)
        }
    
    def to_dict_full(self):
        """전체 내용 포함"""
        data = self.to_dict()
        data.update({
            'content': self.content,
            'content_modern': self.content_modern
        })
        return data

class ReadingProgress(db.Model):
    """독서 진행상황 모델"""
    __tablename__ = 'reading_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    progress_percentage = db.Column(db.Float, default=0.0)  # 읽기 진행률
    last_position = db.Column(db.String(100))  # 마지막 읽은 위치
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Review(db.Model):
    """리뷰 모델"""
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    rating = db.Column(db.Integer)  # 평점 (1-5)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# API 엔드포인트

@app.route('/api/health', methods=['GET'])
def health_check():
    """헬스 체크"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# 사용자 인증 API
@app.route('/api/auth/register', methods=['POST'])
def register():
    """사용자 등록"""
    try:
        data = request.get_json()
        
        # 필수 필드 검증
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # 중복 확인
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # 새 사용자 생성
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """사용자 로그인"""
    try:
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        # 사용자 확인
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # 마지막 로그인 시간 업데이트
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # JWT 토큰 생성
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """사용자 프로필 조회"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 도서 관리 API
@app.route('/api/books', methods=['GET'])
def get_books():
    """도서 목록 조회"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        genre = request.args.get('genre', '')
        era = request.args.get('era', '')
        
        # 기본 쿼리
        query = Book.query.filter_by(is_public=True)
        
        # 검색 필터
        if search:
            query = query.filter(
                db.or_(
                    Book.title.ilike(f'%{search}%'),
                    Book.author.ilike(f'%{search}%'),
                    Book.description.ilike(f'%{search}%')
                )
            )
        
        # 장르 필터
        if genre:
            query = query.filter_by(genre=genre)
        
        # 시대 필터
        if era:
            query = query.filter_by(era=era)
        
        # 페이지네이션
        books = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'books': [book.to_dict() for book in books.items],
            'total': books.total,
            'pages': books.pages,
            'current_page': books.page,
            'per_page': books.per_page
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """특정 도서 상세 조회"""
    try:
        book = Book.query.get(book_id)
        
        if not book or not book.is_public:
            return jsonify({'error': 'Book not found'}), 404
        
        # 조회수 증가
        book.view_count += 1
        db.session.commit()
        
        return jsonify({'book': book.to_dict_full()})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/genres', methods=['GET'])
def get_genres():
    """장르 목록 조회"""
    try:
        genres = db.session.query(Book.genre).filter(
            Book.genre.isnot(None),
            Book.is_public == True
        ).distinct().all()
        
        genre_list = [genre[0] for genre in genres if genre[0]]
        
        return jsonify({'genres': sorted(genre_list)})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/eras', methods=['GET'])
def get_eras():
    """시대 목록 조회"""
    try:
        eras = db.session.query(Book.era).filter(
            Book.era.isnot(None),
            Book.is_public == True
        ).distinct().all()
        
        era_list = [era[0] for era in eras if era[0]]
        
        return jsonify({'eras': sorted(era_list)})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 독서 진행상황 API
@app.route('/api/progress/<int:book_id>', methods=['GET', 'POST'])
@jwt_required()
def reading_progress(book_id):
    """독서 진행상황 조회/업데이트"""
    try:
        user_id = int(get_jwt_identity())
        
        if request.method == 'GET':
            # 진행상황 조회
            progress = ReadingProgress.query.filter_by(
                user_id=user_id, 
                book_id=book_id
            ).first()
            
            if not progress:
                return jsonify({
                    'progress_percentage': 0.0,
                    'last_position': None
                })
            
            return jsonify({
                'progress_percentage': progress.progress_percentage,
                'last_position': progress.last_position,
                'updated_at': progress.updated_at.isoformat()
            })
        
        elif request.method == 'POST':
            # 진행상황 업데이트
            data = request.get_json()
            
            progress = ReadingProgress.query.filter_by(
                user_id=user_id, 
                book_id=book_id
            ).first()
            
            if not progress:
                progress = ReadingProgress(
                    user_id=user_id,
                    book_id=book_id
                )
                db.session.add(progress)
            
            if 'progress_percentage' in data:
                progress.progress_percentage = data['progress_percentage']
            if 'last_position' in data:
                progress.last_position = data['last_position']
            
            progress.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({'message': 'Progress updated successfully'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== 관리자 API =====

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """관리자 로그인"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        # 관리자 확인
        user = User.query.filter_by(username=username, is_admin=True).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid admin credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Admin account is deactivated'}), 401
        
        # 마지막 로그인 시간 업데이트
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # JWT 토큰 생성
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Admin login successful',
            'access_token': access_token,
            'user': user.to_dict()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dashboard', methods=['GET'])
@admin_required
def admin_dashboard():
    """관리자 대시보드 통계"""
    try:
        # 기본 통계 정보
        total_books = Book.query.count()
        total_users = User.query.count()
        total_reviews = Review.query.count()
        
        # 최근 추가된 도서 (최근 7일)
        recent_books = Book.query.filter(
            Book.created_at >= datetime.utcnow() - timedelta(days=7)
        ).count()
        
        # 인기 도서 (조회수 기준 상위 5개)
        popular_books = Book.query.order_by(Book.view_count.desc()).limit(5).all()
        
        return jsonify({
            'stats': {
                'total_books': total_books,
                'total_users': total_users,
                'total_reviews': total_reviews,
                'recent_books': recent_books
            },
            'popular_books': [book.to_dict() for book in popular_books]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/books', methods=['GET', 'POST'])
@admin_required
def admin_books():
    """관리자 도서 관리"""
    try:
        if request.method == 'GET':
            # 도서 목록 조회 (관리자용 - 비공개 도서 포함)
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 20, type=int)
            search = request.args.get('search', '')
            
            query = Book.query
            
            if search:
                query = query.filter(
                    db.or_(
                        Book.title.ilike(f'%{search}%'),
                        Book.author.ilike(f'%{search}%')
                    )
                )
            
            books = query.order_by(Book.created_at.desc()).paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return jsonify({
                'books': [book.to_dict_full() for book in books.items],
                'total': books.total,
                'pages': books.pages,
                'current_page': books.page
            })
        
        elif request.method == 'POST':
            # 새 도서 생성 (텍스트 입력)
            data = request.get_json()
            
            required_fields = ['title', 'author']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
            # 새 도서 생성
            book = Book(
                title=data['title'],
                title_original=data.get('title_original'),
                author=data['author'],
                era=data.get('era'),
                genre=data.get('genre'),
                description=data.get('description'),
                content=data.get('content'),
                content_modern=data.get('content_modern'),
                publication_date=data.get('publication_date'),
                is_public=data.get('is_public', False),  # 기본적으로 비공개
                uploaded_by=int(get_jwt_identity())
            )
            
            db.session.add(book)
            db.session.commit()
            
            return jsonify({
                'message': 'Book created successfully',
                'book': book.to_dict_full()
            }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/books/upload', methods=['POST'])
@admin_required
def admin_upload_book():
    """관리자 파일 업로드"""
    try:
        # 파일 업로드 확인
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # 파일 저장
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        # 파일 크기 확인
        file_size = os.path.getsize(file_path)
        file_type = filename.rsplit('.', 1)[1].lower()
        
        # 파일 내용 읽기 (텍스트 파일인 경우)
        content = ""
        if file_type in ['txt', 'rtf']:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                with open(file_path, 'r', encoding='cp949') as f:
                    content = f.read()
        
        # 메타데이터
        title = request.form.get('title', filename.rsplit('.', 1)[0])
        author = request.form.get('author', '작자 미상')
        
        # 도서 생성
        book = Book(
            title=title,
            title_original=request.form.get('title_original'),
            author=author,
            era=request.form.get('era'),
            genre=request.form.get('genre'),
            description=request.form.get('description'),
            content=content,
            content_modern=request.form.get('content_modern'),
            publication_date=request.form.get('publication_date'),
            file_path=unique_filename,
            file_type=file_type,
            file_size=file_size,
            is_public=False,  # 업로드 후 검토 필요
            uploaded_by=int(get_jwt_identity())
        )
        
        db.session.add(book)
        db.session.commit()
        
        return jsonify({
            'message': 'File uploaded successfully',
            'book': book.to_dict_full()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/books/<int:book_id>', methods=['GET', 'PUT', 'DELETE'])
@admin_required
def admin_book_detail(book_id):
    """관리자 도서 상세 관리"""
    try:
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'error': 'Book not found'}), 404
        
        if request.method == 'GET':
            return jsonify({'book': book.to_dict_full()})
        
        elif request.method == 'PUT':
            # 도서 정보 수정
            data = request.get_json()
            
            # 수정 가능한 필드들
            updatable_fields = [
                'title', 'title_original', 'author', 'era', 'genre', 
                'description', 'content', 'content_modern', 'publication_date', 'is_public'
            ]
            
            for field in updatable_fields:
                if field in data:
                    setattr(book, field, data[field])
            
            book.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'message': 'Book updated successfully',
                'book': book.to_dict_full()
            })
        
        elif request.method == 'DELETE':
            # 도서 삭제
            # 업로드된 파일도 함께 삭제
            if book.file_path:
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], book.file_path)
                if os.path.exists(file_path):
                    os.remove(file_path)
            
            db.session.delete(book)
            db.session.commit()
            
            return jsonify({'message': 'Book deleted successfully'})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/files/<filename>')
@admin_required
def admin_serve_file(filename):
    """관리자 파일 다운로드"""
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

# 에러 핸들러
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

# 애플리케이션 실행
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(host='0.0.0.0', port=5000, debug=True)