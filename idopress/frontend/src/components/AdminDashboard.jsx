import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = `${window.location.origin}/api`;

  // API 헤더 설정
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // 대시보드 통계 로드
  const loadStats = async () => {
    try {
      console.log('대시보드 통계 요청:', `${API_BASE_URL}/admin/dashboard`);
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: getHeaders(),
      });
      
      console.log('대시보드 응답 상태:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('대시보드 데이터:', data);
        setStats(data);
      } else {
        const errorData = await response.json();
        console.error('대시보드 오류:', errorData);
      }
    } catch (error) {
      console.error('통계 로드 실패:', error);
    }
  };

  // 도서 목록 로드
  const loadBooks = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('API 요청 시작:', `${API_BASE_URL}/admin/books`);
      const response = await fetch(`${API_BASE_URL}/admin/books`, {
        headers: getHeaders(),
      });
      
      console.log('API 응답 상태:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('받은 데이터:', data);
        setBooks(data.books);
        if (data.debug_info) {
          console.log('디버그 정보:', data.debug_info);
        }
      } else {
        try {
          const errorData = await response.json();
          console.error('API 오류 응답:', errorData);
          const errorMsg = errorData?.error || errorData?.message || response.statusText || '서버 오류';
          setError(`도서 목록 로드 실패: ${errorMsg}`);
        } catch (parseError) {
          console.error('응답 파싱 오류:', parseError);
          setError(`도서 목록 로드 실패: HTTP ${response.status} - ${response.statusText || '알 수 없는 오류'}`);
        }
      }
    } catch (error) {
      console.error('도서 목록 로드 실패:', error);
      setError(`네트워크 오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    if (activeTab === 'books') {
      loadBooks();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">이도출판 관리자</h1>
              <p className="text-sm text-gray-600">환영합니다, {user.username}님!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 탭 네비게이션 */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: '📊 대시보드' },
              { id: 'books', label: '📚 이북 관리' },
              { id: 'upload', label: '⬆️ 이북 업로드' },
              { id: 'users', label: '👥 사용자 관리' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 탭 내용 */}
        {activeTab === 'dashboard' && (
          <DashboardContent stats={stats} />
        )}
        
        {activeTab === 'books' && (
          <BooksManagement books={books} loading={loading} onRefresh={loadBooks} token={token} />
        )}
        
        {activeTab === 'upload' && (
          <BookUpload token={token} onUploadSuccess={loadBooks} />
        )}
        
        {activeTab === 'users' && (
          <UsersManagement token={token} />
        )}
      </div>
    </div>
  );
};

// 대시보드 컨텐츠 컴포넌트
const DashboardContent = ({ stats }) => {
  if (!stats) {
    return <div className="text-center py-8">통계를 로딩 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">📚</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">총 도서</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.stats.total_books}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">👥</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">총 사용자</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.stats.total_users}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">💬</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">총 리뷰</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.stats.total_reviews}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">🆕</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">최근 7일 추가</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.stats.recent_books}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 도서 관리 컴포넌트
const BooksManagement = ({ books, loading, onRefresh, token }) => {
  const [editingBook, setEditingBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const API_BASE_URL = `${window.location.origin}/api`;

  const togglePublicStatus = async (bookId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_public: !currentStatus }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('도서 상태 변경 실패:', error);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook({
      ...book,
      publication_date: book.publication_date || '',
      era: book.era || '',
      genre: book.genre || '',
      description: book.description || ''
    });
  };

  const handleUpdateBook = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books/${editingBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingBook),
      });

      if (response.ok) {
        setEditingBook(null);
        onRefresh();
        alert('도서 정보가 수정되었습니다.');
      } else {
        alert('도서 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('도서 수정 실패:', error);
      alert('도서 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setShowDeleteModal(null);
        onRefresh();
        alert('도서가 삭제되었습니다.');
      } else {
        alert('도서 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('도서 삭제 실패:', error);
      alert('도서 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">도서 목록을 로딩 중...</div>;
  }

  return (
    <>
      {/* 에러 메시지 표시 */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* 도서가 없을 때 메시지 */}
      {!loading && books.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">등록된 도서가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">
            "⬆️ 이북 업로드" 탭에서 새 도서를 추가해보세요.
          </p>
        </div>
      )}
      
      {books.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">도서 관리</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              등록된 모든 도서를 관리할 수 있습니다.
            </p>
          </div>
          
          <ul className="divide-y divide-gray-200">
        {books.map((book) => (
          <li key={book.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {book.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {book.author} • {book.era} • 조회수: {book.view_count}
                  </p>
                  <p className="text-xs text-gray-400">
                    생성: {new Date(book.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    book.is_public 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.is_public ? '공개' : '비공개'}
                  </span>
                  <button
                    onClick={() => togglePublicStatus(book.id, book.is_public)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    {book.is_public ? '비공개로' : '공개로'}
                  </button>
                  <button
                    onClick={() => handleEditBook(book)}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(book.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
          </ul>
        </div>
      )}

      {/* 도서 수정 모달 */}
      {editingBook && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">도서 수정</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">제목</label>
                    <input
                      type="text"
                      value={editingBook.title}
                      onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">저자</label>
                    <input
                      type="text"
                      value={editingBook.author}
                      onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">시대</label>
                    <input
                      type="text"
                      value={editingBook.era}
                      onChange={(e) => setEditingBook({...editingBook, era: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">장르</label>
                    <select
                      value={editingBook.genre}
                      onChange={(e) => setEditingBook({...editingBook, genre: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                    >
                      <option value="">장르 선택</option>
                      <option value="문학">문학</option>
                      <option value="역사">역사</option>
                      <option value="철학">철학</option>
                      <option value="종교">종교</option>
                      <option value="과학">과학</option>
                      <option value="예술">예술</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">작품 소개</label>
                  <textarea
                    value={editingBook.description}
                    onChange={(e) => setEditingBook({...editingBook, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">출간일</label>
                  <input
                    type="text"
                    value={editingBook.publication_date}
                    onChange={(e) => setEditingBook({...editingBook, publication_date: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                    placeholder="예: 1612년, 18세기"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingBook.is_public}
                    onChange={(e) => setEditingBook({...editingBook, is_public: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">공개 도서</label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdateBook}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  수정 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 도서 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">도서 삭제</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  정말로 이 도서를 삭제하시겠습니까?<br/>
                  삭제된 도서는 복구할 수 없습니다.
                </p>
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDeleteBook(showDeleteModal)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 이북 업로드 컴포넌트
const BookUpload = ({ token, onUploadSuccess }) => {
  const [uploadMethod, setUploadMethod] = useState('text'); // 'text' or 'file'
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    era: '',
    genre: '',
    description: '',
    content: '',
    content_modern: '',
    publication_date: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE_URL = `${window.location.origin}/api`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    // 기본 유효성 검사
    if (!formData.title?.trim()) {
      setMessage('제목을 입력해주세요.');
      setUploading(false);
      return;
    }
    
    if (!formData.author?.trim()) {
      setMessage('저자를 입력해주세요.');
      setUploading(false);
      return;
    }
    
    if (uploadMethod === 'file' && !file) {
      setMessage('파일을 선택해주세요.');
      setUploading(false);
      return;
    }

    console.log('업로드 시작 - 방식:', uploadMethod);
    console.log('폼 데이터:', formData);
    console.log('파일:', file);
    console.log('토큰 존재:', !!token);

    try {
      let response;
      
      if (uploadMethod === 'file') {
        // 파일 업로드
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        Object.keys(formData).forEach(key => {
          if (formData[key]) {
            fileFormData.append(key, formData[key]);
          }
        });

        response = await fetch(`${API_BASE_URL}/admin/books/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: fileFormData,
        });
      } else {
        // 텍스트 입력
        response = await fetch(`${API_BASE_URL}/admin/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      console.log('API 응답 상태:', response.status);
      console.log('API 응답 헤더:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('업로드 성공 데이터:', data);
        setMessage('이북이 성공적으로 업로드되었습니다!');
        setFormData({
          title: '', author: '', era: '', genre: '', description: '',
          content: '', content_modern: '', publication_date: ''
        });
        setFile(null);
        onUploadSuccess && onUploadSuccess();
      } else {
        console.error('API 오류 응답:', response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error('오류 데이터:', errorData);
          const errorMsg = errorData?.error || errorData?.message || errorData?.detail || '서버 응답 오류';
          setMessage(`업로드 실패: ${errorMsg}`);
        } catch (parseError) {
          console.error('응답 파싱 오류:', parseError);
          try {
            const textResponse = await response.text();
            console.error('원시 응답:', textResponse);
            setMessage(`업로드 실패: ${textResponse || `HTTP ${response.status} - ${response.statusText}`}`);
          } catch (textError) {
            console.error('텍스트 응답 파싱 오류:', textError);
            setMessage(`업로드 실패: HTTP ${response.status} - ${response.statusText || '알 수 없는 오류'}`);
          }
        }
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      setMessage(`업로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          새 이북 업로드
        </h3>

        {/* 업로드 방식 선택 */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setUploadMethod('text')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                uploadMethod === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📝 직접 입력
            </button>
            <button
              onClick={() => setUploadMethod('file')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                uploadMethod === 'file'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📁 파일 업로드
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded ${
            message.includes('성공') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 파일 업로드 */}
          {uploadMethod === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                파일 선택
              </label>
              <input
                type="file"
                accept=".txt,.pdf,.epub,.doc,.docx,.rtf"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1 block w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                지원 형식: TXT, PDF, EPUB, DOC, DOCX, RTF
              </p>
            </div>
          )}

          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">제목</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">저자</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">시대</label>
              <input
                type="text"
                value={formData.era}
                onChange={(e) => setFormData({...formData, era: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                placeholder="예: 조선시대"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">장르</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              >
                <option value="">장르 선택</option>
                <option value="문학">문학</option>
                <option value="역사">역사</option>
                <option value="철학">철학</option>
                <option value="종교">종교</option>
                <option value="과학">과학</option>
                <option value="예술">예술</option>
                <option value="정치">정치</option>
                <option value="경제">경제</option>
                <option value="사회">사회</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">작품 소개</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            />
          </div>

          {/* 텍스트 입력 모드일 때만 표시 */}
          {uploadMethod === 'text' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">원문 내용</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  placeholder="고전 원문을 입력하세요..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">현대어 번역</label>
                <textarea
                  value={formData.content_modern}
                  onChange={(e) => setFormData({...formData, content_modern: e.target.value})}
                  rows={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  placeholder="현대어 번역을 입력하세요..."
                />
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              disabled={uploading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {uploading ? '업로드 중...' : '이북 업로드'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 사용자 관리 컴포넌트 (기본)
const UsersManagement = ({ token }) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">사용자 관리</h3>
        <p className="mt-1 text-sm text-gray-500">
          사용자 관리 기능은 추후 구현 예정입니다.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;