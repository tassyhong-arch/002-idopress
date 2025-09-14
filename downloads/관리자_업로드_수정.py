#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
관리자 업로드 기능 수정 버전
기존 api/app.py 파일에 추가할 코드
"""

# 기존 app.py 파일에 다음 코드들을 추가하세요

# 1. 파일 업로드를 위한 추가 import (파일 상단에 추가)
from werkzeug.utils import secure_filename
import uuid

# 2. 파일 업로드 설정 (Flask 앱 설정 부분에 추가)
app.config['UPLOAD_FOLDER'] = '/home/계정명/public_html/api/uploads'  # 실제 경로로 변경
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 제한
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'epub', 'doc', 'docx', 'rtf'}

# 3. 헬퍼 함수 (기존 함수들 다음에 추가)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 4. 관리자 도서 생성 API (기존 엔드포인트들 다음에 추가)
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
            
            return jsonify({
                'books': [book.to_dict_full() for book in books.items],
                'total': books.total,
                'pages': books.pages,
                'current_page': books.page
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
                'message': '도서가 성공적으로 추가되었습니다',
                'book': book.to_dict_full()
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

# 5. Book 모델에 to_dict_full 메소드 추가 (Book 클래스 안에 추가)
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

# Book 클래스에 메소드 추가
Book.to_dict_full = to_dict_full