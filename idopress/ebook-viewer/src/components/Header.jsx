import React from 'react';
import styled from 'styled-components';
import { FiList, FiSettings, FiBookmark, FiSearch, FiX } from 'react-icons/fi';
import { useEbook } from '../context/EbookContext';

const HeaderContainer = styled.div`
  position: fixed;
  top: ${props => props.$isVisible ? '0' : '-70px'};
  left: 0;
  right: 0;
  height: 70px;
  background: ${props => props.theme.menuBackground};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  transition: top 0.3s ease;
  z-index: 1000;
  box-shadow: 0 2px 10px ${props => props.theme.shadow};
`;

const HeaderTitle = styled.div`
  flex: 1;
  text-align: center;
`;

const BookTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const BookAuthor = styled.p`
  font-size: 12px;
  color: ${props => props.theme.text}80;
  margin: 2px 0 0 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$active ? props.theme.accent : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.accent : props.theme.border};
  }
`;

const CloseButton = styled(ActionButton)`
  position: absolute;
  right: 20px;
  top: 15px;
`;

export function Header() {
  const { state, dispatch } = useEbook();

  const handleTocToggle = () => {
    dispatch({ type: 'TOGGLE_TOC' });
  };

  const handleSettingsToggle = () => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  };

  const handleCloseMenu = () => {
    dispatch({ type: 'SET_MENU_VISIBLE', payload: false });
    dispatch({ type: 'CLOSE_ALL_PANELS' });
  };

  return (
    <HeaderContainer $isVisible={state.isMenuVisible}>
      <HeaderActions>
        <ActionButton 
          onClick={handleTocToggle}
          $active={state.isTocVisible}
          title="목차"
        >
          <FiList size={20} />
        </ActionButton>
        <ActionButton title="검색">
          <FiSearch size={20} />
        </ActionButton>
      </HeaderActions>
      
      <HeaderTitle>
        <BookTitle>{state.bookTitle || '이도출판 이북뷰어'}</BookTitle>
        {state.bookAuthor && <BookAuthor>{state.bookAuthor}</BookAuthor>}
      </HeaderTitle>
      
      <HeaderActions>
        <ActionButton title="북마크">
          <FiBookmark size={20} />
        </ActionButton>
        <ActionButton 
          onClick={handleSettingsToggle}
          $active={state.isSettingsVisible}
          title="설정"
        >
          <FiSettings size={20} />
        </ActionButton>
        <ActionButton onClick={handleCloseMenu} title="닫기">
          <FiX size={20} />
        </ActionButton>
      </HeaderActions>
    </HeaderContainer>
  );
}