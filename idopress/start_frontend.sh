#!/bin/bash
cd /home/user/webapp/idopress/frontend
export VITE_API_URL=https://5000-iw0w19imdkc5wjlakkes9-6532622b.e2b.dev/api
nohup npm run dev -- --host 0.0.0.0 --port 3000 > ../logs/frontend.log 2>&1 &
echo "Frontend started in background"
echo "PID: $!"