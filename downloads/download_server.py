#!/usr/bin/env python3
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

class DownloadHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="/home/user/webapp/downloads", **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            html_content = '''
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>이도출판 FTP 업로드 파일 다운로드</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .download-box { border: 2px solid #4CAF50; border-radius: 10px; padding: 20px; margin: 20px 0; background: #f9f9f9; }
        .btn { background: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
        .btn:hover { background: #45a049; }
        .file-info { background: #e7f4e7; padding: 10px; border-radius: 5px; margin: 10px 0; }
        h1 { color: #2c5282; }
        h2 { color: #4CAF50; }
    </style>
</head>
<body>
    <h1>📦 이도출판 디지털 장서각 - FTP 업로드 파일</h1>
    
    <div class="download-box">
        <h2>🚀 메인 다운로드 (추천)</h2>
        <div class="file-info">
            <strong>파일명:</strong> idopress_complete_ftp_v2.tar.gz<br>
            <strong>크기:</strong> 560KB<br>
            <strong>포함내용:</strong> 프론트엔드 + 백엔드 + 설정파일 + 이북뷰어 (완전 패키지)
            <br><strong>🆕 새 기능:</strong> 한국 고전문학 이북 뷰어, 원문/현대어 번역
        </div>
        <a href="idopress_complete_ftp_v2.tar.gz" class="btn" download>📥 완전 패키지 다운로드 (최신)</a>
        <a href="idopress_complete_ftp.tar.gz" class="btn" style="background: #6b7280;" download>📥 이전 버전 (286KB)</a>
    </div>
    
    <div class="download-box">
        <h2>📚 배포 가이드</h2>
        <div class="file-info">
            <strong>파일명:</strong> FTP_업로드_가이드.md<br>
            <strong>내용:</strong> 단계별 배포 방법, 트러블슈팅 가이드
        </div>
        <a href="FTP_업로드_가이드.md" class="btn" download>📖 배포 가이드 다운로드</a>
    </div>
    
    <div class="download-box">
        <h2>🔧 개별 파일 다운로드</h2>
        <p>필요에 따라 개별 파일을 다운로드할 수 있습니다:</p>
        <a href="../idopress_website_ftp.tar.gz" class="btn" download>🌐 프론트엔드만 (270KB)</a>
        <a href="../idopress_backend_ftp.tar.gz" class="btn" download>⚙️ 백엔드만 (16KB)</a>
    </div>
    
    <div class="download-box">
        <h2>💡 사용 방법</h2>
        <ol>
            <li><strong>idopress_complete_ftp.tar.gz</strong> 파일을 다운로드</li>
            <li><strong>FTP_업로드_가이드.md</strong> 파일을 다운로드하여 가이드 확인</li>
            <li>웹 호스팅에 FTP로 업로드</li>
            <li>가이드를 따라 압축 해제 및 설정</li>
            <li>데이터베이스 설정 후 완료!</li>
        </ol>
    </div>
    
    <div class="download-box">
        <h2>📞 지원</h2>
        <p>배포 중 문제가 발생하면 <strong>FTP_업로드_가이드.md</strong>의 트러블슈팅 섹션을 참고하세요.</p>
    </div>
</body>
</html>
            '''
            self.wfile.write(html_content.encode('utf-8'))
        else:
            super().do_GET()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 9000), DownloadHandler)
    print("다운로드 서버가 포트 9000에서 실행 중입니다...")
    print("http://localhost:9000 에서 파일을 다운로드할 수 있습니다.")
    server.serve_forever()
