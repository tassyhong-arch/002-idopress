import React from 'react';
import styled from 'styled-components';
import { useEbook } from '../context/EbookContext';

const ProgressContainer = styled.div`
  position: fixed;
  bottom: ${props => props.$isVisible ? '0' : '-80px'};
  left: 0;
  right: 0;
  height: 80px;
  background: ${props => props.theme.menuBackground};
  backdrop-filter: blur(10px);
  border-top: 1px solid ${props => props.theme.border};
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: bottom 0.3s ease;
  z-index: 1000;
  box-shadow: 0 -2px 10px ${props => props.theme.shadow};
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${props => props.theme.text}CC;
`;

const ChapterTitle = styled.span`
  flex: 1;
  text-align: center;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 10px;
`;

const PageInfo = styled.span`
  font-size: 11px;
  min-width: 80px;
  text-align: right;
`;

const ProgressSliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProgressSlider = styled.input`
  flex: 1;
  height: 6px;
  background: ${props => props.theme.border};
  border-radius: 3px;
  outline: none;
  appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    background: ${props => props.theme.accent};
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
  
  &::-webkit-slider-track {
    height: 6px;
    background: ${props => props.theme.border};
    border-radius: 3px;
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: ${props => props.theme.accent};
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-track {
    height: 6px;
    background: ${props => props.theme.border};
    border-radius: 3px;
    border: none;
  }
`;

const ProgressPercent = styled.span`
  font-size: 11px;
  min-width: 35px;
  text-align: right;
  color: ${props => props.theme.accent};
  font-weight: 600;
`;

export function ProgressBar() {
  const { state, dispatch } = useEbook();

  const handleProgressChange = (e) => {
    const progress = parseFloat(e.target.value);
    dispatch({ type: 'SET_PROGRESS', payload: progress });
    
    // 실제 EPUB.js 위치 이동은 부모 컴포넌트에서 처리
    // 여기서는 이벤트를 발생시켜서 부모에게 알림
    const event = new CustomEvent('progressChange', { detail: progress });
    window.dispatchEvent(event);
  };

  return (
    <ProgressContainer $isVisible={state.isMenuVisible}>
      <ProgressInfo>
        <span>{Math.round(state.progress || 0)}%</span>
        <ChapterTitle>{state.currentChapter || '목차를 불러오는 중...'}</ChapterTitle>
        <PageInfo>
          {state.currentPage > 0 ? `${state.currentPage} / ${state.totalPages}` : '- / -'}
        </PageInfo>
      </ProgressInfo>
      
      <ProgressSliderContainer>
        <ProgressSlider
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={state.progress || 0}
          onChange={handleProgressChange}
        />
        <ProgressPercent>{Math.round(state.progress || 0)}%</ProgressPercent>
      </ProgressSliderContainer>
    </ProgressContainer>
  );
}