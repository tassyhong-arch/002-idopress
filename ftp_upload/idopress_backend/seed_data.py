#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
이도출판 디지털 장서각 - 데이터베이스 시드 데이터 생성
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db, Book, User
from database.sample_data import SAMPLE_BOOKS

def seed_database():
    """데이터베이스에 샘플 데이터 삽입"""
    
    with app.app_context():
        try:
            # 기존 데이터 확인
            existing_books = Book.query.count()
            if existing_books > 0:
                print(f"이미 {existing_books}권의 도서가 데이터베이스에 존재합니다.")
                response = input("기존 데이터를 삭제하고 새로 생성하시겠습니까? (y/N): ")
                if response.lower() != 'y':
                    print("데이터 시드 작업을 취소합니다.")
                    return
                
                # 기존 데이터 삭제
                Book.query.delete()
                db.session.commit()
                print("기존 도서 데이터를 삭제했습니다.")

            # 샘플 도서 데이터 삽입
            print(f"{len(SAMPLE_BOOKS)}권의 샘플 도서를 추가합니다...")
            
            for book_data in SAMPLE_BOOKS:
                book = Book(
                    title=book_data['title'],
                    title_original=book_data.get('title_original'),
                    author=book_data['author'],
                    era=book_data['era'],
                    genre=book_data['genre'],
                    description=book_data['description'],
                    content=book_data['content'],
                    content_modern=book_data.get('content_modern'),
                    publication_date=book_data.get('publication_date'),
                    is_public=True,
                    view_count=0
                )
                db.session.add(book)
                print(f"추가됨: {book.title} ({book.author})")
            
            db.session.commit()
            print(f"\n✅ 총 {len(SAMPLE_BOOKS)}권의 도서가 성공적으로 추가되었습니다.")
            
            # 결과 확인
            total_books = Book.query.count()
            genres = db.session.query(Book.genre).distinct().all()
            eras = db.session.query(Book.era).distinct().all()
            
            print(f"\n📊 데이터베이스 현황:")
            print(f"- 총 도서 수: {total_books}권")
            print(f"- 장르: {[g[0] for g in genres]}")
            print(f"- 시대: {[e[0] for e in eras]}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ 오류 발생: {e}")
            raise

def create_admin_user():
    """관리자 계정 생성"""
    
    with app.app_context():
        try:
            # 기존 관리자 확인
            admin = User.query.filter_by(username='admin').first()
            if admin:
                print("관리자 계정이 이미 존재합니다.")
                return
            
            # 관리자 계정 생성
            admin = User(
                username='admin',
                email='admin@idopress.kr'
            )
            admin.set_password('admin123')  # 실제 운영에서는 강력한 비밀번호 사용
            
            db.session.add(admin)
            db.session.commit()
            
            print("✅ 관리자 계정이 생성되었습니다.")
            print("- 사용자명: admin")
            print("- 비밀번호: admin123")
            print("⚠️  운영 환경에서는 반드시 비밀번호를 변경하세요!")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ 관리자 계정 생성 오류: {e}")
            raise

def create_test_user():
    """테스트 사용자 계정 생성"""
    
    with app.app_context():
        try:
            # 기존 테스트 사용자 확인
            test_user = User.query.filter_by(username='testuser').first()
            if test_user:
                print("테스트 사용자 계정이 이미 존재합니다.")
                return
            
            # 테스트 사용자 계정 생성
            test_user = User(
                username='testuser',
                email='test@idopress.kr'
            )
            test_user.set_password('test123')
            
            db.session.add(test_user)
            db.session.commit()
            
            print("✅ 테스트 사용자 계정이 생성되었습니다.")
            print("- 사용자명: testuser")
            print("- 비밀번호: test123")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ 테스트 사용자 계정 생성 오류: {e}")
            raise

def main():
    """메인 실행 함수"""
    print("🏛️  이도출판 디지털 장서각 - 데이터베이스 초기화")
    print("=" * 50)
    
    try:
        # 데이터베이스 테이블 생성
        with app.app_context():
            db.create_all()
            print("✅ 데이터베이스 테이블이 준비되었습니다.")
        
        # 샘플 도서 데이터 삽입
        seed_database()
        
        # 관리자 계정 생성
        create_admin_user()
        
        # 테스트 사용자 계정 생성
        create_test_user()
        
        print("\n🎉 데이터베이스 초기화가 완료되었습니다!")
        print("\n이제 다음 명령으로 서버를 시작할 수 있습니다:")
        print("python app.py")
        
    except Exception as e:
        print(f"\n❌ 초기화 실패: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()