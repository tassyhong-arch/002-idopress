import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useEbook } from '../context/EbookContext';

const DemoContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 20px;
  cursor: pointer;
`;

const DemoContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  line-height: ${props => props.$lineHeight};
  font-size: ${props => props.$fontSize}px;
  font-family: ${props => props.$fontFamily === 'serif' 
    ? '"Noto Serif KR", Georgia, serif' 
    : '"Noto Sans KR", Arial, sans-serif'};
  
  h1 {
    font-size: 2.5em;
    margin-bottom: 1em;
    text-align: center;
    border-bottom: 2px solid currentColor;
    padding-bottom: 0.5em;
  }
  
  h2 {
    font-size: 1.8em;
    margin: 2em 0 1em 0;
    color: ${props => props.theme.accent};
  }
  
  h3 {
    font-size: 1.4em;
    margin: 1.5em 0 0.8em 0;
  }
  
  p {
    margin-bottom: 1.2em;
    text-align: justify;
    text-indent: 1.2em;
  }
  
  .author {
    text-align: center;
    font-style: italic;
    margin-bottom: 2em;
    opacity: 0.8;
  }
  
  .chapter-title {
    text-align: center;
    font-weight: 600;
    margin: 2em 0 1em 0;
    padding: 0.5em;
    background: ${props => props.theme.accent}15;
    border-radius: 8px;
  }
`;

