import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ePub from 'epubjs';
import { useEbook } from '../context/EbookContext';

const ViewerContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  cursor: ${props => props.$isLoading ? 'wait' : 'pointer'};
`;

const ReaderArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  
  /* EPUB.js 스타일 오버라이드 */
  iframe {
    border: none !important;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.background};
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  z-index: 100;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.border};
  border-top: 3px solid ${props => props.theme.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.text}80;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${props => props.theme.text}80;
  padding: 20px;
`;

export function EbookViewer({ epubUrl }) {
  const { state, dispatch } = useEbook();
  const viewerRef = useRef(null);
  const bookRef = useRef(null);
  const renditionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!epubUrl || !viewerRef.current) {
      setError('EPUB 파일을 불러올 수 없습니다.');
      setIsLoading(false);
      return;
    }

    let mounted = true;
    
    const initEbook = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 기존 인스턴스 정리
        if (renditionRef.current) {
          renditionRef.current.destroy();
        }

        // Epub.js 초기화
        const book = ePub(epubUrl);
        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none',
          snap: true
        });

        bookRef.current = book;
        renditionRef.current = rendition;

        // 책 메타데이터 로드
        await book.ready;
        
        if (!mounted) return;

        // 책 정보 설정
        dispatch({
          type: 'SET_BOOK_INFO',
          payload: {
            title: book.packaging.metadata.title || '제목 없음',
            author: book.packaging.metadata.creator || '작가 미상'
          }
        });

        // 목차 로드
        await book.loaded.navigation;
        dispatch({
          type: 'SET_TOC',
          payload: book.navigation.toc
        });

        // 책 표시
        await rendition.display();
        
        if (!mounted) return;

        // 위치 변경 이벤트
        rendition.on('relocated', (location) => {
          if (!mounted) return;
          
          const progress = book.locations.percentageFromCfi(location.start.cfi) * 100;
          dispatch({ type: 'SET_PROGRESS', payload: progress });
          dispatch({ type: 'SET_LOCATION', payload: location.start.cfi });

          // 현재 챕터 정보 업데이트
          const currentSection = book.spine.get(location.start.cfi);
          const currentChapter = book.navigation.get(location.start.href) || 
                                book.navigation.toc.find(item => 
                                  location.start.href.includes(item.href?.split('#')[0] || '')
                                );

          dispatch({
            type: 'SET_CHAPTER_INFO',
            payload: {
              chapter: currentChapter?.label || currentSection?.href || '알 수 없음',
              page: location.start.displayed?.page || 1,
              total: location.start.displayed?.total || 1
            }
          });
        });

        // 텍스트 선택 이벤트
        rendition.on('selected', (cfiRange, contents) => {
          const selectedText = contents.window.getSelection().toString();
          if (selectedText.trim()) {
            console.log('Selected text:', selectedText);
            // 여기에 주석/하이라이트 기능 추가 가능
          }
        });

        // 키보드 이벤트
        rendition.on('keyup', (e) => {
          if (e.key === 'ArrowLeft') rendition.prev();
          if (e.key === 'ArrowRight') rendition.next();
        });

        // 테마 및 스타일 적용
        applyTheme();
        
        setIsLoading(false);

      } catch (err) {
        console.error('EPUB 로딩 에러:', err);
        setError(`EPUB 파일 로딩 실패: ${err.message}`);
        setIsLoading(false);
      }
    };

    initEbook();

    return () => {
      mounted = false;
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
    };
  }, [epubUrl]);

  // 테마 변경 시 적용
  useEffect(() => {
    applyTheme();
  }, [state.theme, state.fontSize, state.lineHeight, state.fontFamily]);

  // 진행률 변경 이벤트 리스너
  useEffect(() => {
    const handleProgressChange = (e) => {
      if (!bookRef.current || !renditionRef.current) return;
      
      const progress = e.detail / 100;
      const cfi = bookRef.current.locations.cfiFromPercentage(progress);
      renditionRef.current.display(cfi);
    };

    const handleTocNavigate = (e) => {
      if (!renditionRef.current) return;
      
      const { href } = e.detail;
      renditionRef.current.display(href);
    };

    window.addEventListener('progressChange', handleProgressChange);
    window.addEventListener('tocNavigate', handleTocNavigate);

    return () => {
      window.removeEventListener('progressChange', handleProgressChange);
      window.removeEventListener('tocNavigate', handleTocNavigate);
    };
  }, []);

  const applyTheme = () => {
    if (!renditionRef.current) return;

    const themes = {
      day: {
        body: {
          'background-color': '#FFFFFF !important',
          'color': '#000000 !important'
        }
      },
      sepia: {
        body: {
          'background-color': '#FBF0D9 !important',
          'color': '#5B4636 !important'
        }
      },
      night: {
        body: {
          'background-color': '#121212 !important',
          'color': '#E0E0E0 !important'
        }
      }
    };

    try {
      renditionRef.current.themes.register('current', themes[state.theme]);
      renditionRef.current.themes.select('current');
      
      // 폰트 설정
      renditionRef.current.themes.fontSize(`${state.fontSize}px`);
      const fontFamily = state.fontFamily === 'serif' 
        ? '"Noto Serif KR", Georgia, serif' 
        : '"Noto Sans KR", Arial, sans-serif';
      renditionRef.current.themes.font(fontFamily);
      
      // 줄간격은 CSS를 통해 적용
      const lineHeightRule = `
        body { line-height: ${state.lineHeight} !important; }
        p { line-height: ${state.lineHeight} !important; }
      `;
      renditionRef.current.themes.register('lineHeight', { body: { 'line-height': `${state.lineHeight} !important` } });
      renditionRef.current.themes.select('lineHeight');
      
    } catch (error) {
      console.warn('테마 적용 중 오류:', error);
    }
  };

  const handleScreenTap = (e) => {
    if (!renditionRef.current || isLoading) return;

    const rect = viewerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.2) {
      // 왼쪽 20% 영역: 이전 페이지
      renditionRef.current.prev();
    } else if (x > width * 0.8) {
      // 오른쪽 20% 영역: 다음 페이지
      renditionRef.current.next();
    } else {
      // 중앙 60% 영역: 메뉴 토글
      dispatch({ type: 'TOGGLE_MENU' });
    }
  };

  if (error) {
    return (
      <ViewerContainer>
        <ErrorMessage>
          <h3>오류 발생</h3>
          <p>{error}</p>
        </ErrorMessage>
      </ViewerContainer>
    );
  }

  return (
    <ViewerContainer $isLoading={isLoading}>
      <LoadingOverlay $show={isLoading}>
        <LoadingSpinner />
        <LoadingText>이북을 불러오는 중...</LoadingText>
      </LoadingOverlay>
      
      <ReaderArea 
        ref={viewerRef} 
        onClick={handleScreenTap}
      />
    </ViewerContainer>
  );
}