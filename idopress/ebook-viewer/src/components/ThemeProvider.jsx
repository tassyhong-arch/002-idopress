import React from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';

const themes = {
  day: {
    background: '#FFFFFF',
    text: '#000000',
    menuBackground: 'rgba(255, 255, 255, 0.95)',
    border: '#E0E0E0',
    accent: '#007AFF',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  sepia: {
    background: '#FBF0D9',
    text: '#5B4636',
    menuBackground: 'rgba(251, 240, 217, 0.95)',
    border: '#D4C4A8',
    accent: '#8B4513',
    shadow: 'rgba(91, 70, 54, 0.1)'
  },
  night: {
    background: '#121212',
    text: '#E0E0E0',
    menuBackground: 'rgba(18, 18, 18, 0.95)',
    border: '#333333',
    accent: '#BB86FC',
    shadow: 'rgba(255, 255, 255, 0.1)'
  }
};

const ViewerContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-family: ${props => props.$fontFamily === 'serif' 
    ? '"Noto Serif KR", "Times New Roman", Georgia, serif' 
    : '"Noto Sans KR", Arial, Helvetica, sans-serif'};
  font-size: ${props => props.$fontSize}px;
  line-height: ${props => props.$lineHeight};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
`;

export function ThemedEbookViewer({ children, theme, fontSize, lineHeight, fontFamily }) {
  return (
    <StyledThemeProvider theme={themes[theme]}>
      <ViewerContainer 
        $fontSize={fontSize} 
        $lineHeight={lineHeight} 
        $fontFamily={fontFamily}
      >
        {children}
      </ViewerContainer>
    </StyledThemeProvider>
  );
}