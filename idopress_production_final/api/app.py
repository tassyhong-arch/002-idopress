#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
후이즈 호스팅 전용 이도출판 Flask 백엔드
설정 없이 바로 작동하는 버전
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import uuid

# PyMySQL을 MySQLdb로 사용
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except:
    pass

# Flask 앱 생성
app = Flask(__name__)

# 후이즈 호스팅 자동 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://idopress_user:idopress123@localhost/idopress'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'idopress-secret-key-2024'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# 파일 업로드 설정
app.config['UPLOAD_FOLDER'] = '/home/계정명/public_html/api/uploads'  # 실제 경로로 변경
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 제한
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'epub', 'doc', 'docx', 'rtf'}

# CORS 허용
CORS(app, origins=['*'])

# 데이터베이스 및 JWT 초기화
db = SQLAlchemy(app)
jwt = JWTManager(app)

# 사용자 모델
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

# 도서 모델
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
    <h1>🎉 이도출판 디지털 장서각 API</h1>
    <p>✅ 백엔드 서버가 정상 작동중입니다!</p>
    <ul>
        <li><a href="/api/health">상태 확인</a></li>
        <li><a href="/api/books">도서 목록</a></li>
        <li><a href="/api/books/genres">장르 목록</a></li>
    </ul>
    """

@app.route('/api/health')
def health_check():
    """서버 상태 확인"""
    return jsonify({
        'status': 'healthy',
        'message': '이도출판 디지털 장서각 API 서버 정상 작동',
        'version': 'v4.0-whois',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/books', methods=['GET'])
def get_books():
    """도서 목록 조회"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        search = request.args.get('search', '')
        genre = request.args.get('genre', '')
        
        # 기본 쿼리
        query = Book.query.filter_by(is_public=True)
        
        # 검색 필터
        if search:
            search_pattern = f'%{search}%'
            query = query.filter(
                db.or_(
                    Book.title.like(search_pattern),
                    Book.author.like(search_pattern),
                    Book.description.like(search_pattern)
                )
            )
        
        # 장르 필터
        if genre and genre != 'all':
            query = query.filter(Book.genre == genre)
        
        # 정렬 및 페이지네이션
        query = query.order_by(Book.view_count.desc())
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
        return jsonify({'error': f'도서 목록 조회 실패: {str(e)}'}), 500

@app.route('/api/books/genres', methods=['GET'])
def get_genres():
    """장르 목록 조회"""
    try:
        genres_query = db.session.query(Book.genre).filter(
            Book.genre.isnot(None),
            Book.is_public == True
        ).distinct()
        
        genre_list = [genre[0] for genre in genres_query if genre[0]]
        
        return jsonify({
            'genres': sorted(genre_list)
        })
    
    except Exception as e:
        return jsonify({'error': f'장르 목록 조회 실패: {str(e)}'}), 500

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """특정 도서 상세 조회"""
    try:
        book = Book.query.get(book_id)
        
        if not book or not book.is_public:
            return jsonify({'error': '도서를 찾을 수 없습니다'}), 404
        
        # 조회수 증가
        book.view_count += 1
        db.session.commit()
        
        # 전체 내용 포함
        book_data = book.to_dict()
        book_data.update({
            'content': book.content,
            'content_modern': book.content_modern
        })
        
        return jsonify({'book': book_data})
    
    except Exception as e:
        return jsonify({'error': f'도서 조회 실패: {str(e)}'}), 500

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

