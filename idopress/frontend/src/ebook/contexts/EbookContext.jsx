import React, { createContext, useContext, useReducer } from 'react';

const EbookContext = createContext();

const initialState = {
  // 테마 설정
  theme: 'day', // 'day', 'sepia', 'night'
  
  // 폰트 설정
  fontSize: 16,
  lineHeight: 1.6,
  fontFamily: 'serif', // 'serif', 'sans-serif'
  
  // 독서 진행상태
  progress: 0,
  currentLocation: null,
  currentChapter: '',
  currentPage: 0,
  totalPages: 0,
  
  // 도서 정보
  toc: [],
  bookTitle: '',
  bookAuthor: '',
  
  // UI 상태
  isMenuVisible: false,
  isSettingsVisible: false,
  isTocVisible: false,
  isAnnotationsVisible: false,
  
  // 주석 및 메모
  annotations: [],
  bookmarks: [],
  
  // 뷰어 상태
  isLoading: false,
  error: null
};

function ebookReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
      
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: Math.max(12, Math.min(24, action.payload)) };
      
    case 'SET_LINE_HEIGHT':
      return { ...state, lineHeight: Math.max(1.2, Math.min(2.0, action.payload)) };
      
    case 'SET_FONT_FAMILY':
      return { ...state, fontFamily: action.payload };
      
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
      
    case 'SET_LOCATION':
      return { ...state, currentLocation: action.payload };
      
    case 'SET_TOC':
      return { ...state, toc: action.payload };
      
    case 'SET_BOOK_INFO':
      return { 
        ...state, 
        bookTitle: action.payload.title,
        bookAuthor: action.payload.author 
      };
      
    case 'SET_CHAPTER_INFO':
      return {
        ...state,
        currentChapter: action.payload.chapter,
        currentPage: action.payload.page,
        totalPages: action.payload.total
      };
      
    case 'TOGGLE_MENU':
      return { 
        ...state, 
        isMenuVisible: !state.isMenuVisible,
        // 메뉴가 켜지면 다른 패널들은 모두 닫기
        isSettingsVisible: !state.isMenuVisible ? false : state.isSettingsVisible,
        isTocVisible: !state.isMenuVisible ? false : state.isTocVisible,
        isAnnotationsVisible: !state.isMenuVisible ? false : state.isAnnotationsVisible
      };
      
    case 'TOGGLE_SETTINGS':
      return { 
        ...state, 
        isSettingsVisible: !state.isSettingsVisible,
        isTocVisible: false,
        isAnnotationsVisible: false
      };
      
    case 'TOGGLE_TOC':
      return { 
        ...state, 
        isTocVisible: !state.isTocVisible,
        isSettingsVisible: false,
        isAnnotationsVisible: false
      };
      
    case 'TOGGLE_ANNOTATIONS':
      return { 
        ...state, 
        isAnnotationsVisible: !state.isAnnotationsVisible,
        isSettingsVisible: false,
        isTocVisible: false
      };
      
    case 'ADD_ANNOTATION':
      return {
        ...state,
        annotations: [...state.annotations, action.payload]
      };
      
    case 'REMOVE_ANNOTATION':
      return {
        ...state,
        annotations: state.annotations.filter(ann => ann.id !== action.payload)
      };
      
    case 'ADD_BOOKMARK':
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.payload]
      };
      
    case 'REMOVE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== action.payload)
      };
      
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'CLEAR_ERROR':
      return { ...state, error: null };
      
    default:
      return state;
  }
}

export function EbookProvider({ children }) {
  const [state, dispatch] = useReducer(ebookReducer, initialState);
  
  return (
    <EbookContext.Provider value={{ state, dispatch }}>
      {children}
    </EbookContext.Provider>
  );
}

export function useEbook() {
  const context = useContext(EbookContext);
  if (!context) {
    throw new Error('useEbook must be used within EbookProvider');
  }
  return context;
}

export { EbookContext };