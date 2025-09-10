import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  BookOpen, 
  Type, 
  Sun, 
  Moon,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react';
import { bookService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showModern, setShowModern] = useState(false);
  
  // 읽기 설정
  const [readerSettings, setReaderSettings] = useState({
    fontSize: 18,
    lineHeight: 1.8,
    theme: 'light', // 'light' | 'dark' | 'sepia'
    fontFamily: 'serif' // 'serif' | 'sans'
  });

  useEffect(() => {
    fetchBook();
    // 설정 불러오기
    loadSettings();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBook(id);
      setBook(response.book);
    } catch (error) {
      console.error('Failed to fetch book:', error);
      setError('도서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('readerSettings');
    if (savedSettings) {
      setReaderSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings) => {
    setReaderSettings(newSettings);
    localStorage.setItem('readerSettings', JSON.stringify(newSettings));
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...readerSettings, [key]: value };
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 18,
      lineHeight: 1.8,
      theme: 'light',
      fontFamily: 'serif'
    };
    saveSettings(defaultSettings);
  };

  const getThemeClasses = () => {
    switch (readerSettings.theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const getFontFamilyClass = () => {
    return readerSettings.fontFamily === 'serif' ? 'font-serif-kr' : 'font-korean';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-korean-blue"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">도서를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate(`/books/${id}`)}
          className="bg-korean-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          도서 정보로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      {/* 상단 컨트롤 바 */}
      <div className="sticky top-0 z-10 border-b border-opacity-20 bg-opacity-95 backdrop-blur-sm border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 왼쪽: 뒤로가기 */}
            <button
              onClick={() => navigate(`/books/${id}`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-korean-blue transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>뒤로 가기</span>
            </button>

            {/* 중앙: 도서 제목 */}
            <div className="flex-1 text-center px-4">
              <h1 className="text-lg font-semibold truncate">{book.title}</h1>
              <p className="text-sm text-gray-500">{book.author}</p>
            </div>

            {/* 오른쪽: 설정 */}
            <div className="flex items-center space-x-4">
              {/* 원문/현대어 전환 */}
              {book.content_modern && (
                <button
                  onClick={() => setShowModern(!showModern)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    showModern 
                      ? 'bg-korean-blue text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showModern ? '원문 보기' : '현대어 보기'}
                </button>
              )}
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 설정 패널 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">읽기 설정</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* 글자 크기 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  글자 크기
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateSetting('fontSize', Math.max(12, readerSettings.fontSize - 2))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium min-w-16 text-center">
                    {readerSettings.fontSize}px
                  </span>
                  <button
                    onClick={() => updateSetting('fontSize', Math.min(32, readerSettings.fontSize + 2))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 줄 간격 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  줄 간격
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateSetting('lineHeight', Math.max(1.2, readerSettings.lineHeight - 0.2))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium min-w-16 text-center">
                    {readerSettings.lineHeight.toFixed(1)}
                  </span>
                  <button
                    onClick={() => updateSetting('lineHeight', Math.min(3.0, readerSettings.lineHeight + 0.2))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 폰트 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  글꼴
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting('fontFamily', 'serif')}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      readerSettings.fontFamily === 'serif'
                        ? 'bg-korean-blue text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Type className="h-5 w-5 mb-1" />
                    <div className="text-sm">명조체</div>
                    <div className="text-xs opacity-75">전통적</div>
                  </button>
                  <button
                    onClick={() => updateSetting('fontFamily', 'sans')}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      readerSettings.fontFamily === 'sans'
                        ? 'bg-korean-blue text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Type className="h-5 w-5 mb-1" />
                    <div className="text-sm">고딕체</div>
                    <div className="text-xs opacity-75">현대적</div>
                  </button>
                </div>
              </div>

              {/* 테마 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  테마
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      readerSettings.theme === 'light'
                        ? 'bg-korean-blue text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Sun className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs">밝게</div>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'sepia')}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      readerSettings.theme === 'sepia'
                        ? 'bg-korean-blue text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <BookOpen className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs">세피아</div>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      readerSettings.theme === 'dark'
                        ? 'bg-korean-blue text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Moon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs">어둡게</div>
                  </button>
                </div>
              </div>

              {/* 초기화 */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={resetSettings}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>설정 초기화</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose max-w-none">
          <div 
            className={`${getFontFamilyClass()} transition-all duration-300`}
            style={{
              fontSize: `${readerSettings.fontSize}px`,
              lineHeight: readerSettings.lineHeight
            }}
          >
            {/* 제목 */}
            <div className="text-center mb-12 pb-8 border-b border-gray-200 border-opacity-50">
              <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
              {book.title_original && (
                <p className="text-xl text-opacity-70 mb-2">{book.title_original}</p>
              )}
              <p className="text-lg text-korean-blue">{book.author}</p>
            </div>

            {/* 본문 */}
            <div className="space-y-6">
              {(showModern && book.content_modern ? book.content_modern : book.content)
                .split('\n')
                .filter(line => line.trim())
                .map((paragraph, index) => (
                  <p key={index} className="text-justify leading-relaxed">
                    {paragraph}
                  </p>
                ))
              }
            </div>

            {/* 완독 메시지 */}
            <div className="text-center mt-16 pt-8 border-t border-gray-200 border-opacity-50">
              <div className="bg-gradient-to-r from-korean-blue to-blue-700 text-white rounded-lg p-8 mb-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">완독을 축하합니다!</h2>
                <p className="text-blue-100">
                  '{book.title}'을 끝까지 읽어주셔서 감사합니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate(`/books/${id}`)}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  도서 정보로
                </button>
                <button
                  onClick={() => navigate('/books')}
                  className="bg-korean-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  다른 고전 읽기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookReader;