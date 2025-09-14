#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
관리자 비밀번호 재설정
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import app, db, User

def reset_admin_password():
    """관리자 비밀번호 재설정"""
    with app.app_context():
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            print("❌ admin 계정을 찾을 수 없습니다.")
            return
        
        # 새 비밀번호 설정
        new_password = 'admin123!'
        admin.set_password(new_password)
        admin.is_admin = True
        admin.is_active = True
        
        try:
            db.session.commit()
            print("✅ 관리자 비밀번호가 재설정되었습니다!")
            print(f"   사용자명: {admin.username}")
            print(f"   새 비밀번호: {new_password}")
            print(f"   관리자 권한: {admin.is_admin}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ 비밀번호 재설정 실패: {e}")

if __name__ == '__main__':
    reset_admin_password()