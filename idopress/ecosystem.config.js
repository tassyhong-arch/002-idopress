module.exports = {
  apps: [
    {
      name: 'idopress-backend',
      script: 'backend/app.py',
      interpreter: 'python3',
      cwd: '/home/user/webapp/idopress',
      env: {
        FLASK_ENV: 'production',
        DATABASE_URL: 'postgresql://idopress_user:idopress_password@localhost:5432/idopress',
        JWT_SECRET_KEY: 'your-secret-key-change-this-in-production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/backend_error.log',
      out_file: './logs/backend_out.log',
      log_file: './logs/backend.log',
      time: true
    },
    {
      name: 'idopress-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/user/webapp/idopress/frontend',
      env: {
        PORT: 3000,
        VITE_API_URL: 'http://localhost:5000/api'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/frontend_error.log',
      out_file: './logs/frontend_out.log',
      log_file: './logs/frontend.log',
      time: true
    }
  ]
};