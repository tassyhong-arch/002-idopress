import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 인증 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 자동 로그아웃
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 서비스
export const authService = {
  async login(username, password) {
    return await api.post('/auth/login', { username, password });
  },

  async register(username, email, password) {
    return await api.post('/auth/register', { username, email, password });
  },

  async getProfile() {
    return await api.get('/auth/profile');
  },
};

// 도서 서비스
export const bookService = {
  async getBooks(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const url = queryParams.toString() ? `/books?${queryParams.toString()}` : '/books';
    return await api.get(url);
  },

  async getBook(id) {
    return await api.get(`/books/${id}`);
  },

  async getGenres() {
    return await api.get('/books/genres');
  },

  async getEras() {
    return await api.get('/books/eras');
  },

  async getReadingProgress(bookId) {
    return await api.get(`/progress/${bookId}`);
  },

  async updateReadingProgress(bookId, progress) {
    return await api.post(`/progress/${bookId}`, progress);
  },
};

// 헬스 체크 서비스
export const healthService = {
  async check() {
    return await api.get('/health');
  },
};

export default api;