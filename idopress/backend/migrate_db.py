#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
데이터베이스 스키마 마이그레이션
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import app, db

def migrate_database():
    """데이터베이스 스키마 업데이트"""
    with app.app_context():
        try:
            # 새로운 컬럼들 추가
            print("데이터베이스 마이그레이션 시작...")
            
            # users 테이블에 is_admin 컬럼 추가
            try:
                with db.engine.connect() as conn:
                    conn.execute(db.text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE"))
                    conn.commit()
                print("✅ users.is_admin 컬럼 추가 완료")
            except Exception as e:
                if "already exists" in str(e) or "duplicate column" in str(e):
                    print("ℹ️  users.is_admin 컬럼이 이미 존재합니다")
                else:
                    print(f"⚠️  users.is_admin 컬럼 추가 실패: {e}")
            
            # books 테이블에 새 컬럼들 추가
            new_columns = [
                ("file_path", "VARCHAR(255)"),
                ("file_type", "VARCHAR(20)"),
                ("file_size", "INTEGER"),
                ("uploaded_by", "INTEGER")
            ]
            
            for column_name, column_type in new_columns:
                try:
                    with db.engine.connect() as conn:
                        conn.execute(db.text(f"ALTER TABLE books ADD COLUMN {column_name} {column_type}"))
                        conn.commit()
                    print(f"✅ books.{column_name} 컬럼 추가 완료")
                except Exception as e:
                    if "already exists" in str(e) or "duplicate column" in str(e):
                        print(f"ℹ️  books.{column_name} 컬럼이 이미 존재합니다")
                    else:
                        print(f"⚠️  books.{column_name} 컬럼 추가 실패: {e}")
            
            # 외래키 제약조건 추가 (옵션)
            try:
                with db.engine.connect() as conn:
                    conn.execute(db.text("ALTER TABLE books ADD CONSTRAINT fk_books_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id)"))
                    conn.commit()
                print("✅ 외래키 제약조건 추가 완료")
            except Exception as e:
                if "already exists" in str(e):
                    print("ℹ️  외래키 제약조건이 이미 존재합니다")
                else:
                    print(f"⚠️  외래키 제약조건 추가 실패: {e}")
            
            print("데이터베이스 마이그레이션 완료!")
            
        except Exception as e:
            print(f"❌ 마이그레이션 실패: {e}")

if __name__ == '__main__':
    migrate_database()