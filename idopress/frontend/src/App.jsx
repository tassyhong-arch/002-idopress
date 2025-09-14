import React, { useState, useEffect } from 'react';
import ClassicTextViewer from './ebook/components/ClassicTextViewer';
import AdminPanel from './components/AdminPanel';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEbookViewer, setShowEbookViewer] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [eras, setEras] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 동적 카테고리는 useEffect에서 로드됨
  const [categories, setCategories] = useState([
    { id: 'all', name: '전체', count: 0 }
  ]);

  // API 기본 URL
  const API_BASE_URL = 'https://5000-iw0w19imdkc5wjlakkes9-6532622b.e2b.dev/api';

  // 책 목록 로드 (검색 및 필터링 포함)
  const loadBooks = async (searchTerm = '', genre = '', page = 1) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '20'
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (genre && genre !== 'all') {
        params.append('genre', genre);
      }
      
      const response = await fetch(`${API_BASE_URL}/books?${params}`);
      const data = await response.json();
      
      if (searchTerm || genre !== 'all') {
        setSearchResults(data.books || []);
        setIsSearching(true);
      } else {
        setBooks(data.books || []);
        setIsSearching(false);
      }
      
      setTotalBooks(data.total || 0);
      setCurrentPage(data.current_page || 1);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('책 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 장르 목록 로드
  const loadGenres = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/genres`);
      const data = await response.json();
      
      const genreCategories = [
        { id: 'all', name: '전체', count: totalBooks },
        ...data.genres.map(genre => ({
          id: genre,
          name: genre,
          count: 0 // 실제 개수는 별도 API가 필요
        }))
      ];
      
      setCategories(genreCategories);
    } catch (error) {
      console.error('장르 목록 로드 실패:', error);
    }
  };

  // 검색 실행
  const handleSearch = () => {
    if (searchQuery.trim()) {
      loadBooks(searchQuery.trim(), selectedCategory, 1);
    }
  };

  // 카테고리 선택
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    if (categoryId === 'all') {
      setIsSearching(false);
      loadBooks('', '', 1);
    } else {
      loadBooks(searchQuery, categoryId, 1);
    }
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadBooks(searchQuery, selectedCategory, page);
  };

  // 페이지네이션 컴포넌트
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {/* 이전 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        
        {/* 페이지 번호 */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">…</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`px-3 py-2 text-sm border rounded-lg disabled:cursor-not-allowed ${
              page === currentPage
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">…</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* 다음 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    );
  };

  // 엔터키 검색
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setIsSearching(false);
    setSearchResults([]);
    loadBooks('', '', 1);
  };

  // 책 상세 정보 로드 및 뷰어 열기
  const openEbookViewer = async (bookId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
      const data = await response.json();
      setSelectedBook(data.book);
      setShowEbookViewer(true);
    } catch (error) {
      console.error('책 상세 정보 로드 실패:', error);
      alert('이북을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadBooks();
    loadGenres();
  }, []);

  // 총 도서 수 업데이트 시 카테고리도 업데이트
  useEffect(() => {
    if (totalBooks > 0 && categories.length > 0) {
      setCategories(prev => [
        { id: 'all', name: '전체', count: totalBooks },
        ...prev.slice(1)
      ]);
    }
  }, [totalBooks]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 클래식 헤더 - Project Gutenberg 스타일 */}
      <header className="bg-white border-b-2 border-blue-900 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-serif text-blue-900 mb-2 hover:text-blue-700 transition-colors cursor-pointer">
              이도출판 디지털 장서각
            </h1>
            <p className="text-lg text-gray-600 font-light">
              한국 고전문학의 디지털 아카이브
            </p>
          </div>
          
          {/* 클래식 네비게이션 */}
          <nav className="flex justify-center space-x-8 text-sm">
            <a href="#" className="text-blue-700 hover:text-blue-900 hover:underline transition-all px-3 py-1 rounded">
              홈
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-900 hover:underline transition-all px-3 py-1 rounded">
              도서 검색
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-900 hover:underline transition-all px-3 py-1 rounded">
              분류별 찾기
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-900 hover:underline transition-all px-3 py-1 rounded">
              저자별 찾기
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-900 hover:underline transition-all px-3 py-1 rounded">
              도움말
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-900 hover:underline transition-all px-3 py-1 rounded">
              정보
            </a>
            <button 
              onClick={() => setShowAdminPanel(true)}
              className="text-purple-700 hover:text-purple-900 hover:underline transition-all px-3 py-1 rounded"
            >
              관리자
            </button>
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 검색 섹션 - 현대적 요소 추가 */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-serif text-gray-800 mb-6 text-center">
              한국 고전문학 검색
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="작품명, 저자명, 또는 키워드를 입력하세요..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                  disabled={loading}
                />
                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? '검색중...' : '검색'}
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                총 <span className="font-semibold text-blue-700">{totalBooks.toLocaleString()}권</span>의 고전 작품을 소장하고 있습니다.
                {isSearching && (
                  <div className="mt-2">
                    <span className="text-blue-600">검색결과: {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, totalBooks)}권 표시 중 (via {searchQuery || selectedCategory})</span>
                    <button 
                      onClick={handleClearSearch}
                      className="ml-2 text-gray-500 hover:text-gray-700 underline"
                    >
                      전체보기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif text-gray-800 mb-6">분류별 찾기</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                disabled={loading}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md disabled:opacity-50 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-medium">{category.name}</div>
                <div className="text-sm text-gray-600">{category.count}권</div>
              </button>
            ))}
          </div>
        </section>

        {/* 도서 목록 섹션 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-gray-800">
              {isSearching 
                ? `검색결과 (${searchQuery || selectedCategory})` 
                : '추천 고전 작품'
              }
            </h2>
            {isSearching && (
              <button 
                onClick={handleClearSearch}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                전체 도서 보기
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">도서를 불러오는 중...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(isSearching ? searchResults : books).map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-200 hover:border-blue-400">
                  <h3 className="text-xl font-serif text-blue-900 mb-2 hover:text-blue-700 cursor-pointer">
                    {book.title}
                  </h3>
                  <div className="text-gray-600 mb-2">
                    <div>저자: {book.author}</div>
                    {book.era && <div>시대: {book.era}</div>}
                    {book.genre && <div>장르: {book.genre}</div>}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      조회수: {book.view_count?.toLocaleString() || 0}
                    </span>
                    <button 
                      onClick={() => openEbookViewer(book.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      disabled={loading}
                    >
                      {loading ? '로딩...' : '읽기 →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {(isSearching ? searchResults : books).length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {isSearching ? '검색 결과가 없습니다.' : '등록된 도서가 없습니다.'}
              </div>
            </div>
          )}
          
          {/* 페이지네이션 */}
          {(isSearching || totalPages > 1) && (
            <>
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
              
              {/* 페이지 정보 */}
              <div className="text-center text-sm text-gray-600 mt-4">
                {currentPage}페이지 / {totalPages}페이지 전체 ({totalBooks.toLocaleString()}권)
              </div>
            </>
          )}
          
          {/* 전체 도서 보기 버튼 (검색이 아닌 경우에만 표시) */}
          {!isSearching && books.length > 0 && totalPages === 1 && books.length < totalBooks && (
            <div className="text-center mt-8">
              <button 
                onClick={() => handleCategoryChange('all')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
              >
                전체 도서 보기 ({totalBooks}권)
              </button>
            </div>
          )}
        </section>

        {/* 최근 추가된 작품 */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif text-gray-800 mb-6">최근 추가된 작품</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ul className="space-y-3">
              {[
                { title: '운영전', author: '작자 미상', date: '2024.09.08' },
                { title: '장화홍련전', author: '작자 미상', date: '2024.09.07' },
                { title: '배비장전', author: '작자 미상', date: '2024.09.06' },
                { title: '옹고집전', author: '작자 미상', date: '2024.09.05' }
              ].map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-2 rounded transition-colors">
                  <div>
                    <a href="#" className="text-blue-700 hover:text-blue-900 hover:underline font-medium">
                      {item.title}
                    </a>
                    <span className="text-gray-600 ml-2">- {item.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 통계 정보 */}
        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">{totalBooks}</div>
              <div className="text-gray-700">총 보유 작품</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">1,247</div>
              <div className="text-gray-700">월간 독자</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">89,234</div>
              <div className="text-gray-700">총 다운로드</div>
            </div>
          </div>
        </section>
      </main>

      {/* 이북 뷰어 모달 */}
      {showEbookViewer && selectedBook && (
        <ClassicTextViewer 
          book={selectedBook}
          onClose={() => {
            setShowEbookViewer(false);
            setSelectedBook(null);
          }}
        />
      )}

      {/* 관리자 패널 모달 */}
      {showAdminPanel && (
        <AdminPanel 
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">이도출판 디지털 장서각</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                한국 고전문학의 디지털화를 통해 전통 문화의 가치를 현대에 전하는 것이 우리의 사명입니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">이용안내</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">저작권 정책</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">문의하기</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">개인정보처리방침</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">연락처</h3>
              <div className="text-gray-300 text-sm space-y-2">
                <div>이메일: info@idopress.co.kr</div>
                <div>전화: 02-1234-5678</div>
                <div>주소: 서울시 종로구 문화로 123</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            © 2024 이도출판 디지털 장서각. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;