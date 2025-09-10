import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Eye } from 'lucide-react';
import { bookService } from '../services/api';

function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [eras, setEras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    pages: 0,
    per_page: 20
  });

  // 필터 상태
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || '',
    era: searchParams.get('era') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
    fetchEras();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        per_page: pagination.per_page,
        search: filters.search,
        genre: filters.genre,
        era: filters.era
      };

      // URL 파라미터 업데이트
      const newParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) {
          newParams.set(key, params[key]);
        }
      });
      setSearchParams(newParams);

      const response = await bookService.getBooks(params);
      setBooks(response.books || []);
      setPagination({
        current_page: response.current_page,
        total: response.total,
        pages: response.pages,
        per_page: response.per_page
      });
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await bookService.getGenres();
      setGenres(response.genres || []);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  };

  const fetchEras = async () => {
    try {
      const response = await bookService.getEras();
      setEras(response.eras || []);
    } catch (error) {
      console.error('Failed to fetch eras:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // 필터 변경 시 첫 페이지로
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genre: '',
      era: '',
      page: 1
    });
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, pagination.current_page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(pagination.pages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleFilterChange('page', i)}
          className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
            i === pagination.current_page
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-110'
              : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 hover:shadow-md'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-6 mt-16">
        <div className="flex justify-center items-center space-x-3">
          {pagination.current_page > 1 && (
            <button
              onClick={() => handleFilterChange('page', pagination.current_page - 1)}
              className="flex items-center space-x-2 px-5 py-2.5 text-sm font-medium bg-white/80 backdrop-blur-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>이전</span>
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            {pages}
          </div>
          
          {pagination.current_page < pagination.pages && (
            <button
              onClick={() => handleFilterChange('page', pagination.current_page + 1)}
              className="flex items-center space-x-2 px-5 py-2.5 text-sm font-medium bg-white/80 backdrop-blur-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200 hover:shadow-md"
            >
              <span>다음</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="text-sm text-slate-500">
          <span className="font-medium text-blue-700">{pagination.current_page}</span> 
          <span className="mx-1">of</span> 
          <span className="font-medium">{pagination.pages}</span> 
          <span className="mx-2">•</span>
          총 <span className="font-medium text-blue-700">{pagination.total}</span>권
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* 헤더 - 개선된 디자인 */}
      <div className="relative bg-gradient-to-r from-white via-blue-50/50 to-white border-b border-slate-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4 mr-2" strokeWidth={1.5} />
              한국 고전 문학 아카이브
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
              디지털 장서각
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-8 rounded-full"></div>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              <span className="text-blue-700 font-medium">200여 권의 한국 고전</span>을 현대적으로 만나보세요<br />
              시대를 초월한 지혜가 여러분을 기다립니다
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 및 필터 - 프리미엄 디자인 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-12">
          {/* 검색바 */}
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 z-10 group-focus-within:text-blue-600 transition-colors" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="작품명, 저자명으로 검색하세요..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="relative w-full pl-12 pr-6 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm text-slate-700 placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
            >
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span>검색</span>
            </button>
          </form>

          {/* 필터 토글 버튼 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
              showFilters 
                ? 'bg-blue-50 text-blue-700 border border-blue-200/50' 
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-5 w-5" strokeWidth={1.5} />
            <span>상세 필터</span>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              showFilters ? 'bg-blue-600' : 'bg-slate-300'
            }`}></div>
          </button>

          {/* 필터 - 애니메이션 슬라이드 */}
          {showFilters && (
            <div className="animate-slide-down mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">장르별 분류</label>
                  <div className="relative">
                    <select
                      value={filters.genre}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                      className="w-full appearance-none px-4 py-3 border border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                    >
                      <option value="">전체 장르</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">시대별 분류</label>
                  <div className="relative">
                    <select
                      value={filters.era}
                      onChange={(e) => handleFilterChange('era', e.target.value)}
                      className="w-full appearance-none px-4 py-3 border border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                    >
                      <option value="">전체 시대</option>
                      {eras.map((era) => (
                        <option key={era} value={era}>{era}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>필터 초기화</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 검색 결과 정보 */}
          {!loading && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-slate-600">
                  총 <span className="font-bold text-blue-700 text-lg">{pagination.total}권</span>의 고전을 찾았습니다
                </span>
              </div>
              {(filters.search || filters.genre || filters.era) && (
                <div className="text-sm text-slate-500">
                  필터링 결과
                </div>
              )}
            </div>
          )}
        </div>

        {/* 도서 목록 */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute inset-0"></div>
            </div>
            <p className="mt-6 text-slate-600 font-medium">고전 작품들을 불러오는 중...</p>
            <div className="mt-2 flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200/50 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:rotate-1"
                >
                  {/* 한국 전통 장식 요소 */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-blue-400/10 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-radial from-red-400/10 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
                  
                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
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
                        #{index + 1}
                      </div>
                    </div>

                    {/* 책 제목 및 저자 */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors leading-tight line-clamp-2">
                        {book.title}
                      </h3>
                      {book.title_original && (
                        <p className="text-sm text-slate-500 mb-2 tracking-wider line-clamp-1 font-serif-kr">
                          {book.title_original}
                        </p>
                      )}
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                        <p className="text-blue-600 font-semibold tracking-wide">
                          {book.author}
                        </p>
                      </div>
                    </div>

                    {/* 설명 */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-4">
                      {book.description}
                    </p>

                    {/* 하단 정보 */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1.5">
                          <Eye className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.5} />
                          <span className="font-medium">{book.view_count}</span>
                        </div>
                        {book.publication_date && (
                          <div className="flex items-center space-x-1.5">
                            <Clock className="h-3.5 w-3.5 text-blue-500" strokeWidth={1.5} />
                            <span className="font-medium">{book.publication_date}</span>
                          </div>
                        )}
                      </div>
                      
                      {book.has_modern_translation && (
                        <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full border border-amber-200/50 shadow-sm">
                          현대어 포함
                        </span>
                      )}
                    </div>

                    {/* 읽기 시작 버튼 (호버시 나타남) */}
                    <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-16 bg-gradient-to-t from-white/90 to-transparent transition-all duration-300 rounded-b-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <BookOpen className="h-4 w-4" strokeWidth={1.5} />
                        <span>읽기 시작</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="relative mx-auto mb-8 w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-slate-400" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">검색 결과가 없습니다</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              다른 검색어나 필터 조건을 시도해보세요.<br />
              더 많은 고전 작품들이 여러분을 기다리고 있습니다.
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              모든 필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Books;