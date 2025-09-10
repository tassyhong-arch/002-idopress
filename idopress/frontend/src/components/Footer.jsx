import React from 'react';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-ink-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-korean-yellow" />
              <div>
                <h3 className="text-xl font-bold font-serif-kr">이도출판</h3>
                <p className="text-sm text-gray-400">디지털 장서각</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              한국 고전 문학의 현대적 계승과 세계화를 목표로 하는 
              디지털 출판 플랫폼입니다.
            </p>
          </div>

          {/* 서비스 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/books" className="text-gray-300 hover:text-korean-yellow transition-colors">
                  디지털 장서각
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-korean-yellow transition-colors">
                  한국 고전 아카이브
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-korean-yellow transition-colors">
                  현대적 해설
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-korean-yellow transition-colors">
                  독서 커뮤니티
                </a>
              </li>
            </ul>
          </div>

          {/* 도움말 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">도움말</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-korean-yellow transition-colors">
                  이용안내
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-korean-yellow transition-colors">
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-korean-yellow transition-colors">
                  개인정보보호정책
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-korean-yellow transition-colors">
                  이용약관
                </a>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">연락처</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-korean-yellow" />
                <span className="text-gray-300">info@idopress.kr</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-korean-yellow" />
                <span className="text-gray-300">02-1234-5678</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-korean-yellow mt-0.5" />
                <span className="text-gray-300">
                  서울특별시 종로구<br />
                  한국 고전 문화 거리 123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 이도출판 디지털 장서각. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-korean-yellow transition-colors">
                개인정보보호정책
              </a>
              <a href="#" className="text-gray-400 hover:text-korean-yellow transition-colors">
                이용약관
              </a>
              <a href="#" className="text-gray-400 hover:text-korean-yellow transition-colors">
                사이트맵
              </a>
            </div>
          </div>
        </div>

        {/* 프로젝트 정보 */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            본 프로젝트는 Project Gutenberg의 성공적인 개방형 모델을 참조하여 
            한국 고전 문학의 디지털 아카이브 구축을 목표로 합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;