import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPanel = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    // 저장된 관리자 세션 확인
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    
    if (savedToken && savedUser) {
      try {
        setAdminToken(savedToken);
        setAdminUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        // 잘못된 데이터가 저장된 경우 클리어
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
  }, []);

  const handleLogin = (user, token) => {
    setAdminUser(user);
    setAdminToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    setAdminToken(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-full max-h-full overflow-auto m-4">
        {/* 닫기 버튼 */}
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {isAuthenticated ? '관리자 대시보드' : '관리자 로그인'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 내용 */}
        <div className="p-0">
          {!isAuthenticated ? (
            <AdminLogin onLogin={handleLogin} />
          ) : (
            <AdminDashboard 
              user={adminUser} 
              token={adminToken} 
              onLogout={handleLogout} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;