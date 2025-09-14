#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
간단한 Flask 테스트 - api/simple_test.py로 저장 후 테스트
"""

from flask import Flask, jsonify
import os
import sys

app = Flask(__name__)

@app.route('/')
def index():
    return "이도출판 백엔드 테스트 - 정상 작동!"

@app.route('/api/test')
def api_test():
    return jsonify({
        "status": "success",
        "message": "백엔드 API가 정상 작동합니다!",
        "python_version": sys.version,
        "current_path": os.getcwd()
    })

@app.route('/api/health')
def health():
    return jsonify({
        "status": "healthy", 
        "service": "이도출판 디지털 장서각",
        "version": "v4.0"
    })

if __name__ == '__main__':
    app.run(debug=False)