import React from 'react';
import styled from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';
import { useEbook } from '../context/EbookContext';

const TocContainer = styled.div`
  position: fixed;
  top: 70px;
  left: ${props => props.$isVisible ? '0' : '-320px'};
  width: 320px;
  height: calc(100vh - 70px);
  background: ${props => props.theme.menuBackground};
  backdrop-filter: blur(10px);
  border-right: 1px solid ${props => props.theme.border};
  padding: 20px 0;
  transition: left 0.3s ease;
  z-index: 999;
  overflow-y: auto;
  box-shadow: 2px 0 10px ${props => props.theme.shadow};
`;

const TocHeader = styled.div`
  padding: 0 20px 20px 20px;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 20px;
`;

const TocTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.text};
`;

const TocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TocItem = styled.li`
  margin-bottom: 2px;
`;

const TocLink = styled.button`
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: ${props => props.$isActive ? props.theme.accent + '20' : 'transparent'};
  color: ${props => props.$isActive ? props.theme.accent : props.theme.text};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  font-size: 14px;
  line-height: 1.4;
  
  &:hover {
    background: ${props => props.theme.accent}15;
    color: ${props => props.theme.accent};
  }
  
  ${props => props.$level > 0 && `
    padding-left: ${20 + props.$level * 20}px;
    font-size: 13px;
    opacity: 0.8;
  `}
`;

const ChapterNumber = styled.span`
  font-size: 12px;
  opacity: 0.7;
  margin-right: 8px;
  min-width: 30px;
`;

const ChapterTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${props => props.theme.text}80;
  font-size: 14px;
`;

export function TocPanel() {
  const { state, dispatch } = useEbook();

  const handleTocClick = (href, label) => {
    // EPUB.js 네비게이션은 부모 컴포넌트에서 처리
    const event = new CustomEvent('tocNavigate', { 
      detail: { href, label } 
    });
    window.dispatchEvent(event);
    
    // 패널 닫기
    dispatch({ type: 'TOGGLE_TOC' });
  };

  const renderTocItem = (item, index, level = 0) => {
    const isActive = state.currentLocation && 
      state.currentLocation.includes(item.href?.split('#')[1] || '');

    return (
      <TocItem key={`${item.id || item.href || index}-${level}`}>
        <TocLink
          $isActive={isActive}
          $level={level}
          onClick={() => handleTocClick(item.href, item.label)}
        >
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            {level === 0 && (
              <ChapterNumber>
                {String(index + 1).padStart(2, '0')}
              </ChapterNumber>
            )}
            <ChapterTitle>{item.label}</ChapterTitle>
          </div>
          <FiChevronRight size={14} opacity={0.5} />
        </TocLink>
        
        {/* 하위 항목 렌더링 */}
        {item.subitems && item.subitems.length > 0 && (
          <TocList>
            {item.subitems.map((subitem, subIndex) => 
              renderTocItem(subitem, subIndex, level + 1)
            )}
          </TocList>
        )}
      </TocItem>
    );
  };

  return (
    <TocContainer $isVisible={state.isTocVisible}>
      <TocHeader>
        <TocTitle>목차</TocTitle>
      </TocHeader>
      
      {state.toc && state.toc.length > 0 ? (
        <TocList>
          {state.toc.map((item, index) => renderTocItem(item, index))}
        </TocList>
      ) : (
        <EmptyState>
          목차를 불러오는 중입니다...
        </EmptyState>
      )}
    </TocContainer>
  );
}