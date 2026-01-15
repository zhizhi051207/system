#!/bin/bash

# Psygo AI Camera - 启动脚本
# 使用方法: ./start.sh [选项]
# 选项:
#   --full        启动完整Python后端和前端 (默认)
#   --mock        启动Node.js模拟后端和前端
#   --frontend    只启动前端
#   --backend     只启动后端

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"
MOCK_BACKEND="$PROJECT_DIR/mock-backend-simple.js"

# 默认选项
MODE="full"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --full)
            MODE="full"
            shift
            ;;
        --mock)
            MODE="mock"
            shift
            ;;
        --frontend)
            MODE="frontend"
            shift
            ;;
        --backend)
            MODE="backend"
            shift
            ;;
        *)
            echo "未知选项: $1"
            echo "使用方法: $0 [--full|--mock|--frontend|--backend]"
            exit 1
            ;;
    esac
done

echo "========================================================"
echo "          Psygo AI Camera 启动脚本"
echo "========================================================"
echo "模式: $MODE"
echo "项目目录: $PROJECT_DIR"
echo "========================================================"

# 检查必要工具
check_requirements() {
    echo "检查系统要求..."
    
    # 检查Node.js
    if command -v node &> /dev/null; then
        echo "✅ Node.js $(node --version)"
    else
        echo "❌ Node.js 未安装"
        exit 1
    fi
    
    # 检查npm
    if command -v npm &> /dev/null; then
        echo "✅ npm $(npm --version)"
    else
        echo "❌ npm 未安装"
        exit 1
    fi
    
    if [[ "$MODE" == "full" ]]; then
        # 检查Python
        if command -v python3 &> /dev/null; then
            echo "✅ Python $(python3 --version)"
        else
            echo "❌ Python3 未安装"
            exit 1
        fi
    fi
    
    echo "✅ 所有要求满足"
}

# 启动函数
start_frontend() {
    echo "启动前端服务..."
    cd "$FRONTEND_DIR"
    
    # 检查依赖
    if [[ ! -d "node_modules" ]]; then
        echo "安装前端依赖..."
        npm install --legacy-peer-deps
    fi
    
    # 启动开发服务器 (后台运行)
    echo "启动Vite开发服务器 (端口: 3000)..."
    npm run dev > /tmp/psygo-frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/psygo-frontend.pid
    
    # 等待服务启动
    sleep 3
    if curl -s http://localhost:3000/ > /dev/null; then
        echo "✅ 前端服务已启动: http://localhost:3000"
    else
        echo "❌ 前端服务启动失败，查看日志: /tmp/psygo-frontend.log"
        exit 1
    fi
}

start_backend_full() {
    echo "启动Python后端服务..."
    cd "$BACKEND_DIR"
    
    # 检查虚拟环境
    if [[ ! -d "venv" ]]; then
        echo "创建Python虚拟环境..."
        python3 -m venv venv
    fi
    
    # 激活虚拟环境并安装依赖
    echo "安装Python依赖..."
    source venv/bin/activate
    pip install -r requirements.txt > /tmp/psygo-backend-install.log 2>&1
    
    # 启动FastAPI服务 (后台运行)
    echo "启动FastAPI服务器 (端口: 8080)..."
    uvicorn main:app --host 0.0.0.0 --port 8080 > /tmp/psygo-backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/psygo-backend.pid
    
    # 等待服务启动
    sleep 5
    if curl -s http://localhost:8080/health > /dev/null; then
        echo "✅ 后端服务已启动: http://localhost:8080"
        echo "✅ API文档: http://localhost:8080/docs"
    else
        echo "❌ 后端服务启动失败，查看日志: /tmp/psygo-backend.log"
        exit 1
    fi
}

start_backend_mock() {
    echo "启动Node.js模拟后端服务..."
    
    # 检查模拟后端文件
    if [[ ! -f "$MOCK_BACKEND" ]]; then
        echo "❌ 模拟后端文件不存在: $MOCK_BACKEND"
        exit 1
    fi
    
    # 启动Node.js模拟服务 (后台运行)
    echo "启动模拟服务器 (端口: 8080)..."
    node "$MOCK_BACKEND" > /tmp/psygo-mock-backend.log 2>&1 &
    MOCK_BACKEND_PID=$!
    echo $MOCK_BACKEND_PID > /tmp/psygo-mock-backend.pid
    
    # 等待服务启动
    sleep 3
    if curl -s http://localhost:8080/health > /dev/null; then
        echo "✅ 模拟后端服务已启动: http://localhost:8080"
        echo "✅ 注意: 这是模拟服务，用于开发和测试"
    else
        echo "❌ 模拟后端服务启动失败，查看日志: /tmp/psygo-mock-backend.log"
        exit 1
    fi
}

stop_services() {
    echo "停止所有服务..."
    
    # 停止前端
    if [[ -f /tmp/psygo-frontend.pid ]]; then
        kill $(cat /tmp/psygo-frontend.pid) 2>/dev/null || true
        rm -f /tmp/psygo-frontend.pid
    fi
    
    # 停止后端
    if [[ -f /tmp/psygo-backend.pid ]]; then
        kill $(cat /tmp/psygo-backend.pid) 2>/dev/null || true
        rm -f /tmp/psygo-backend.pid
    fi
    
    # 停止模拟后端
    if [[ -f /tmp/psygo-mock-backend.pid ]]; then
        kill $(cat /tmp/psygo-mock-backend.pid) 2>/dev/null || true
        rm -f /tmp/psygo-mock-backend.pid
    fi
    
    echo "✅ 所有服务已停止"
}

# 设置退出时清理
trap stop_services EXIT INT TERM

# 主逻辑
case "$MODE" in
    "full")
        check_requirements
        start_backend_full
        start_frontend
        ;;
    "mock")
        check_requirements
        start_backend_mock
        start_frontend
        ;;
    "frontend")
        check_requirements
        start_frontend
        ;;
    "backend")
        if [[ "$MODE" == "full" ]]; then
            check_requirements
            start_backend_full
        else
            check_requirements
            start_backend_mock
        fi
        ;;
esac

echo "========================================================"
echo "          Psygo AI Camera 启动完成!"
echo "========================================================"
echo "前端: http://localhost:3000"
echo "后端: http://localhost:8080"
echo "API文档: http://localhost:8080/docs"
echo "健康检查: http://localhost:3000/api/v1/health/"
echo "========================================================"
echo ""
echo "使用说明:"
echo "1. 打开浏览器访问 http://localhost:3000"
echo "2. 允许摄像头权限以使用实时预览"
echo "3. 使用变焦控制调整摄像头缩放"
echo "4. 测试AI图像增强功能"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "========================================================"

# 保持脚本运行，等待用户中断
wait