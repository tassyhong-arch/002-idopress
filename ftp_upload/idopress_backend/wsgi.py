#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
이도출판 디지털 장서각 - WSGI 엔트리포인트
웹 서버(Apache, Nginx) 배포용 WSGI 파일
"""

import sys
import os

# 현재 디렉토리를 Python 경로에 추가
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Flask 애플리케이션 임포트
from app import app

# WSGI application 객체
application = app

if __name__ == "__main__":
    application.run()