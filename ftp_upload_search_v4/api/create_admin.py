#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
관리자 계정 생성 스크립트
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import app, db, User

def create_admin_user():
    """기본 관리자 계정 생성"""
    with app.app_context():
        # 기존 관리자 계정 확인
        admin = User.query.filter_by(is_admin=True).first()
        if admin:
            print(f"관리자 계정이 이미 존재합니다: {admin.username}")
            return
        
        # 새 관리자 계정 생성
        admin_data = {
            'username': 'admin',
            'email': 'admin@idopress.co.kr',
            'is_admin': True,
            'is_active': True
        }
        
        admin_user = User(**admin_data)
        admin_user.set_password('admin123!')  # 기본 비밀번호 (나중에 변경 필요)
        
        db.session.add(admin_user)
        
        try:
            db.session.commit()
            print("✅ 관리자 계정이 생성되었습니다!")
            print(f"   사용자명: {admin_user.username}")
            print(f"   이메일: {admin_user.email}")
            print("   비밀번호: admin123!")
            print("")
            print("⚠️  보안을 위해 로그인 후 비밀번호를 변경하세요!")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ 관리자 계정 생성 실패: {e}")

if __name__ == '__main__':
    create_admin_user()