import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Tag, Eye, User, ArrowLeft, Play, Clock } from 'lucide-react';
import { bookService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBook(id);
      setBook(response.book);
    } catch (error) {
      console.error('Failed to fetch book detail:', error);
      setError('도서 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartReading = () => {
    navigate(`/books/${id}/read`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-korean-blue"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">도서를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-6">{error || '요청하신 도서가 존재하지 않습니다.'}</p>
        <Link
          to="/books"
          className="bg-korean-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          도서 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 뒤로가기 버튼 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-korean-blue transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            뒤로 가기
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 도서 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 도서 정보 */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 traditional-text">
                    {book.title}
                  </h1>
                  {book.title_original && (
                    <p className="text-xl text-gray-600 mb-2 font-serif-kr">
                      {book.title_original}
                    </p>
                  )}
                  <p className="text-lg text-korean-blue font-medium mb-4">
                    {book.author}
                  </p>
                </div>

                {/* 메타 정보 */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{book.era}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Tag className="h-4 w-4" />
                    <span>{book.genre}</span>
                  </div>
                  {book.publication_date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{book.publication_date}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>조회 {book.view_count}회</span>
                  </div>
                </div>

                {/* 특징 배지 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-korean-blue bg-opacity-10 text-korean-blue px-3 py-1 rounded-full text-sm">
                    {book.era}
                  </span>
                  <span className="bg-korean-red bg-opacity-10 text-korean-red px-3 py-1 rounded-full text-sm">
                    {book.genre}
                  </span>
                  {book.has_modern_translation && (
                    <span className="bg-korean-yellow bg-opacity-20 text-korean-yellow px-3 py-1 rounded-full text-sm">
                      현대어 번역 포함
                    </span>
                  )}
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    무료 열람
                  </span>
                </div>

                {/* 설명 */}
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* 액션 패널 */}
              <div className="lg:w-80">
                <div className="sticky top-8">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    {/* 읽기 시작 버튼 */}
                    <button
                      onClick={handleStartReading}
                      className="w-full bg-korean-blue text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold"
                    >
                      <Play className="h-5 w-5" />
                      <span>읽기 시작</span>
                    </button>

                    {/* 비회원 안내 */}
                    {!isAuthenticated && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                        <p className="text-blue-800 mb-2">
                          <strong>회원가입 혜택</strong>
                        </p>
                        <ul className="text-blue-700 space-y-1 text-xs">
                          <li>• 읽기 진행상황 저장</li>
                          <li>• 나만의 서재 구성</li>
                          <li>• 리뷰 및 평점 작성</li>
                          <li>• 커뮤니티 참여</li>
                        </ul>
                        <Link
                          to="/register"
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded mt-3 text-xs hover:bg-blue-700 transition-colors"
                        >
                          무료 회원가입
                        </Link>
                      </div>
                    )}

                    {/* 도서 통계 */}
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">도서 정보</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">시대</span>
                          <span className="font-medium">{book.era}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">장르</span>
                          <span className="font-medium">{book.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">조회수</span>
                          <span className="font-medium">{book.view_count}회</span>
                        </div>
                        {book.publication_date && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">원작 연도</span>
                            <span className="font-medium">{book.publication_date}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 공유하기 */}
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">공유하기</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: book.title,
                                text: book.description,
                                url: window.location.href
                              });
                            } else {
                              navigator.clipboard.writeText(window.location.href);
                              alert('링크가 복사되었습니다.');
                            }
                          }}
                          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300 transition-colors"
                        >
                          링크 복사
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 내용 미리보기 */}
          {book.content && (
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif-kr">
                내용 미리보기
              </h2>
              
              <div className="prose max-w-none">
                <div className="text-viewer bg-traditional-paper border border-gray-200 rounded-lg">
                  <div className="traditional-text text-gray-800">
                    {book.content.split('\n').slice(0, 10).map((line, index) => (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ))}
                    {book.content.split('\n').length > 10 && (
                      <div className="text-center mt-6 pt-4 border-t border-gray-300">
                        <p className="text-gray-600 mb-4">계속해서 읽으시려면...</p>
                        <button
                          onClick={handleStartReading}
                          className="bg-korean-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          전체 내용 읽기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 관련 도서 추천 (향후 구현) */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif-kr">
              함께 읽으면 좋은 고전
            </h2>
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                관련 도서 추천 기능은 곧 추가될 예정입니다.
              </p>
              <Link
                to="/books"
                className="inline-block mt-4 text-korean-blue hover:text-blue-700 font-medium"
              >
                다른 고전 둘러보기 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;