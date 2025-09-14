#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
후이즈 호스팅용 Flask 앱 수정 버전
api/app.py 파일을 이 내용으로 교체하세요
"""

import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import pymysql
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# PyMySQL을 MySQLdb 모듈로 사용
pymysql.install_as_MySQLdb()

# Flask 앱 생성
app = Flask(__name__)

# 후이즈 호스팅용 설정
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'mysql://idopress_user:password@localhost/idopress'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-this-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# CORS 설정 - 중요!
CORS(app, origins=['*'])

# 확장 모듈 초기화
db = SQLAlchemy(app)
jwt = JWTManager(app)

# 간단한 User 모델
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# 간단한 Book 모델
class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    title_original = db.Column(db.String(200))
    author = db.Column(db.String(100), nullable=False)
    era = db.Column(db.String(50))
    genre = db.Column(db.String(50))
    description = db.Column(db.Text)
    content = db.Column(db.Text)
    content_modern = db.Column(db.Text)
    publication_date = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_public = db.Column(db.Boolean, default=True)
    view_count = db.Column(db.Integer, default=0)
    
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
            'view_count': self.view_count,
            'has_modern_translation': bool(self.content_modern)
        }

# API 엔드포인트들

@app.route('/')
def index():
    return "이도출판 디지털 장서각 API 서버가 정상 작동중입니다!"

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': '이도출판 백엔드 API 정상 작동',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/books')
def get_books():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        search = request.args.get('search', '')
        genre = request.args.get('genre', '')
        
        # 기본 쿼리
        query = Book.query.filter_by(is_public=True)
        
        # 검색 필터
        if search:
            query = query.filter(
                db.or_(
                    Book.title.like(f'%{search}%'),
                    Book.author.like(f'%{search}%'),
                    Book.description.like(f'%{search}%')
                )
            )
        
        # 장르 필터
        if genre and genre != 'all':
            query = query.filter(Book.genre == genre)
        
        # 페이지네이션
        total = query.count()
        books = query.offset((page - 1) * per_page).limit(per_page).all()
        
        return jsonify({
            'books': [book.to_dict() for book in books],
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'current_page': page,
            'per_page': per_page
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/genres')
def get_genres():
    try:
        genres = db.session.query(Book.genre).filter(
            Book.genre.isnot(None),
            Book.is_public == True
        ).distinct().all()
        
        genre_list = [genre[0] for genre in genres if genre[0]]
        
        return jsonify({'genres': sorted(genre_list)})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<int:book_id>')
def get_book(book_id):
    try:
        book = Book.query.get(book_id)
        
        if not book or not book.is_public:
            return jsonify({'error': 'Book not found'}), 404
        
        # 조회수 증가
        book.view_count += 1
        db.session.commit()
        
        book_data = book.to_dict()
        book_data.update({
            'content': book.content,
            'content_modern': book.content_modern
        })
        
        return jsonify({'book': book_data})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 에러 핸들러
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# 개발 서버 실행 (cPanel에서는 사용 안 함)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=False)