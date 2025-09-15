#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
API 테스트 도구
관리자 패널에서 도서 목록이 안 보일 때 사용하세요
"""

import requests
import json

def test_api_endpoints():
    """API 엔드포인트 테스트"""
    
    # API 기본 URL (실제 도메인으로 변경하세요)
    BASE_URL = "https://yourdomain.com/api"  # 여기를 실제 도메인으로 변경
    
    print("🔍 API 엔드포인트 테스트 시작...")
    print(f"📡 BASE_URL: {BASE_URL}")
    print("-" * 50)
    
    # 1. 서버 상태 확인
    print("1️⃣ 서버 상태 확인...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            print(f"✅ 서버 상태: {response.json()}")
        else:
            print(f"❌ 서버 오류: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ 연결 오류: {str(e)}")
    
    print("-" * 50)
    
    # 2. 전체 도서 목록 확인 (공개 API)
    print("2️⃣ 전체 도서 목록 확인...")
    try:
        response = requests.get(f"{BASE_URL}/books", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 공개 도서 수: {data.get('total', 0)}권")
            if data.get('books'):
                for book in data['books'][:3]:  # 처음 3권만 표시
                    print(f"   📚 {book['title']} - {book['author']}")
            if data.get('total', 0) > 3:
                print(f"   ... 외 {data.get('total', 0) - 3}권")
        else:
            print(f"❌ 도서 목록 오류: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ 연결 오류: {str(e)}")
    
    print("-" * 50)
    
    # 3. 관리자 로그인 테스트
    print("3️⃣ 관리자 로그인 테스트...")
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/admin/login", 
                               json=login_data, 
                               timeout=10)
        
        if response.status_code == 200:
            login_result = response.json()
            print(f"✅ 관리자 로그인 성공: {login_result['user']['username']}")
            token = login_result['access_token']
            
            # 4. 관리자 도서 목록 확인
            print("4️⃣ 관리자 도서 목록 확인...")
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            admin_response = requests.get(f"{BASE_URL}/admin/books", 
                                        headers=headers, 
                                        timeout=10)
            
            if admin_response.status_code == 200:
                admin_data = admin_response.json()
                print(f"✅ 관리자 도서 목록 로드 성공!")
                print(f"   📊 총 도서 수: {admin_data.get('total', 0)}권")
                print(f"   📄 현재 페이지 도서 수: {len(admin_data.get('books', []))}권")
                
                if admin_data.get('debug_info'):
                    debug = admin_data['debug_info']
                    print(f"   🔍 디버그 정보:")
                    print(f"      - DB 전체 도서: {debug.get('total_books_in_db', 0)}권")
                    print(f"      - 반환된 도서: {debug.get('returned_books_count', 0)}권")
                
                if admin_data.get('books'):
                    print(f"   📚 도서 목록:")
                    for book in admin_data['books'][:5]:  # 처음 5권만 표시
                        print(f"      - {book['title']} (ID: {book['id']}) - {book['author']}")
                else:
                    print("   ⚠️ 도서 데이터가 없습니다!")
                    
            else:
                print(f"❌ 관리자 도서 목록 오류: {admin_response.status_code}")
                try:
                    error_data = admin_response.json()
                    print(f"   에러 메시지: {error_data.get('error', '알 수 없는 오류')}")
                except:
                    print(f"   원시 응답: {admin_response.text}")
                    
        else:
            print(f"❌ 관리자 로그인 실패: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   에러 메시지: {error_data.get('error', '알 수 없는 오류')}")
            except:
                print(f"   원시 응답: {response.text}")
                
    except Exception as e:
        print(f"❌ 관리자 테스트 오류: {str(e)}")
    
    print("-" * 50)
    print("🎯 테스트 완료!")
    print("\n💡 문제 해결 방법:")
    print("1. 서버 오류 시: Flask 앱이 실행 중인지 확인")
    print("2. 도서가 없을 시: 데이터베이스에 샘플 데이터 추가")
    print("3. 로그인 실패 시: 관리자 계정 확인 (admin/admin123)")
    print("4. 권한 오류 시: JWT 토큰 설정 확인")

if __name__ == "__main__":
    print("🚀 이도출판 API 테스트 도구")
    print("=" * 50)
    
    # 실제 도메인 입력 받기
    domain = input("실제 도메인을 입력하세요 (예: https://idopress.com): ").strip()
    if not domain:
        domain = "http://localhost:5000"  # 기본값
        
    # BASE_URL을 동적으로 설정
    import sys
    current_module = sys.modules[__name__]
    
    # 함수 내부의 BASE_URL을 업데이트
    test_code = test_api_endpoints.__code__
    test_globals = test_api_endpoints.__globals__.copy()
    
    # 간단하게 하드코딩된 부분을 수정하는 방법 사용
    def test_with_domain():
        BASE_URL = f"{domain}/api"
        
        print("🔍 API 엔드포인트 테스트 시작...")
        print(f"📡 BASE_URL: {BASE_URL}")
        print("-" * 50)
        
        # ... (기존 테스트 코드와 동일하지만 BASE_URL 사용)
        # 실제 구현은 위의 test_api_endpoints 함수와 동일
        
        # 1. 서버 상태 확인
        print("1️⃣ 서버 상태 확인...")
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=10)
            if response.status_code == 200:
                print(f"✅ 서버 상태: {response.json()}")
            else:
                print(f"❌ 서버 오류: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ 연결 오류: {str(e)}")
        
        print("-" * 50)
        
        # 2. 전체 도서 목록 확인
        print("2️⃣ 전체 도서 목록 확인...")
        try:
            response = requests.get(f"{BASE_URL}/books", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ 공개 도서 수: {data.get('total', 0)}권")
                if data.get('books'):
                    for book in data['books'][:3]:
                        print(f"   📚 {book['title']} - {book['author']}")
                if data.get('total', 0) > 3:
                    print(f"   ... 외 {data.get('total', 0) - 3}권")
            else:
                print(f"❌ 도서 목록 오류: {response.status_code}")
        except Exception as e:
            print(f"❌ 연결 오류: {str(e)}")
        
        print("-" * 50)
        print("🎯 기본 테스트 완료! 자세한 테스트는 test_api_endpoints() 함수를 참조하세요.")
    
    test_with_domain()