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
      {/* 히어로 섹션 - 한국 전통 미학 */}
      <section className="relative overflow-hidden">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        
        {/* 한국 전통 패턴 오버레이 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-amber-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-red-400/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-5xl mx-auto">
            {/* 상단 배지 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-red-500/20 backdrop-blur-sm border border-amber-400/30 text-amber-200 px-6 py-3 rounded-full text-sm font-medium shadow-lg">
                <Sparkles className="h-4 w-4 mr-2" strokeWidth={1.5} />
                한국 고전 문학의 디지털 르네상스
              </div>
            </div>
            
            {/* 메인 타이틀 */}
            <div className="text-center mb-12">
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-slate-200 bg-clip-text text-transparent">
                  이도출판
                </span>
                <br />
                <span className="text-4xl lg:text-5xl bg-gradient-to-r from-amber-400 via-red-400 to-orange-400 bg-clip-text text-transparent font-medium tracking-wide">
                  디지털 장서각
                </span>
              </h1>
              
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-red-500 mx-auto mb-8 rounded-full"></div>
              
              <p className="text-xl lg:text-2xl text-slate-200 leading-relaxed max-w-4xl mx-auto mb-12">
                시대를 넘나드는 <span className="text-amber-300 font-medium">한국의 지혜</span>와 만나보세요.<br />
                <span className="text-blue-200">200여 권의 고전 작품</span>을 현대적으로 재해석한 특별한 공간입니다.
              </p>
            </div>

            {/* CTA 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/books"
                className="group relative px-10 py-4 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-semibold text-lg rounded-xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <BookOpen className="h-6 w-6" strokeWidth={1.5} />
                <span>장서각 탐험하기</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Link>
              
              <Link
                to="/register"
                className="px-10 py-4 border-2 border-slate-300/30 backdrop-blur-sm text-slate-200 hover:text-white hover:bg-white/10 font-semibold text-lg rounded-xl transition-all duration-300 hover:border-slate-200/50"
              >
                무료로 시작하기
              </Link>
            </div>

            {/* 소셜 프루프 */}
            <div className="text-center mt-16">
              <p className="text-slate-400 text-sm mb-4">이미 많은 분들이 함께하고 있습니다</p>
              <div className="flex flex-wrap justify-center gap-8 text-slate-300">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" strokeWidth={1.5} />
                  <span className="text-sm">200+ 고전 작품</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" strokeWidth={1.5} />
                  <span className="text-sm">1,000+ 독서 애호가</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" strokeWidth={1.5} />
                  <span className="text-sm">전 세계 접근</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 웨이브 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 text-slate-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>
      </section>

      {/* 통계 섹션 - 세련된 카드 디자인 */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                  <BookOpen className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-br from-slate-700 to-blue-700 bg-clip-text text-transparent mb-3">
                  {stats.totalBooks}+
                </h3>
                <p className="text-slate-600 font-medium">한국 고전 작품</p>
                <p className="text-sm text-slate-500 mt-1">디지털화된 귀중한 유산</p>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 transition-shadow">
                  <Users className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-br from-slate-700 to-red-700 bg-clip-text text-transparent mb-3">
                  1,000+
                </h3>
                <p className="text-slate-600 font-medium">독서 애호가</p>
                <p className="text-sm text-slate-500 mt-1">지식을 사랑하는 커뮤니티</p>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                  <Globe className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-br from-slate-700 to-emerald-700 bg-clip-text text-transparent mb-3">
                  전 세계
                </h3>
                <p className="text-slate-600 font-medium">한국문화 확산</p>
                <p className="text-sm text-slate-500 mt-1">경계를 넘는 지혜의 전파</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 - 현대적 그리드 레이아웃 */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
              왜 이도출판 디지털 장서각인가요?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Project Gutenberg의 성공적인 모델을 한국 고전에 적용하여<br />
              <span className="text-blue-700 font-medium">누구나 쉽게 접근할 수 있는 지식의 보고</span>를 만들었습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-blue-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow group-hover:scale-110 transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">무료 접근</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  모든 고전 작품을 <span className="text-blue-700 font-medium">무료로</span> 읽을 수 있습니다.<br />
                  지식에 대한 평등한 접근을 제공합니다.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-red-50 to-orange-50/50 p-8 rounded-2xl border border-red-100 hover:border-red-200 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-red-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 transition-shadow group-hover:scale-110 transform duration-300">
                  <Star className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">현대적 해석</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  고전 원문과 함께 <span className="text-red-700 font-medium">현대적 해설과 번역</span>을 제공하여<br />
                  이해를 돕습니다.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50/50 p-8 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-emerald-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow group-hover:scale-110 transform duration-300">
                  <Users className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">커뮤니티</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  <span className="text-emerald-700 font-medium">독서 토론과 2차 창작</span>을 통해<br />
                  고전을 새롭게 해석하는 공간입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 추천 도서 섹션 - 프리미엄 카드 디자인 */}
      {featuredBooks.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
                오늘의 추천 고전
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-red-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 leading-relaxed">
                시대를 초월한 <span className="text-blue-700 font-medium">지혜와 만나보세요</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredBooks.map((book, index) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:rotate-1"
                >
                  {/* 카드 배경 그라디언트 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* 한국 전통 장식 모티프 */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-amber-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                  
                  <div className="relative p-8">
                    {/* 상단 메타 정보 */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-sm">
                          {book.era}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full shadow-sm">
                          {book.genre}
                        </span>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* 도서 제목과 저자 */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
                        {book.title}
                      </h3>
                      {book.title_original && (
                        <p className="text-sm text-slate-500 mb-2 tracking-wider">
                          {book.title_original}
                        </p>
                      )}
                      <p className="text-blue-600 font-semibold tracking-wide">
                        {book.author}
                      </p>
                    </div>

                    {/* 설명 */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-4">
                      {book.description}
                    </p>

                    {/* 하단 메타 정보 */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>조회 {book.view_count}회</span>
                      </div>
                      {book.has_modern_translation && (
                        <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full border border-amber-200/50">
                          현대어 번역 포함
                        </span>
                      )}
                    </div>

                    {/* 호버 효과 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA 버튼 */}
            <div className="text-center">
              <Link
                to="/books"
                className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 space-x-3"
              >
                <span>더 많은 고전 보기</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA 섹션 - 프리미엄 그라디언트 */}
      <section className="relative py-24 overflow-hidden">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        
        {/* 한국 전통 패턴 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-amber-400/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-red-400/30 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-slate-200 bg-clip-text text-transparent">
                지금 바로 시작하세요
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-red-500 mx-auto mb-10 rounded-full"></div>
            
            <p className="text-xl lg:text-2xl text-slate-200 leading-relaxed max-w-3xl mx-auto mb-12">
              한국 고전의 <span className="text-amber-300 font-medium">깊이 있는 세계</span>로 떠나는 여행을 시작해보세요.<br />
              회원가입은 <span className="text-blue-200 font-medium">무료</span>이며, 모든 콘텐츠에 제한 없이 접근할 수 있습니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="group px-10 py-4 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-semibold text-lg rounded-xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                무료 회원가입
              </Link>
              
              <Link
                to="/books"
                className="px-10 py-4 border-2 border-slate-300/30 backdrop-blur-sm text-slate-200 hover:text-white hover:bg-white/10 font-semibold text-lg rounded-xl transition-all duration-300 hover:border-slate-200/50"
              >
                둘러보기
              </Link>
            </div>

            {/* 추가 혜택 정보 */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-300">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center border border-blue-400/20">
                  <BookOpen className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium">200+ 고전 작품 무제한</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-xl flex items-center justify-center border border-emerald-400/20">
                  <Users className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium">활발한 독서 커뮤니티</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-xl flex items-center justify-center border border-red-400/20">
                  <Star className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium">프리미엄 독서 경험</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;