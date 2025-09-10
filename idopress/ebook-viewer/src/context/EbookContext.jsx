import React, { createContext, useContext, useReducer } from 'react';

const EbookContext = createContext();

const initialState = {
  theme: 'day', // day, sepia, night
  fontSize: 16,
  lineHeight: 1.6,
  fontFamily: 'serif',
  toc: [],
  progress: 0,
  currentLocation: null,
  annotations: [],
  isMenuVisible: false,
  currentChapter: '',
  totalPages: 0,
  currentPage: 0,
  isSettingsVisible: false,
  isTocVisible: false,
  bookTitle: '',
  bookAuthor: ''
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
    case 'SET_TOC':
      return { ...state, toc: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_LOCATION':
      return { ...state, currentLocation: action.payload };
    case 'ADD_ANNOTATION':
      return { 
        ...state, 
        annotations: [...state.annotations, { id: Date.now(), ...action.payload }] 
      };
    case 'TOGGLE_MENU':
      return { ...state, isMenuVisible: !state.isMenuVisible };
    case 'SET_MENU_VISIBLE':
      return { ...state, isMenuVisible: action.payload };
    case 'TOGGLE_SETTINGS':
      return { 
        ...state, 
        isSettingsVisible: !state.isSettingsVisible,
        isTocVisible: false
      };
    case 'TOGGLE_TOC':
      return { 
        ...state, 
        isTocVisible: !state.isTocVisible,
        isSettingsVisible: false
      };
    case 'SET_CHAPTER_INFO':
      return {
        ...state,
        currentChapter: action.payload.chapter,
        currentPage: action.payload.page,
        totalPages: action.payload.total
      };
    case 'SET_BOOK_INFO':
      return {
        ...state,
        bookTitle: action.payload.title,
        bookAuthor: action.payload.author
      };
    case 'CLOSE_ALL_PANELS':
      return {
        ...state,
        isSettingsVisible: false,
        isTocVisible: false
      };
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