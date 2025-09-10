import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Eye, EyeOff, UserPlus, Mail, User } from 'lucide-react';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 클리어
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username) {
      setError('사용자명을 입력해주세요.');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('사용자명은 3자 이상이어야 합니다.');
      return false;
    }

    if (!formData.email) {
      setError('이메일을 입력해주세요.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    if (!formData.password) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register(formData.username, formData.email, formData.password);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: '회원가입이 완료되었습니다. 로그인해주세요.' 
            }
          });
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('회원가입 중 오류가 발생했습니다.');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">회원가입 완료!</h2>
            <p className="text-gray-600 mb-6">
              이도출판 디지털 장서각에 오신 것을 환영합니다.<br />
              곧 로그인 페이지로 이동합니다.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center bg-korean-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              로그인하러 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* 로고 */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-10 w-10 text-korean-blue" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-korean-blue font-serif-kr">이도출판</h1>
              <p className="text-sm text-gray-600 -mt-1">디지털 장서각</p>
            </div>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          새 계정 만들기
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link
            to="/login"
            className="font-medium text-korean-blue hover:text-blue-700 transition-colors"
          >
            로그인하기
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* 사용자명 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                사용자명
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-korean-blue focus:border-korean-blue sm:text-sm"
                  placeholder="사용자명 (3자 이상)"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-korean-blue focus:border-korean-blue sm:text-sm"
                  placeholder="your@email.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-korean-blue focus:border-korean-blue sm:text-sm"
                  placeholder="비밀번호 (6자 이상)"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-korean-blue focus:border-korean-blue sm:text-sm"
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-korean-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-korean-blue disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    계정 생성 중...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    회원가입
                  </div>
                )}
              </button>
            </div>

            {/* 약관 동의 */}
            <div className="text-xs text-gray-500 text-center">
              회원가입을 진행하면{' '}
              <a href="#" className="text-korean-blue hover:text-blue-700">
                이용약관
              </a>
              {' '}및{' '}
              <a href="#" className="text-korean-blue hover:text-blue-700">
                개인정보보호정책
              </a>
              에 동의하는 것으로 간주됩니다.
            </div>
          </form>

          {/* 둘러보기 옵션 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/books"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                비회원으로 둘러보기
              </Link>
            </div>
          </div>
        </div>

        {/* 프로젝트 정보 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            한국 고전 문학의 디지털 아카이브<br />
            Project Gutenberg 모델을 적용한 개방형 플랫폼
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;