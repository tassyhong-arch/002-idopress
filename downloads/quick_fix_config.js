// 프론트엔드 JavaScript에서 API URL을 외부 서버로 변경
// assets/index-*.js 파일에서 다음과 같이 수정:

// 기존
// const API_BASE_URL = '/api';

// 임시 해결 (외부 API 서버 사용)
const API_BASE_URL = 'https://5000-iw0w19imdkc5wjlakkes9-6532622b.e2b.dev/api';

// 이렇게 하면 프론트엔드는 즉시 작동하고
// 나중에 백엔드 설정 완료 후 다시 '/api'로 변경하면 됩니다.