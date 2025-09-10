import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Globe, Sparkles, ArrowRight, Star } from 'lucide-react';
import { bookService } from '../services/api';

function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalReads: 0
  });

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await bookService.getBooks({ per_page: 6 });
        setFeaturedBooks(response.books || []);
        setStats(prev => ({ ...prev, totalBooks: response.total || 0 }));
      } catch (error) {
        console.error('Failed to fetch featured books:', error);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-korean-blue via-blue-800 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-korean-yellow bg-opacity-20 text-korean-yellow px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              한국 고전 문학의 디지털 르네상스
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif-kr leading-tight">
              이도출판
              <span className="block text-3xl md:text-4xl text-korean-yellow mt-2">
                디지털 장서각
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              시대를 넘나드는 한국의 지혜와 만나보세요.<br />
              200여권의 고전 작품을 현대적으로 재해석한 특별한 공간입니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/books"
                className="bg-korean-yellow text-korean-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>장서각 탐험하기</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-korean-blue transition-all"
              >
                무료로 시작하기
              </Link>
            </div>
          </div>
        </div>
        
        {/* 장식적 요소 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 text-gray-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-sm hover-lift">
              <div className="w-16 h-16 bg-korean-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-korean-blue" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalBooks}+</h3>
              <p className="text-gray-600">한국 고전 작품</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover-lift">
              <div className="w-16 h-16 bg-korean-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-korean-red" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1,000+</h3>
              <p className="text-gray-600">독서 애호가</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover-lift">
              <div className="w-16 h-16 bg-korean-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-korean-green" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">전 세계</h3>
              <p className="text-gray-600">한국문화 확산</p>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif-kr">
              왜 이도출판 디지털 장서각인가요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Project Gutenberg의 성공적인 모델을 한국 고전에 적용하여 
              누구나 쉽게 접근할 수 있는 지식의 보고를 만들었습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-korean-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-korean-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-4">무료 접근</h3>
              <p className="text-gray-600 leading-relaxed">
                모든 고전 작품을 무료로 읽을 수 있습니다. 
                지식에 대한 평등한 접근을 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-korean-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-korean-red" />
              </div>
              <h3 className="text-xl font-semibold mb-4">현대적 해석</h3>
              <p className="text-gray-600 leading-relaxed">
                고전 원문과 함께 현대적 해설과 번역을 제공하여 
                이해를 돕습니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-korean-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-korean-green" />
              </div>
              <h3 className="text-xl font-semibold mb-4">커뮤니티</h3>
              <p className="text-gray-600 leading-relaxed">
                독서 토론과 2차 창작을 통해 
                고전을 새롭게 해석하는 공간입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 추천 도서 섹션 */}
      {featuredBooks.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif-kr">
                오늘의 추천 고전
              </h2>
              <p className="text-xl text-gray-600">
                시대를 초월한 지혜와 만나보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredBooks.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="bg-white rounded-xl shadow-sm hover-lift overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 traditional-text">
                          {book.title}
                        </h3>
                        {book.title_original && (
                          <p className="text-sm text-gray-500 mb-1 font-serif-kr">
                            {book.title_original}
                          </p>
                        )}
                        <p className="text-sm text-korean-blue font-medium">
                          {book.author}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="bg-korean-blue bg-opacity-10 text-korean-blue px-2 py-1 rounded">
                        {book.era}
                      </span>
                      <span className="bg-korean-red bg-opacity-10 text-korean-red px-2 py-1 rounded">
                        {book.genre}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        조회 {book.view_count}회
                      </span>
                      {book.has_modern_translation && (
                        <span className="text-xs bg-korean-yellow bg-opacity-20 text-korean-yellow px-2 py-1 rounded">
                          현대어 번역 포함
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/books"
                className="inline-flex items-center bg-korean-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors space-x-2"
              >
                <span>더 많은 고전 보기</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA 섹션 */}
      <section className="py-20 bg-korean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 font-serif-kr">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            한국 고전의 깊이 있는 세계로 떠나는 여행을 시작해보세요. 
            회원가입은 무료이며, 모든 콘텐츠에 제한 없이 접근할 수 있습니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-korean-yellow text-korean-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
            >
              무료 회원가입
            </Link>
            
            <Link
              to="/books"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-korean-blue transition-all"
            >
              둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;