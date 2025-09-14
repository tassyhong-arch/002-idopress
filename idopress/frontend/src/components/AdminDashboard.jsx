import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://5000-iw0w19imdkc5wjlakkes9-6532622b.e2b.dev/api';

  // API 헤더 설정
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // 대시보드 통계 로드
  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: getHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('통계 로드 실패:', error);
    }
  };

  // 도서 목록 로드
  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books`, {
        headers: getHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books);
      }
    } catch (error) {
      console.error('도서 목록 로드 실패:', error);
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
  const API_BASE_URL = 'https://5000-iw0w19imdkc5wjlakkes9-6532622b.e2b.dev/api';

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

  if (loading) {
    return <div className="text-center py-8">도서 목록을 로딩 중...</div>;
  }

  return (
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
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
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

  const API_BASE_URL = 'https://5000-iw0w19imdkc5wjlakkes9-6532622b.e2b.dev/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

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

      if (response.ok) {
        setMessage('이북이 성공적으로 업로드되었습니다!');
        setFormData({
          title: '', author: '', era: '', genre: '', description: '',
          content: '', content_modern: '', publication_date: ''
        });
        setFile(null);
        onUploadSuccess && onUploadSuccess();
      } else {
        const data = await response.json();
        setMessage(`업로드 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      setMessage('업로드 중 오류가 발생했습니다.');
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
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                placeholder="예: 문학"
              />
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