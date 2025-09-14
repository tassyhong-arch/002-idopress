#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
기존 admin 계정에 관리자 권한 부여
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app import app, db, User

def update_admin_privileges():
    """기존 admin 계정에 관리자 권한 부여"""
    with app.app_context():
        # admin 계정 찾기
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            print("❌ admin 계정을 찾을 수 없습니다.")
            return
        
        # 관리자 권한 부여
        admin.is_admin = True
        admin.is_active = True
        
        try:
            db.session.commit()
            print("✅ admin 계정에 관리자 권한이 부여되었습니다!")
            print(f"   사용자명: {admin.username}")
            print(f"   이메일: {admin.email}")
            print(f"   관리자 권한: {admin.is_admin}")
            print(f"   활성 상태: {admin.is_active}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ 권한 업데이트 실패: {e}")

if __name__ == '__main__':
    update_admin_privileges()