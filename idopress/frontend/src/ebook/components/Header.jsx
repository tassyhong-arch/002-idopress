import React from 'react';
import styled from 'styled-components';
import { 
  FiList, 
  FiSettings, 
  FiBookmark, 
  FiSearch, 
  FiX,
  FiArrowLeft
} from 'react-icons/fi';
import { useEbook } from '../contexts/EbookContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: ${props => props.isVisible ? '0' : '-60px'};
  left: 0;
  right: 0;
  height: 60px;
  background: ${props => props.theme.menuBackground};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
  transition: top 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0 12px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 16px;
  
  @media (max-width: 768px) {
    margin: 0 8px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${props => props.theme.text};
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const BookTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    max-width: 150px;
  }
`;

const BookAuthor = styled.p`
  font-size: 12px;
  margin: 2px 0 0 0;
  color: ${props => props.theme.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  
  @media (max-width: 768px) {
    font-size: 11px;
    max-width: 150px;
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: ${props => props.theme.accent};
  border-radius: 1px;
`;

export default function Header() {
  const { state, dispatch } = useEbook();
  
  const handleBackClick = () => {
    // 뒤로가기 로직 (라우터 이동 등)
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // 메인 페이지로 이동
      window.location.href = '/';
    }
  };
  
  const handleTocClick = () => {
    dispatch({ type: 'TOGGLE_TOC' });
  };
  
  const handleSettingsClick = () => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  };
  
  const handleBookmarkClick = () => {
    // 현재 위치를 북마크에 추가
    if (state.currentLocation) {
      const bookmark = {
        id: Date.now(),
        cfi: state.currentLocation,
        chapter: state.currentChapter,
        timestamp: new Date().toISOString(),
        preview: '북마크된 위치' // 실제로는 주변 텍스트 추출
      };
      dispatch({ type: 'ADD_BOOKMARK', payload: bookmark });
    }
  };
  
  const handleAnnotationsClick = () => {
    dispatch({ type: 'TOGGLE_ANNOTATIONS' });
  };
  
  const handleSearchClick = () => {
    // 검색 기능 (추후 구현)
    console.log('Search clicked');
  };
  
  return (
    <HeaderContainer isVisible={state.isMenuVisible}>
      <LeftSection>
        <IconButton onClick={handleBackClick} title="뒤로가기">
          <FiArrowLeft />
        </IconButton>
        
        <IconButton 
          onClick={handleTocClick} 
          title="목차"
          style={{ position: 'relative' }}
        >
          <FiList />
          {state.isTocVisible && <ActiveIndicator />}
        </IconButton>
      </LeftSection>
      
      <CenterSection>
        <BookTitle>
          {state.bookTitle || '이북 뷰어'}
        </BookTitle>
        {state.bookAuthor && (
          <BookAuthor>
            {state.bookAuthor}
          </BookAuthor>
        )}
      </CenterSection>
      
      <RightSection>
        <IconButton onClick={handleSearchClick} title="검색">
          <FiSearch />
        </IconButton>
        
        <IconButton onClick={handleBookmarkClick} title="북마크 추가">
          <FiBookmark />
        </IconButton>
        
        <IconButton 
          onClick={handleAnnotationsClick} 
          title="메모 및 형광펜"
          style={{ position: 'relative' }}
        >
          <FiBookmark />
          {state.isAnnotationsVisible && <ActiveIndicator />}
        </IconButton>
        
        <IconButton 
          onClick={handleSettingsClick} 
          title="설정"
          style={{ position: 'relative' }}
        >
          <FiSettings />
          {state.isSettingsVisible && <ActiveIndicator />}
        </IconButton>
        
        <IconButton 
          onClick={() => dispatch({ type: 'TOGGLE_MENU' })} 
          title="닫기"
        >
          <FiX />
        </IconButton>
      </RightSection>
    </HeaderContainer>
  );
}