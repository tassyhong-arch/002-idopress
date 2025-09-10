import React from 'react';
import styled from 'styled-components';
import { useEbook } from '../contexts/EbookContext';

const ProgressContainer = styled.div`
  position: fixed;
  bottom: ${props => props.isVisible ? '0' : '-60px'};
  left: 0;
  right: 0;
  height: 60px;
  background: ${props => props.theme.menuBackground};
  backdrop-filter: blur(10px);
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
  transition: bottom 0.3s ease;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 0 12px;
    gap: 8px;
  }
`;

const ChapterInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 120px;
  
  @media (max-width: 768px) {
    min-width: 80px;
  }
`;

const ChapterTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const PageInfo = styled.div`
  font-size: 10px;
  color: ${props => props.theme.secondary};
  margin-top: 2px;
  
  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

const ProgressSliderContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
`;

const ProgressSlider = styled.input`
  width: 100%;
  height: 4px;
  background: transparent;
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-track {
    width: 100%;
    height: 4px;
    background: ${props => props.theme.border};
    border-radius: 2px;
  }
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: ${props => props.theme.accent};
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid ${props => props.theme.background};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  &::-webkit-slider-runnable-track {
    height: 4px;
    background: linear-gradient(
      to right, 
      ${props => props.theme.accent} 0%, 
      ${props => props.theme.accent} ${props => props.value}%, 
      ${props => props.theme.border} ${props => props.value}%, 
      ${props => props.theme.border} 100%
    );
    border-radius: 2px;
  }
  
  &::-moz-range-track {
    height: 4px;
    background: ${props => props.theme.border};
    border-radius: 2px;
    border: none;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: ${props => props.theme.accent};
    border-radius: 50%;
    border: 2px solid ${props => props.theme.background};
    cursor: pointer;
  }
  
  &::-moz-range-progress {
    height: 4px;
    background: ${props => props.theme.accent};
    border-radius: 2px;
  }
`;

const ProgressPercentage = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.text};
  min-width: 45px;
  text-align: right;
  
  @media (max-width: 768px) {
    font-size: 11px;
    min-width: 40px;
  }
`;

const ProgressTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  background: ${props => props.theme.menuBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  color: ${props => props.theme.text};
  white-space: nowrap;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease;
  margin-bottom: 8px;
  backdrop-filter: blur(10px);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${props => props.theme.border};
  }
`;

export default function ProgressBar({ onProgressChange }) {
  const { state } = useEbook();
  const [isDragging, setIsDragging] = React.useState(false);
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState(0);
  
  const handleProgressChange = (e) => {
    const progress = parseFloat(e.target.value);
    if (onProgressChange) {
      onProgressChange(progress);
    }
  };
  
  const handleMouseDown = () => {
    setIsDragging(true);
    setTooltipVisible(true);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setTooltipVisible(false), 1000);
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = e.target.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      setTooltipPosition(Math.max(0, Math.min(100, position)));
    }
  };
  
  const formatProgress = (progress) => {
    return `${Math.round(progress || 0)}%`;
  };
  
  const getChapterDisplayName = (chapter) => {
    if (!chapter) return '읽는 중...';
    
    // 긴 제목은 줄임표 처리
    if (chapter.length > 20) {
      return chapter.substring(0, 17) + '...';
    }
    return chapter;
  };
  
  const getPageDisplay = () => {
    if (state.currentPage && state.totalPages) {
      return `${state.currentPage} / ${state.totalPages}`;
    }
    return `${formatProgress(state.progress)}`;
  };
  
  return (
    <ProgressContainer isVisible={state.isMenuVisible}>
      <ChapterInfo>
        <ChapterTitle title={state.currentChapter}>
          {getChapterDisplayName(state.currentChapter)}
        </ChapterTitle>
        <PageInfo>
          {getPageDisplay()}
        </PageInfo>
      </ChapterInfo>
      
      <ProgressSliderContainer>
        <ProgressTooltip 
          visible={tooltipVisible}
          position={tooltipPosition}
        >
          {formatProgress(tooltipPosition)}
        </ProgressTooltip>
        
        <ProgressSlider
          type="range"
          min="0"
          max="100"
          value={state.progress || 0}
          onChange={handleProgressChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setIsDragging(false);
            setTooltipVisible(false);
          }}
          title={`읽기 진행률: ${formatProgress(state.progress)}`}
        />
      </ProgressSliderContainer>
      
      <ProgressPercentage>
        {formatProgress(state.progress)}
      </ProgressPercentage>
    </ProgressContainer>
  );
}