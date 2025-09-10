import React, { useEffect, useRef, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ePub from 'epubjs';
import { useEbook } from '../contexts/EbookContext';
import { themes, getEpubThemeStyles } from '../utils/themes';
import Header from './Header';
import ProgressBar from './ProgressBar';
import SettingsPanel from './SettingsPanel';
import TocPanel from './TocPanel';
import AnnotationsPanel from './AnnotationsPanel';

const ViewerContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const ReaderArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  
  #epub-viewer {
    width: 100%;
    height: 100%;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${props => props.theme.border};
    border-top-color: ${props => props.theme.accent};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${props => props.theme.text};
  background: ${props => props.theme.menuBackground};
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  backdrop-filter: blur(10px);
`;

export default function EbookViewer({ epubUrl, bookData }) {
  const { state, dispatch } = useEbook();
  const viewerRef = useRef(null);
  const bookRef = useRef(null);
  const renditionRef = useRef(null);
  
  // Epub.js 초기화
  useEffect(() => {
    if (!epubUrl || !viewerRef.current) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    const initializeEbook = async () => {
      try {
        // 기존 인스턴스 정리
        if (renditionRef.current) {
          renditionRef.current.destroy();
        }
        
        // 새 Book 인스턴스 생성
        const book = ePub(epubUrl);
        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none',
          allowScriptedContent: true
        });
        
        bookRef.current = book;
        renditionRef.current = rendition;
        
        // 메타데이터 로드
        await book.ready;
        
        // 도서 정보 설정
        dispatch({
          type: 'SET_BOOK_INFO',
          payload: {
            title: book.packaging.metadata.title || bookData?.title || '제목 없음',
            author: book.packaging.metadata.creator || bookData?.author || '작자 미상'
          }
        });
        
        // 목차 로드
        await book.loaded.navigation;
        dispatch({
          type: 'SET_TOC',
          payload: book.navigation.toc
        });
        
        // 위치 시스템 준비
        await book.ready;
        
        // 첫 페이지 표시
        await rendition.display();
        
        // 테마 적용
        applyTheme();
        
        // 이벤트 리스너 등록
        setupEventListeners(book, rendition);
        
        dispatch({ type: 'SET_LOADING', payload: false });
        
      } catch (error) {
        console.error('Ebook loading error:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: '이북을 불러오는 중 오류가 발생했습니다.' 
        });
      }
    };
    
    initializeEbook();
    
    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
    };
  }, [epubUrl, bookData]);
  
  // 이벤트 리스너 설정
  const setupEventListeners = useCallback((book, rendition) => {
    // 위치 변경 이벤트
    rendition.on('relocated', (location) => {
      const progress = book.locations.percentageFromCfi(location.start.cfi) || 0;
      dispatch({ type: 'SET_PROGRESS', payload: progress });
      dispatch({ type: 'SET_LOCATION', payload: location.start.cfi });
      
      // 현재 챕터 정보 업데이트
      const currentSection = book.spine.get(location.start.cfi);
      const navItem = book.navigation.get(location.start.cfi);
      
      dispatch({
        type: 'SET_CHAPTER_INFO',
        payload: {
          chapter: navItem?.label || currentSection?.href || '',
          page: location.start.displayed?.page || 1,
          total: location.start.displayed?.total || 1
        }
      });
    });
    
    // 텍스트 선택 이벤트
    rendition.on('selected', (cfiRange, contents) => {
      const selectedText = contents.window.getSelection().toString();
      if (selectedText.trim()) {
        handleTextSelection(cfiRange, selectedText);
      }
    });
    
    // 키보드 이벤트
    rendition.on('keyup', (e) => {
      if (e.key === 'ArrowLeft') {
        rendition.prev();
      } else if (e.key === 'ArrowRight') {
        rendition.next();
      }
    });
    
  }, [dispatch]);
  
  // 텍스트 선택 처리
  const handleTextSelection = useCallback((cfiRange, selectedText) => {
    // 주석 추가 모달 등 구현 예정
    console.log('Text selected:', selectedText, 'CFI:', cfiRange);
  }, []);
  
  // 테마 적용
  const applyTheme = useCallback(() => {
    if (!renditionRef.current) return;
    
    const themeStyles = getEpubThemeStyles(
      state.theme,
      state.fontSize,
      state.lineHeight,
      state.fontFamily
    );
    
    // 기존 테마 제거
    renditionRef.current.themes.clear();
    
    // 새 테마 등록 및 적용
    renditionRef.current.themes.register('current-theme', themeStyles);
    renditionRef.current.themes.select('current-theme');
    
  }, [state.theme, state.fontSize, state.lineHeight, state.fontFamily]);
  
  // 테마 변경 감지
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);
  
  // 화면 탭 처리
  const handleScreenTap = useCallback((e) => {
    if (!viewerRef.current || !renditionRef.current) return;
    
    const rect = viewerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // 좌우 30% 영역은 페이지 넘김, 중앙 40%는 메뉴 토글
    if (x < width * 0.3) {
      // 이전 페이지
      renditionRef.current.prev();
    } else if (x > width * 0.7) {
      // 다음 페이지
      renditionRef.current.next();
    } else {
      // 메뉴 토글
      dispatch({ type: 'TOGGLE_MENU' });
    }
  }, [dispatch]);
  
  // 진행률로 이동
  const handleProgressChange = useCallback((progress) => {
    if (!bookRef.current || !renditionRef.current) return;
    
    const cfi = bookRef.current.locations.cfiFromPercentage(progress / 100);
    if (cfi) {
      renditionRef.current.display(cfi);
    }
  }, []);
  
  // 특정 CFI로 이동
  const navigateToCfi = useCallback((cfi) => {
    if (renditionRef.current) {
      renditionRef.current.display(cfi);
    }
  }, []);
  
  if (state.error) {
    return (
      <ThemeProvider theme={themes[state.theme]}>
        <ViewerContainer>
          <ErrorMessage>
            <h3>오류 발생</h3>
            <p>{state.error}</p>
            <button onClick={() => dispatch({ type: 'CLEAR_ERROR' })}>
              다시 시도
            </button>
          </ErrorMessage>
        </ViewerContainer>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={themes[state.theme]}>
      <ViewerContainer>
        {state.isLoading && (
          <LoadingOverlay>
            <div className="spinner"></div>
          </LoadingOverlay>
        )}
        
        <Header />
        
        <ReaderArea 
          ref={viewerRef}
          onClick={handleScreenTap}
          id="epub-viewer"
        />
        
        <ProgressBar 
          onProgressChange={handleProgressChange}
        />
        
        <SettingsPanel />
        
        <TocPanel 
          onNavigate={navigateToCfi}
        />
        
        <AnnotationsPanel />
      </ViewerContainer>
    </ThemeProvider>
  );
}