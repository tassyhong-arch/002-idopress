#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DOCX 파일을 텍스트로 추출하는 스크립트
"""

import sys
from docx import Document

def extract_docx_text(file_path):
    """DOCX 파일에서 텍스트를 추출합니다."""
    try:
        doc = Document(file_path)
        full_text = []
        
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                full_text.append(paragraph.text)
        
        return '\n'.join(full_text)
    
    except Exception as e:
        print(f"오류 발생: {e}")
        return None

def main():
    if len(sys.argv) != 2:
        print("사용법: python extract_docx.py <docx_파일_경로>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    text = extract_docx_text(file_path)
    
    if text:
        print(text)
    else:
        print("텍스트 추출 실패")
        sys.exit(1)

if __name__ == "__main__":
    main()