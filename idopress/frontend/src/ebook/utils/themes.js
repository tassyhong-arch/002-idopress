// 교보문고 스타일 테마 정의
export const themes = {
  day: {
    background: '#FFFFFF',
    text: '#000000',
    menuBackground: 'rgba(255, 255, 255, 0.95)',
    border: '#E0E0E0',
    accent: '#007AFF',
    secondary: '#6C7B7F',
    shadow: 'rgba(0, 0, 0, 0.1)',
    highlight: 'rgba(255, 215, 0, 0.3)', // 형광펜 색상
    selection: 'rgba(0, 122, 255, 0.2)'
  },
  sepia: {
    background: '#FBF0D9',
    text: '#5B4636',
    menuBackground: 'rgba(251, 240, 217, 0.95)',
    border: '#D4C4A8',
    accent: '#8B4513',
    secondary: '#8B7355',
    shadow: 'rgba(139, 69, 19, 0.1)',
    highlight: 'rgba(255, 193, 7, 0.3)',
    selection: 'rgba(139, 69, 19, 0.2)'
  },
  night: {
    background: '#121212',
    text: '#E0E0E0',
    menuBackground: 'rgba(18, 18, 18, 0.95)',
    border: '#333333',
    accent: '#BB86FC',
    secondary: '#9E9E9E',
    shadow: 'rgba(255, 255, 255, 0.1)',
    highlight: 'rgba(187, 134, 252, 0.3)',
    selection: 'rgba(187, 134, 252, 0.2)'
  }
};

// Epub.js용 CSS 스타일 생성
export function getEpubThemeStyles(theme, fontSize, lineHeight, fontFamily) {
  const currentTheme = themes[theme];
  
  const fontFamilyStyle = fontFamily === 'serif' 
    ? "'Noto Serif KR', 'Times New Roman', serif" 
    : "'Noto Sans KR', Arial, sans-serif";
  
  return {
    body: {
      'background-color': `${currentTheme.background} !important`,
      'color': `${currentTheme.text} !important`,
      'font-family': `${fontFamilyStyle} !important`,
      'font-size': `${fontSize}px !important`,
      'line-height': `${lineHeight} !important`,
      'margin': '20px !important',
      'padding': '0 !important'
    },
    p: {
      'margin': '0 0 1em 0 !important',
      'text-align': 'justify !important'
    },
    h1: {
      'color': `${currentTheme.text} !important`,
      'font-family': `${fontFamilyStyle} !important`,
      'margin': '1.5em 0 1em 0 !important'
    },
    h2: {
      'color': `${currentTheme.text} !important`,
      'font-family': `${fontFamilyStyle} !important`,
      'margin': '1.3em 0 0.8em 0 !important'
    },
    h3: {
      'color': `${currentTheme.text} !important`,
      'font-family': `${fontFamilyStyle} !important`,
      'margin': '1.2em 0 0.6em 0 !important'
    },
    a: {
      'color': `${currentTheme.accent} !important`
    },
    '::selection': {
      'background': `${currentTheme.selection} !important`
    }
  };
}

// 애니메이션 설정
export const animations = {
  menuSlide: {
    duration: '0.3s',
    easing: 'ease-in-out'
  },
  fadeInOut: {
    duration: '0.2s',
    easing: 'ease'
  },
  panelSlide: {
    duration: '0.4s',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
};

// 반응형 브레이크포인트
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px'
};