const PageIndicator = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  opacity: 0.6;
`;

// 데모용 한국 고전 텍스트
const demoChapters = [
  {
    title: "춘향전",
    author: "작자 미상",
    content: `
      <div class="chapter-title">제1장 - 춘향과 몽룡의 만남</div>
      
      <p>옛날 전라도 남원에 월매라 하는 기생이 있었는데, 딸 하나를 두었으니 이름을 춘향이라 하였다. 춘향은 나이 열여섯에 꽃다운 용모와 빼어난 재주를 지니고 있었다.</p>
      
      <p>어느 봄날, 춘향이는 방자와 함께 광한루에 놀러 나갔다가 한 젊은 도련님을 만나게 되었다. 그 도련님이 바로 남원 부사의 아들 이몽룡이었다.</p>
      
      <p>"아가씨는 어느 집 딸이신가?" 몽룡이 춘향의 아름다운 모습에 반하여 물었다.</p>
      
      <p>"저는 월매의 딸 춘향이올시다." 춘향이 고개를 숙이며 대답하였다.</p>
      
      <p>두 사람은 첫눈에 서로를 사랑하게 되었고, 그날로 혼례를 올리게 되었다. 하지만 신분의 차이와 사회의 벽이 그들 앞에 놓여 있었다.</p>
    `
  },
  {
    title: "홍길동전", 
    author: "허균",
    content: `
      <div class="chapter-title">제1장 - 홍길동의 탄생</div>
      
      <p>조선 세종대왕 때, 홍판서라 하는 재상이 있었다. 그에게는 적자 인형과 서자 길동이 있었는데, 길동은 총명하고 무예에 뛰어났으나 서자라는 신분 때문에 아버지를 아버지라 부르지 못하는 설움이 있었다.</p>
      
      <p>"아버님을 아버님이라 부르지 못하고, 형을 형이라 부르지 못하니 이 어찌 사람 노릇이라 하겠습니까?" 길동이 하늘을 우러러 탄식하였다.</p>
      
      <p>홍길동은 서자의 설움을 안고 집을 떠나 활빈당이라는 의적 집단을 조직하여 탐관오리들을 징벌하고 백성들을 구제하는 일에 나섰다.</p>
      
      <p>그의 명성이 온 나라에 퍼지자 임금도 그의 재능을 인정하여 벼슬을 내렸으나, 홍길동은 진정한 자유를 찾아 이상향인 율도국으로 떠났다.</p>
    `
  },
  {
    title: "구운몽",
    author: "김만중", 
    content: `
      <div class="chapter-title">제1장 - 성진의 깨달음</div>
      
      <p>당나라 때 유명한 승려 성진이 금산사에서 도를 닦고 있었다. 어느 날 성진은 스승 육관대사의 심부름으로 용궁에 가게 되었는데, 그곳에서 여덟 선녀를 만나 인간 세상의 부귀영화에 대한 이야기를 듣게 되었다.</p>
      
      <p>"스님, 인간 세상의 사랑과 영화가 그리 부질없는 것이옵니까?" 선녀들이 묻자, 성진은 그만 마음이 흔들리고 말았다.</p>
      
      <p>육관대사는 제자의 마음이 흔들린 것을 알고, 성진과 여덟 선녀를 모두 인간 세상으로 내려보내어 부귀영화를 직접 경험하게 하였다.</p>
      
      <p>성진은 양소유로 환생하여 정경패의 아들로 태어나 출세를 하고, 여덟 선녀들은 각각 다른 신분의 여인으로 태어나 양소유와 인연을 맺게 되었다.</p>
    `
  }
];

export function DemoEbook() {
  const { state, dispatch } = useEbook();
  const [currentChapter, setCurrentChapter] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    // 데모 책 정보 설정
    dispatch({
      type: 'SET_BOOK_INFO',
      payload: {
        title: demoChapters[currentChapter].title,
        author: demoChapters[currentChapter].author
      }
    });

    // 목차 생성
    const toc = demoChapters.map((chapter, index) => ({
      id: `chapter-${index}`,
      href: `#chapter-${index}`,
      label: chapter.title
    }));
    
    dispatch({ type: 'SET_TOC', payload: toc });

    // 진행률 계산
    const progress = ((currentChapter + 1) / demoChapters.length) * 100;
    dispatch({ type: 'SET_PROGRESS', payload: progress });

    // 챕터 정보
    dispatch({
      type: 'SET_CHAPTER_INFO',
      payload: {
        chapter: demoChapters[currentChapter].title,
        page: currentChapter + 1,
        total: demoChapters.length
      }
    });

  }, [currentChapter, dispatch]);

  // 진행률 변경 이벤트 리스너
  useEffect(() => {
    const handleProgressChange = (e) => {
      const progress = e.detail;
      const chapterIndex = Math.floor((progress / 100) * demoChapters.length);
      const validIndex = Math.max(0, Math.min(chapterIndex, demoChapters.length - 1));
      setCurrentChapter(validIndex);
    };

    const handleTocNavigate = (e) => {
      const { href } = e.detail;
      const chapterIndex = parseInt(href.replace('#chapter-', ''));
      setCurrentChapter(chapterIndex);
    };

    window.addEventListener('progressChange', handleProgressChange);
    window.addEventListener('tocNavigate', handleTocNavigate);

    return () => {
      window.removeEventListener('progressChange', handleProgressChange);
      window.removeEventListener('tocNavigate', handleTocNavigate);
    };
  }, []);

  const handleScreenTap = (e) => {
    const rect = contentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.2) {
      // 왼쪽: 이전 챕터
      if (currentChapter > 0) {
        setCurrentChapter(currentChapter - 1);
      }
    } else if (x > width * 0.8) {
      // 오른쪽: 다음 챕터  
      if (currentChapter < demoChapters.length - 1) {
        setCurrentChapter(currentChapter + 1);
      }
    } else {
      // 중앙: 메뉴 토글
      dispatch({ type: 'TOGGLE_MENU' });
    }
  };

  return (
    <DemoContainer onClick={handleScreenTap} ref={contentRef}>
      <DemoContent 
        $fontSize={state.fontSize}
        $lineHeight={state.lineHeight}
        $fontFamily={state.fontFamily}
        dangerouslySetInnerHTML={{ 
          __html: `
            <h1>${demoChapters[currentChapter].title}</h1>
            <div class="author">작가: ${demoChapters[currentChapter].author}</div>
            ${demoChapters[currentChapter].content}
          ` 
        }}
      />
      <PageIndicator>
        {currentChapter + 1} / {demoChapters.length}
      </PageIndicator>
    </DemoContainer>
  );
}