@app.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
def admin_dashboard():
    """관리자 대시보드 통계"""
    try:
        # 관리자 권한 확인
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or not user.is_admin:
            return jsonify({'error': '관리자 권한이 필요합니다'}), 403
        
        # 통계 계산
        total_books = Book.query.count()
        total_users = User.query.count()
        public_books = Book.query.filter_by(is_public=True).count()
        
        # 최근 7일 추가된 도서
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_books = Book.query.filter(Book.created_at >= week_ago).count()
        
        return jsonify({
            'stats': {
                'total_books': total_books,
                'total_users': total_users,
                'public_books': public_books,
                'recent_books': recent_books,
                'total_reviews': 0  # 리뷰 테이블이 없어서 0으로 설정
            }
        })
    
    except Exception as e:
        return jsonify({'error': f'대시보드 통계 조회 실패: {str(e)}'}), 500

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
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 20, type=int)
            search = request.args.get('search', '')
            
            query = Book.query
            
            # 전체 도서 수 확인 (디버깅)
            total_books_count = Book.query.count()
            print(f"DEBUG: 전체 도서 수: {total_books_count}")
            
            if search:
                search_pattern = f'%{search}%'
                query = query.filter(
                    db.or_(
                        Book.title.like(search_pattern),
                        Book.author.like(search_pattern)
                    )
                )
            
            books = query.order_by(Book.created_at.desc()).paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            print(f"DEBUG: 페이지네이션 결과 - 총 {books.total}권, 현재 페이지 {books.page}")
            print(f"DEBUG: 현재 페이지 도서 수: {len(books.items)}")
            
            books_data = []
            for book in books.items:
                book_dict = book.to_dict_full()
                books_data.append(book_dict)
                print(f"DEBUG: 도서 - {book.title} (ID: {book.id})")
            
            return jsonify({
                'books': books_data,
                'total': books.total,
                'pages': books.pages,
                'current_page': books.page,
                'debug_info': {
                    'total_books_in_db': total_books_count,
                    'returned_books_count': len(books_data)
                }
            })
        
        elif request.method == 'POST':
            # 새 도서 직접 입력
            data = request.get_json()
            
            # 필수 필드 검증
            print(f"DEBUG: 받은 데이터: {data}")
            
            if not data.get('title'):
                return jsonify({'error': '제목은 필수 입력 항목입니다'}), 400
            if not data.get('author'):
                return jsonify({'error': '저자는 필수 입력 항목입니다'}), 400
            
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
            
            print(f"DEBUG: 도서 생성 성공 - ID: {book.id}, 제목: {book.title}")
            return jsonify({
                'message': '도서가 성공적으로 추가되었습니다',
                'book': book.to_dict_full()
            }), 201
    
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"DEBUG: 도서 관리 오류 - {str(e)}")
        print(f"DEBUG: 오류 상세: {error_trace}")
        return jsonify({
            'error': f'도서 관리 실패: {str(e)}',
            'detail': str(e),
            'type': type(e).__name__
        }), 500

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
                    content = f.read()[:10000]  # 처음 10000자만
            except UnicodeDecodeError:
                try:
                    # CP949로 시도
                    with open(file_path, 'r', encoding='cp949') as f:
                        content = f.read()[:10000]
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
            'message': '파일이 성공적으로 업로드되었습니다',
            'book': book.to_dict_full()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'파일 업로드 실패: {str(e)}'}), 500

@app.route('/api/admin/books/<int:book_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def admin_book_detail(book_id):
    """관리자 도서 상세 관리"""
    try:
        # 관리자 권한 확인
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or not user.is_admin:
            return jsonify({'error': '관리자 권한이 필요합니다'}), 403
        
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'error': '도서를 찾을 수 없습니다'}), 404
        
        if request.method == 'PUT':
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
                'message': '도서 정보가 수정되었습니다',
                'book': book.to_dict_full()
            })
        
        elif request.method == 'DELETE':
            # 도서 삭제
            # 업로드된 파일도 함께 삭제
            if book.file_path:
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], book.file_path)
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                    except:
                        pass  # 파일 삭제 실패해도 DB에서는 삭제
            
            db.session.delete(book)
            db.session.commit()
            
            return jsonify({'message': '도서가 삭제되었습니다'})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'도서 관리 실패: {str(e)}'}), 500

# 에러 핸들러
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': '요청한 페이지를 찾을 수 없습니다'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': '서버 내부 오류가 발생했습니다'}), 500

# cPanel Python App에서 사용할 application 객체
application = app

# 로컬 테스트용
if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
        except:
            pass
    app.run(debug=False, host='0.0.0.0', port=5000)