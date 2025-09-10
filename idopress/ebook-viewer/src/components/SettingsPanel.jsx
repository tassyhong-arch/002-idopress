import React from 'react';
import styled from 'styled-components';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useEbook } from '../context/EbookContext';

const SettingsContainer = styled.div`
  position: fixed;
  top: 70px;
  right: ${props => props.$isVisible ? '0' : '-320px'};
  width: 320px;
  height: calc(100vh - 70px);
  background: ${props => props.theme.menuBackground};
  backdrop-filter: blur(10px);
  border-left: 1px solid ${props => props.theme.border};
  padding: 30px 20px;
  transition: right 0.3s ease;
  z-index: 999;
  overflow-y: auto;
  box-shadow: -2px 0 10px ${props => props.theme.shadow};
`;

const SettingGroup = styled.div`
  margin-bottom: 35px;
`;

const SettingLabel = styled.h3`
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const ThemeSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ThemeButton = styled.button`
  width: 80px;
  height: 50px;
  border: 2px solid ${props => props.$isActive ? props.theme.accent : props.theme.border};
  border-radius: 8px;
  background: ${props => props.$bgColor};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.$textColor};
  
  &:hover {
    border-color: ${props => props.theme.accent};
    transform: translateY(-1px);
  }
  
  ${props => props.$isActive && `
    box-shadow: 0 0 0 2px ${props.theme.accent}40;
  `}
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.accent};
    color: white;
    transform: scale(1.05);
  }
`;

const ValueDisplay = styled.div`
  flex: 1;
  text-align: center;
  padding: 8px 12px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const FontSelect = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }
`;

const PreviewText = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: ${props => props.$fontSize}px;
  line-height: ${props => props.$lineHeight};
  font-family: ${props => props.$fontFamily === 'serif' 
    ? '"Noto Serif KR", Georgia, serif' 
    : '"Noto Sans KR", Arial, sans-serif'};
`;

export function SettingsPanel() {
  const { state, dispatch } = useEbook();

  const handleThemeChange = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const handleFontSizeChange = (delta) => {
    const newSize = state.fontSize + delta;
    dispatch({ type: 'SET_FONT_SIZE', payload: newSize });
  };

  const handleLineHeightChange = (delta) => {
    const newHeight = parseFloat((state.lineHeight + delta).toFixed(1));
    dispatch({ type: 'SET_LINE_HEIGHT', payload: newHeight });
  };

  const handleFontFamilyChange = (e) => {
    dispatch({ type: 'SET_FONT_FAMILY', payload: e.target.value });
  };

  const themes = [
    { key: 'day', name: '기본', bgColor: '#FFFFFF', textColor: '#000000' },
    { key: 'sepia', name: '세피아', bgColor: '#FBF0D9', textColor: '#5B4636' },
    { key: 'night', name: '다크', bgColor: '#121212', textColor: '#E0E0E0' }
  ];

  return (
    <SettingsContainer $isVisible={state.isSettingsVisible}>
      <SettingGroup>
        <SettingLabel>테마 설정</SettingLabel>
        <ThemeSection>
          {themes.map(theme => (
            <ThemeButton
              key={theme.key}
              $bgColor={theme.bgColor}
              $textColor={theme.textColor}
              $isActive={state.theme === theme.key}
              onClick={() => handleThemeChange(theme.key)}
            >
              {theme.name}
            </ThemeButton>
          ))}
        </ThemeSection>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>글자 크기</SettingLabel>
        <ControlGroup>
          <ControlButton onClick={() => handleFontSizeChange(-1)}>
            <FiMinus size={16} />
          </ControlButton>
          <ValueDisplay>{state.fontSize}px</ValueDisplay>
          <ControlButton onClick={() => handleFontSizeChange(1)}>
            <FiPlus size={16} />
          </ControlButton>
        </ControlGroup>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>줄 간격</SettingLabel>
        <ControlGroup>
          <ControlButton onClick={() => handleLineHeightChange(-0.1)}>
            <FiMinus size={16} />
          </ControlButton>
          <ValueDisplay>{state.lineHeight.toFixed(1)}</ValueDisplay>
          <ControlButton onClick={() => handleLineHeightChange(0.1)}>
            <FiPlus size={16} />
          </ControlButton>
        </ControlGroup>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>글꼴</SettingLabel>
        <FontSelect 
          value={state.fontFamily} 
          onChange={handleFontFamilyChange}
        >
          <option value="serif">명조체 (Serif)</option>
          <option value="sans-serif">고딕체 (Sans-serif)</option>
        </FontSelect>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>미리보기</SettingLabel>
        <PreviewText 
          $fontSize={state.fontSize}
          $lineHeight={state.lineHeight}
          $fontFamily={state.fontFamily}
        >
          시대를 넘나드는 한국의 지혜와 만나보세요. 200여 권의 고전 작품을 현대적으로 재해석한 특별한 공간입니다.
        </PreviewText>
      </SettingGroup>
    </SettingsContainer>
  );
}