import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, LogOut, Menu, X, Search } from 'lucide-react';

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-8 w-8 text-korean-blue" />
            <div>
              <h1 className="text-xl font-bold text-korean-blue font-serif-kr">이도출판</h1>
              <p className="text-xs text-gray-600 -mt-1">디지털 장서각</p>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-korean-blue ${
                isActive('/') ? 'text-korean-blue border-b-2 border-korean-blue pb-1' : 'text-gray-700'
              }`}
            >
              홈
            </Link>
            <Link 
              to="/books" 
              className={`text-sm font-medium transition-colors hover:text-korean-blue ${
                isActive('/books') ? 'text-korean-blue border-b-2 border-korean-blue pb-1' : 'text-gray-700'
              }`}
            >
              디지털 장서각
            </Link>
            
            {/* 사용자 메뉴 */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-sm text-gray-700 hover:text-korean-blue transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-gray-700 hover:text-korean-red transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm text-gray-700 hover:text-korean-blue transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="bg-korean-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-sm font-medium ${
                  isActive('/') ? 'text-korean-blue' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                홈
              </Link>
              <Link
                to="/books"
                className={`text-sm font-medium ${
                  isActive('/books') ? 'text-korean-blue' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                디지털 장서각
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-sm text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.username}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-sm text-gray-700 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="bg-korean-blue text-white px-4 py-2 rounded-lg text-sm w-fit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;