import React, { useState, useEffect, useRef } from 'react';

const ClassicTextViewer = ({ book, onClose }) => {
  const [showModern, setShowModern] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);

  // 스크롤 진행률 계산
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const scrollProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setProgress(Math.max(0, Math.min(100, scrollProgress)));
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // 테마 클래스
  const getThemeClasses = () => {
    switch(theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  // 텍스트를 단락으로 분할
  const formatText = (text) => {
    if (!text) return [];
    return text.split('\n\n').filter(paragraph => paragraph.trim());
  };

  if (!book) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <p>도서 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 ${getThemeClasses()} transition-colors duration-300`}>
      {/* 헤더 */}
      <header className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800' : theme === 'sepia' ? 'bg-amber-100' : 'bg-gray-50'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-blue-700">{book.title}</h1>
              <p className="text-sm text-gray-600">{book.author} • {book.era}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 원문/현대어 토글 */}
              {book.content_modern && (
                <button
                  onClick={() => setShowModern(!showModern)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    showModern 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showModern ? '원문 보기' : '현대어 보기'}
                </button>
              )}
              
              {/* 설정 버튼 */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="설정"
              >
                ⚙️
              </button>
              
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors text-xl font-bold"
                title="닫기"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* 진행률 바 */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              읽기 진행률: {Math.round(progress)}%
            </div>
          </div>
        </div>
      </header>

      {/* 설정 패널 */}
      {showSettings && (
        <div className={`absolute top-20 right-4 z-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border p-4 min-w-64`}>
          <h3 className="font-semibold mb-4">읽기 설정</h3>
          
          {/* 글자 크기 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">글자 크기</label>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span className="text-sm">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>
          
          {/* 줄 간격 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">줄 간격</label>
            <select 
              value={lineHeight} 
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="w-full p-2 border rounded text-black"
            >
              <option value={1.4}>좁게</option>
              <option value={1.6}>보통</option>
              <option value={1.8}>넓게</option>
              <option value={2.0}>매우 넓게</option>
            </select>
          </div>
          
          {/* 테마 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">테마</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTheme('light')}
                className={`p-2 border rounded text-sm ${theme === 'light' ? 'bg-blue-100 border-blue-500' : ''}`}
              >
                밝게
              </button>
              <button 
                onClick={() => setTheme('sepia')}
                className={`p-2 border rounded text-sm ${theme === 'sepia' ? 'bg-blue-100 border-blue-500' : ''}`}
              >
                세피아
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-2 border rounded text-sm ${theme === 'dark' ? 'bg-blue-100 border-blue-500' : ''}`}
              >
                어둡게
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <main 
        ref={contentRef}
        className="h-full overflow-y-auto"
        style={{ paddingTop: '140px' }} // 헤더 높이만큼 패딩
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 도서 정보 */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : theme === 'sepia' ? 'bg-amber-100' : 'bg-gray-50'} rounded-lg p-6 mb-8`}>
            <h2 className="text-2xl font-bold mb-4">{book.title}</h2>
            {book.title_original && (
              <p className="text-lg text-gray-600 mb-2">
                원제: <span className="font-medium">{book.title_original}</span>
              </p>
            )}
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>저자:</strong> {book.author}<br/>
                <strong>시대:</strong> {book.era}<br/>
                <strong>장르:</strong> {book.genre}
              </div>
              <div>
                <strong>출간:</strong> {book.publication_date}<br/>
                <strong>조회수:</strong> {book.view_count?.toLocaleString() || 0}
              </div>
            </div>
            {book.description && (
              <div className="mt-4">
                <strong>작품 소개:</strong>
                <p className="mt-2 text-gray-700">{book.description}</p>
              </div>
            )}
          </div>

          {/* 본문 */}
          <div 
            className="prose max-w-none"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: lineHeight 
            }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-blue-700">
                {showModern ? '현대어 번역' : '원문'}
                {book.content_modern && !showModern && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (현대어 번역 버튼으로 쉬운 한국어로 읽을 수 있습니다)
                  </span>
                )}
              </h3>
            </div>
            
            <div className="leading-relaxed">
              {formatText(showModern ? book.content_modern : book.content).map((paragraph, index) => (
                <p key={index} className="mb-4 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* 텍스트가 없는 경우 */}
            {!book.content && !book.content_modern && (
              <div className="text-center py-12 text-gray-500">
                <p>죄송합니다. 이 작품의 본문이 아직 준비되지 않았습니다.</p>
                <p>곧 추가될 예정이니 조금만 기다려 주세요.</p>
              </div>
            )}
          </div>

          {/* 하단 여백 */}
          <div className="h-20"></div>
        </div>
      </main>
    </div>
  );
};

export default ClassicTextViewer;