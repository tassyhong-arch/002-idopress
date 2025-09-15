#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
관리자 업로드 기능 테스트용 간단한 Flask 앱
SQLite를 사용해서 MySQL 없이도 테스트 가능
"""

import os
import sys
import uuid
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

# Flask 앱 생성
app = Flask(__name__)

# SQLite 테스트 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_idopress.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'test-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# 파일 업로드 설정
app.config['UPLOAD_FOLDER'] = '/home/user/webapp/whois_ftp_complete/api/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 제한
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'epub', 'doc', 'docx', 'rtf'}

# CORS 허용
CORS(app, origins=['*'])

# 데이터베이스 및 JWT 초기화
db = SQLAlchemy(app)
jwt = JWTManager(app)

# 모델 정의
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
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'is_active': self.is_active
        }

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
    # 파일 업로드 관련 필드
    file_path = db.Column(db.String(255))
    file_type = db.Column(db.String(20))
    file_size = db.Column(db.Integer)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
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
            'has_modern_translation': bool(self.content_modern),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def to_dict_full(self):
        """전체 내용 포함한 딕셔너리"""
        data = self.to_dict()
        data.update({
            'content': self.content,
            'content_modern': self.content_modern,
            'file_path': getattr(self, 'file_path', None),
            'file_type': getattr(self, 'file_type', None),
            'file_size': getattr(self, 'file_size', None)
        })
        return data

# 헬퍼 함수
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# API 엔드포인트

@app.route('/')
def home():
    return """
    <h1>🧪 관리자 업로드 기능 테스트 서버</h1>
    <p>✅ 백엔드 서버가 정상 작동중입니다!</p>
    <ul>
        <li><a href="/api/health">상태 확인</a></li>
        <li><a href="/api/books">도서 목록</a></li>
        <li>관리자 로그인: admin/admin123</li>
    </ul>
    """

@app.route('/api/health')
def health_check():
    """서버 상태 확인"""
    return jsonify({
        'status': 'healthy',
        'message': '관리자 업로드 기능 테스트 서버 정상 작동',
        'version': 'test-v4.1',
        'timestamp': datetime.utcnow().isoformat(),
        'db_tables': db.engine.table_names()
    })

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """관리자 로그인"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': '사용자명과 비밀번호를 입력하세요'}), 400
        
        user = User.query.filter_by(username=username, is_admin=True).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': '잘못된 관리자 정보입니다'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': '관리자 로그인 성공',
            'access_token': access_token,
            'user': user.to_dict()
        })
    
    except Exception as e:
        return jsonify({'error': f'로그인 실패: {str(e)}'}), 500

@app.route('/api/books', methods=['GET'])
def get_books():
    """도서 목록 조회"""
    try:
        books = Book.query.filter_by(is_public=True).all()
        return jsonify({
            'books': [book.to_dict() for book in books],
            'total': len(books),
            'message': 'SQLite 테스트 데이터베이스 사용중'
        })
    except Exception as e:
        return jsonify({'error': f'도서 목록 조회 실패: {str(e)}'}), 500

@app.route('/api/admin/books', methods=['GET', 'POST'])
@jwt_required()
def admin_books():
    """관리자 도서 관리"""
    try:
        # 관리자 권한 확인
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or not user.is_admin:
            return jsonify({'error': '관리자 권한이 필요합니다'}), 403
        
        if request.method == 'GET':
            # 관리자용 도서 목록 (비공개 포함)
            books = Book.query.all()
            return jsonify({
                'books': [book.to_dict_full() for book in books],
                'total': len(books),
                'message': '관리자 전용 도서 목록 (비공개 포함)'
            })
        
        elif request.method == 'POST':
            # 새 도서 직접 입력
            data = request.get_json()
            
            # 필수 필드 검증
            if not data.get('title') or not data.get('author'):
                return jsonify({'error': '제목과 저자는 필수입니다'}), 400
            
            # 새 도서 생성
            book = Book(
                title=data['title'],
                title_original=data.get('title_original'),
                author=data['author'],
                era=data.get('era'),
                genre=data.get('genre'),
                description=data.get('description'),
                content=data.get('content', ''),
                content_modern=data.get('content_modern', ''),
                publication_date=data.get('publication_date'),
                is_public=data.get('is_public', True),  # 기본값을 True로 변경
                uploaded_by=int(user_id)
            )
            
            db.session.add(book)
            db.session.commit()
            
            return jsonify({
                'message': '✅ 도서가 성공적으로 추가되었습니다! 이제 전체 도서목록에서 확인 가능합니다.',
                'book': book.to_dict_full(),
                'test_url': '/api/books'
            }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'도서 관리 실패: {str(e)}'}), 500

