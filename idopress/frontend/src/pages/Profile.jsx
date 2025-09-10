import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, BookOpen, Clock, Settings } from 'lucide-react';
import { Navigate } from 'react-router-dom';

function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '없음';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const tabs = [
    { id: 'overview', label: '개요', icon: User },
    { id: 'reading', label: '독서 기록', icon: BookOpen },
    { id: 'settings', label: '설정', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 사용자 정보 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-korean-blue bg-opacity-10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-korean-blue" />
            </div>
            <div>
              <p className="text-sm text-gray-600">사용자명</p>
              <p className="font-medium text-gray-900">{user?.username}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-korean-red bg-opacity-10 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-korean-red" />
            </div>
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-korean-green bg-opacity-10 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-korean-green" />
            </div>
            <div>
              <p className="text-sm text-gray-600">가입일</p>
              <p className="font-medium text-gray-900">{formatDate(user?.created_at)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-korean-yellow bg-opacity-20 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-korean-yellow" />
            </div>
            <div>
              <p className="text-sm text-gray-600">최근 로그인</p>
              <p className="font-medium text-gray-900">{formatDate(user?.last_login)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 독서 통계 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">독서 통계</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-korean-blue mb-1">0</div>
            <div className="text-sm text-gray-600">읽은 책</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-korean-red mb-1">0</div>
            <div className="text-sm text-gray-600">읽는 중</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-korean-green mb-1">0</div>
            <div className="text-sm text-gray-600">작성한 리뷰</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-korean-yellow mb-1">0</div>
            <div className="text-sm text-gray-600">좋아요</div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
        <div className="text-center py-8">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">아직 독서 활동이 없습니다.</p>
          <p className="text-sm text-gray-500 mt-2">
            <a href="/books" className="text-korean-blue hover:text-blue-700">
              디지털 장서각
            </a>에서 한국 고전을 만나보세요!
          </p>
        </div>
      </div>
    </div>
  );

  const renderReading = () => (
    <div className="space-y-6">
      {/* 현재 읽는 중인 책 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">현재 읽는 중</h3>
        <div className="text-center py-8">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">현재 읽고 있는 책이 없습니다.</p>
        </div>
      </div>

      {/* 읽은 책 목록 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">완독한 책</h3>
        <div className="text-center py-8">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">아직 완독한 책이 없습니다.</p>
        </div>
      </div>

      {/* 관심 목록 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">관심 목록</h3>
        <div className="text-center py-8">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">관심 목록이 비어있습니다.</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* 계정 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 설정</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사용자명
            </label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">사용자명은 변경할 수 없습니다.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">이메일 변경 기능은 곧 추가될 예정입니다.</p>
          </div>
        </div>
      </div>

      {/* 읽기 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">읽기 설정</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">기본 글꼴</label>
              <p className="text-sm text-gray-600">텍스트 뷰어의 기본 글꼴을 설정합니다.</p>
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option value="serif">명조체</option>
              <option value="sans">고딕체</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">기본 테마</label>
              <p className="text-sm text-gray-600">읽기 화면의 기본 테마를 설정합니다.</p>
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option value="light">밝게</option>
              <option value="sepia">세피아</option>
              <option value="dark">어둡게</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">자동 저장</label>
              <p className="text-sm text-gray-600">읽기 진행상황을 자동으로 저장합니다.</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-korean-blue focus:ring-korean-blue"
            />
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 설정</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">새로운 도서 알림</label>
              <p className="text-sm text-gray-600">새로운 고전이 추가될 때 알림을 받습니다.</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-korean-blue focus:ring-korean-blue"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">독서 리마인더</label>
              <p className="text-sm text-gray-600">정기적인 독서 알림을 받습니다.</p>
            </div>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-korean-blue focus:ring-korean-blue"
            />
          </div>
        </div>
      </div>

      {/* 계정 관리 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 관리</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            비밀번호 변경
          </button>
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            개인정보 다운로드
          </button>
          <button className="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
            계정 삭제
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-korean-blue bg-opacity-10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-korean-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 탭 네비게이션 */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-korean-blue text-korean-blue'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'reading' && renderReading()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;