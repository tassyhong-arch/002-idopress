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
          className={`px-3 py-2 text-sm rounded-md ${
            i === pagination.current_page
              ? 'bg-korean-blue text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {pagination.current_page > 1 && (
          <button
            onClick={() => handleFilterChange('page', pagination.current_page - 1)}
            className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            이전
          </button>
        )}
        
        {pages}
        
        {pagination.current_page < pagination.pages && (
          <button
            onClick={() => handleFilterChange('page', pagination.current_page + 1)}
            className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            다음
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif-kr">
              디지털 장서각
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              200여권의 한국 고전을 현대적으로 만나보세요
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* 검색바 */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="작품명, 저자명으로 검색하세요..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-korean-blue focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-korean-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>검색</span>
            </button>
          </form>

          {/* 필터 토글 버튼 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-700 hover:text-korean-blue transition-colors mb-4"
          >
            <Filter className="h-5 w-5" />
            <span>상세 필터</span>
          </button>

          {/* 필터 */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">장르</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-korean-blue focus:border-transparent"
                >
                  <option value="">전체 장르</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시대</label>
                <select
                  value={filters.era}
                  onChange={(e) => handleFilterChange('era', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-korean-blue focus:border-transparent"
                >
                  <option value="">전체 시대</option>
                  {eras.map((era) => (
                    <option key={era} value={era}>{era}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          )}

          {/* 검색 결과 정보 */}
          {!loading && (
            <div className="mt-4 text-sm text-gray-600">
              총 <span className="font-semibold text-korean-blue">{pagination.total}권</span>의 고전을 찾았습니다.
            </div>
          )}
        </div>

        {/* 도서 목록 */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-korean-blue"></div>
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="bg-white rounded-lg shadow-sm hover-lift overflow-hidden group"
                >
                  <div className="p-6">
                    {/* 책 제목 및 저자 */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 traditional-text group-hover:text-korean-blue transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                      {book.title_original && (
                        <p className="text-sm text-gray-500 mb-1 font-serif-kr line-clamp-1">
                          {book.title_original}
                        </p>
                      )}
                      <p className="text-sm text-korean-blue font-medium">
                        {book.author}
                      </p>
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs bg-korean-blue bg-opacity-10 text-korean-blue px-2 py-1 rounded">
                        {book.era}
                      </span>
                      <span className="text-xs bg-korean-red bg-opacity-10 text-korean-red px-2 py-1 rounded">
                        {book.genre}
                      </span>
                    </div>

                    {/* 설명 */}
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                      {book.description}
                    </p>

                    {/* 추가 정보 */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{book.view_count}</span>
                        </div>
                        {book.publication_date && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{book.publication_date}</span>
                          </div>
                        )}
                      </div>
                      
                      {book.has_modern_translation && (
                        <span className="bg-korean-yellow bg-opacity-20 text-korean-yellow px-2 py-1 rounded">
                          현대어
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              다른 검색어나 필터를 시도해보세요.
            </p>
            <button
              onClick={clearFilters}
              className="text-korean-blue hover:text-blue-700 font-medium"
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