@app.route('/api/admin/books/upload', methods=['POST'])
@jwt_required()
def admin_upload_book():
    """관리자 파일 업로드"""
    try:
        # 관리자 권한 확인
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or not user.is_admin:
            return jsonify({'error': '관리자 권한이 필요합니다'}), 403
        
        # 파일 업로드 확인
        if 'file' not in request.files:
            return jsonify({'error': '파일이 선택되지 않았습니다'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': '파일이 선택되지 않았습니다'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': '지원하지 않는 파일 형식입니다'}), 400
        
        # 업로드 폴더 확인 및 생성
        upload_folder = app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            try:
                os.makedirs(upload_folder, mode=0o755)
            except Exception as e:
                return jsonify({'error': f'업로드 폴더 생성 실패: {str(e)}'}), 500
        
        # 파일 저장
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(upload_folder, unique_filename)
        
        try:
            file.save(file_path)
        except Exception as e:
            return jsonify({'error': f'파일 저장 실패: {str(e)}'}), 500
        
        # 파일 정보
        file_size = os.path.getsize(file_path)
        file_type = filename.rsplit('.', 1)[1].lower()
        
        # 파일 내용 읽기 (텍스트 파일인 경우)
        content = ""
        if file_type in ['txt', 'rtf']:
            try:
                # UTF-8로 먼저 시도
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()[:1000]  # 처음 1000자만
            except UnicodeDecodeError:
                try:
                    # CP949로 시도
                    with open(file_path, 'r', encoding='cp949') as f:
                        content = f.read()[:1000]
                except:
                    content = "파일 내용을 읽을 수 없습니다"
        
        # 폼 데이터에서 메타정보 가져오기
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
            is_public=True,  # 업로드된 파일은 기본적으로 공개
            uploaded_by=int(user_id)
        )
        
        db.session.add(book)
        db.session.commit()
        
        return jsonify({
            'message': '✅ 파일이 성공적으로 업로드되었습니다! 전체 도서목록에서 확인 가능합니다.',
            'book': book.to_dict_full(),
            'file_info': {
                'original_name': filename,
                'saved_name': unique_filename,
                'size': file_size,
                'type': file_type,
                'content_preview': content[:100] + '...' if len(content) > 100 else content
            },
            'test_url': '/api/books'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'파일 업로드 실패: {str(e)}'}), 500

# 초기화
def init_test_db():
    """테스트용 데이터베이스 초기화"""
    with app.app_context():
        db.create_all()
        
        # 관리자 계정 생성 (없으면)
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@test.com',
                password_hash=generate_password_hash('admin123'),
                is_admin=True,
                is_active=True
            )
            db.session.add(admin_user)
            
            # 테스트 도서 추가
            test_book = Book(
                title='테스트 도서',
                author='작자 미상',
                genre='문학',
                description='관리자 기능 테스트용 도서입니다.',
                content='이것은 테스트 내용입니다.',
                is_public=True,
                uploaded_by=1
            )
            db.session.add(test_book)
            db.session.commit()
            print("✅ 테스트용 관리자 계정과 샘플 도서가 생성되었습니다.")
            print("   로그인: admin / admin123")

if __name__ == '__main__':
    init_test_db()
    print("🚀 관리자 업로드 기능 테스트 서버 시작...")
    print("   접속: http://localhost:5000")
    print("   관리자 로그인: admin / admin123")
    app.run(debug=True, host='0.0.0.0', port=5000)