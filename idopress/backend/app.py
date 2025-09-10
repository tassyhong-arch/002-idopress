#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
이도출판 디지털 장서각 - Flask Backend API
"""

import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import bcrypt

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

# 확장 모듈 초기화
db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
CORS(app)

# 데이터베이스 모델 정의

class User(db.Model):
    """사용자 모델"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
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
        access_token = create_access_token(identity=user.id)
        
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
        user = User.query.get(user_id)
        
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
        user_id = get_jwt_identity()
        
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