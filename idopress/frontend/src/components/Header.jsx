import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, LogOut, Menu, X, Search, Library, Scroll } from 'lucide-react';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-slate-50 via-white to-slate-50 shadow-lg border-b border-slate-200/50 sticky top-0 z-50 backdrop-blur-md">
      {/* 한국 전통 장식 라인 */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-red-500 to-blue-600"></div>
      
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* 로고 - 한국 전통 스타일 */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl blur-sm opacity-30"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg">
                <Scroll className="h-7 w-7 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
                이도출판
              </h1>
              <p className="text-sm text-slate-500 font-medium tracking-wider -mt-1">
                디지털 장서각
              </p>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 - 모던 스타일 */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'text-blue-700 bg-blue-50/80 shadow-sm' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50/80'
              }`}
            >
              홈
              {isActive('/') && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>
            <Link 
              to="/books" 
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isActive('/books') 
                  ? 'text-blue-700 bg-blue-50/80 shadow-sm' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50/80'
              }`}
            >
              <Library className="h-4 w-4" strokeWidth={1.5} />
              <span>디지털 장서각</span>
              {isActive('/books') && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          </nav>

          {/* 사용자 메뉴 - 개선된 디자인 */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-700 hover:bg-slate-50/80 rounded-lg transition-all duration-200"
                >
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  <span className="font-medium">{user?.username}</span>
                </Link>
                <div className="w-px h-5 bg-slate-200"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50/80 rounded-lg transition-all duration-200"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="relative px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 - 개선된 디자인 */}
          <button
            className="lg:hidden p-2.5 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 
              <X className="h-5 w-5 text-slate-600" strokeWidth={1.5} /> : 
              <Menu className="h-5 w-5 text-slate-600" strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* 모바일 메뉴 - 세련된 슬라이드 메뉴 */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl">
              <nav className="container mx-auto px-6 py-6 space-y-3">
                <Link
                  to="/"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-blue-700 bg-blue-50' 
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
                  <span>홈</span>
                </Link>
                <Link
                  to="/books"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive('/books') 
                      ? 'text-blue-700 bg-blue-50' 
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Library className="h-4 w-4" strokeWidth={1.5} />
                  <span>디지털 장서각</span>
                </Link>
                
                <div className="h-px bg-slate-200 my-4"></div>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" strokeWidth={1.5} />
                      <span>{user?.username}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={1.5} />
                      <span>로그아웃</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium text-center shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      회원가입
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;