import React, { useState } from 'react';
import { EbookProvider, useEbook } from './context/EbookContext';
import { ThemedEbookViewer } from './components/ThemeProvider';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { SettingsPanel } from './components/SettingsPanel';
import { TocPanel } from './components/TocPanel';
import { EbookViewer } from './components/EbookViewer';
import { DemoEbook } from './components/DemoEbook';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const FileUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 40px;
`;

const UploadTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const UploadSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: inline-block;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const DemoButton = styled.button`
  margin-top: 20px;
  padding: 12px 25px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SampleBooks = styled.div`
  margin-top: 30px;
  text-align: left;
`;

const SampleTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  text-align: center;
`;

const SampleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  max-width: 600px;
`;

const SampleBook = styled.button`
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const BookTitle = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
`;

const BookAuthor = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

function EbookApp() {
  const { state } = useEbook();
  const [epubUrl, setEpubUrl] = useState(null);
  
  // 샘플 도서 목록 (실제 환경에서는 서버에서 가져옴)
  const sampleBooks = [
    {
      title: "춘향전",
      author: "작자 미상",
      url: "/samples/chunhyang.epub"
    },
    {
      title: "홍길동전", 
      author: "허균",
      url: "/samples/honggildong.epub"
    },
    {
      title: "구운몽",
      author: "김만중", 
      url: "/samples/guunmong.epub"
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/epub+zip') {
      const url = URL.createObjectURL(file);
      setEpubUrl(url);
    } else {
      alert('EPUB 파일만 업로드 가능합니다.');
    }
  };

  const handleSampleBook = (bookUrl) => {
    setEpubUrl(bookUrl);
  };

  const handleDemo = () => {
    // 데모 모드 활성화
    setEpubUrl('demo');
  };

  if (!epubUrl) {
    return (
      <AppContainer>
        <FileUploadArea>
          <UploadTitle>이도출판 이북뷰어</UploadTitle>
          <UploadSubtitle>
            교보문고 스타일의 전문 이북뷰어<br />
            EPUB 파일을 업로드하여 시작하세요
          </UploadSubtitle>
          
          <UploadButton htmlFor="epub-upload">
            📚 EPUB 파일 선택
          </UploadButton>
          <FileInput
            id="epub-upload"
            type="file"
            accept=".epub,application/epub+zip"
            onChange={handleFileUpload}
          />
          
          <DemoButton onClick={handleDemo}>
            🎭 데모 보기
          </DemoButton>
          
          <SampleBooks>
            <SampleTitle>📖 샘플 도서</SampleTitle>
            <SampleList>
              {sampleBooks.map((book, index) => (
                <SampleBook
                  key={index}
                  onClick={() => handleSampleBook(book.url)}
                >
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>{book.author}</BookAuthor>
                </SampleBook>
              ))}
            </SampleList>
          </SampleBooks>
        </FileUploadArea>
      </AppContainer>
    );
  }

  return (
    <ThemedEbookViewer
      theme={state.theme}
      fontSize={state.fontSize}
      lineHeight={state.lineHeight}
      fontFamily={state.fontFamily}
    >
      <Header />
      {epubUrl === 'demo' ? (
        <DemoEbook />
      ) : (
        <EbookViewer epubUrl={epubUrl} />
      )}
      <ProgressBar />
      <SettingsPanel />
      <TocPanel />
    </ThemedEbookViewer>
  );
}

function App() {
  return (
    <EbookProvider>
      <EbookApp />
    </EbookProvider>
  );
}

export default App;