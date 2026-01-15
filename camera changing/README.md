# Psygo AI Camera - 智能AI相机应用

一个完整的AI相机应用，提供实时摄像头预览、数字变焦控制和AI图像增强功能。

## 🚀 功能特性

### 前端 (React应用)
- **实时摄像头预览**: 基于WebRTC，支持设备切换
- **数字变焦控制**: 0.5x-3.0x范围，滑块和预设按钮
- **AI图像增强**: 模拟AI处理，支持不同强度级别
- **响应式设计**: 适配桌面和移动设备
- **主题切换**: 深色/浅色主题
- **状态管理**: Zustand + 本地持久化

### 后端 (FastAPI服务)
- **RESTful API**: 完整的CRUD操作
- **图像处理API**: 支持图像上传和增强
- **WebSocket通信**: 实时图像帧处理
- **健康检查**: 服务状态监控
- **API文档**: 自动生成的Swagger UI

## 📁 项目结构

```
psygo-ai-camera/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── hooks/          # 自定义Hooks
│   │   ├── stores/         # Zustand状态管理
│   │   ├── types/          # TypeScript类型定义
│   │   └── utils/          # 工具函数
│   ├── public/             # 静态资源
│   ├── package.json        # 前端依赖
│   ├── vite.config.ts      # Vite配置
│   ├── tailwind.config.js  # Tailwind配置
│   └── postcss.config.js   # PostCSS配置
├── backend/                # Python后端服务
│   ├── app/
│   │   ├── api/           # API路由
│   │   ├── core/          # 核心配置
│   │   ├── models/        # 数据模型
│   │   ├── services/      # 业务逻辑
│   │   └── utils/         # 工具函数
│   ├── requirements.txt   # Python依赖
│   ├── main.py           # 应用入口
│   └── .env.example      # 环境变量示例
├── mock-backend.js        # Node.js模拟后端
├── mock-backend-simple.js # 简单模拟后端
├── start.sh              # 一键启动脚本
└── README.md             # 项目文档
```

## 🛠️ 快速开始

### 前提条件
- Node.js 18+ 和 npm
- Python 3.8+ 和 pip (用于完整后端)
- 现代浏览器 (支持WebRTC)

### 方法1: 使用启动脚本 (推荐)

```bash
# 克隆项目后
cd psygo-ai-camera

# 启动完整应用 (Python后端 + 前端)
./start.sh --full

# 或启动模拟版本 (Node.js模拟后端 + 前端)
./start.sh --mock

# 或只启动前端 (需后端已在运行)
./start.sh --frontend
```

启动后访问:
- 前端应用: http://localhost:3000
- 后端API: http://localhost:8080
- API文档: http://localhost:8080/docs

### 方法2: 手动启动

#### 启动后端 (Python版本)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

#### 启动前端
```bash
cd frontend
npm install
npm run dev
```

#### 启动模拟后端 (无需Python)
```bash
cd psygo-ai-camera
node mock-backend-simple.js
```

## 🔧 配置说明

### 前端代理配置
前端通过Vite代理连接到后端，配置见 `frontend/vite.config.ts`:
```javascript
proxy: {
  '/api': { target: 'http://localhost:8080' },
  '/ws': { target: 'ws://localhost:8080', ws: true }
}
```

### 环境变量
后端配置见 `.env` 文件:
```env
DATABASE_URL=mysql://user:password@localhost/psygo_camera
AI_MODEL_PATH=/path/to/model.pt
UPLOAD_DIR=./uploads
```

## 📡 API接口

### 主要端点
- `GET /health` - 健康检查
- `GET /api/v1/health/` - 详细健康状态
- `POST /api/v1/images/enhance` - 图像增强
- `GET /api/v1/images/history` - 处理历史
- `GET /api/v1/users/` - 用户管理
- `GET /ws` - WebSocket连接

### WebSocket通信
连接URL: `ws://localhost:8080/ws/{client_id}`

消息格式:
```json
{
  "type": "image_frame",
  "frame_id": "frame_123",
  "image_data": "base64_encoded_image",
  "zoom_level": 1.5,
  "enhancement_level": "medium"
}
```

## 🧪 测试功能

### 摄像头测试
1. 访问 http://localhost:3000
2. 允许浏览器摄像头权限
3. 查看实时摄像头画面

### 变焦控制测试
1. 使用滑块调整变焦级别 (0.5x-3.0x)
2. 点击预设按钮 (1x, 1.5x, 2x, 3x)
3. 观察变焦效果

### AI处理测试
1. 选择AI模型 (基础/增强/专业)
2. 调整处理强度
3. 点击"开始处理"按钮
4. 查看处理结果和进度

### API测试
```bash
# 健康检查
curl http://localhost:8080/health

# 图像增强模拟
curl -X POST http://localhost:8080/api/v1/images/enhance \
  -F "image=@test.jpg" \
  -F "zoom_level=1.5" \
  -F "enhancement_level=medium"

# WebSocket测试 (使用wscat工具)
wscat -c ws://localhost:8080/ws/test
```

## 🐳 Docker部署 (可选)

### 构建和运行
```bash
# 构建镜像
docker build -t psygo-ai-camera .

# 运行容器
docker run -p 3000:3000 -p 8080:8080 psygo-ai-camera
```

## 🤝 开发团队

- **前端开发**: @cindy - React, TypeScript, UI/UX
- **后端开发**: @lihua - FastAPI, Python, AI集成
- **架构设计**: @bob-1u986g8d - 系统架构, 类型安全
- **项目管理**: @arnaldo - 协调, 部署, 测试

## 📄 许可证

MIT License

## 🆘 故障排除

### 常见问题

1. **摄像头无法访问**
   - 检查浏览器权限设置
   - 确保没有其他应用占用摄像头

2. **端口冲突**
   - 修改 `vite.config.ts` 中的端口配置
   - 修改后端启动端口: `--port 8081`

3. **依赖安装失败**
   ```bash
   # 前端
   npm cache clean --force
   npm install --legacy-peer-deps
   
   # 后端
   pip install --upgrade pip
   pip install -r requirements.txt --no-cache-dir
   ```

4. **跨域问题**
   - 确保前端代理配置正确
   - 检查后端CORS设置

### 日志查看
```bash
# 前端日志
tail -f /tmp/psygo-frontend.log

# 后端日志
tail -f /tmp/psygo-backend.log

# 模拟后端日志
tail -f /tmp/psygo-mock-backend.log
```

## 🔄 更新日志

### v1.0.0 (当前版本)
- ✅ 完整的前后端架构
- ✅ 实时摄像头预览
- ✅ 数字变焦控制
- ✅ AI图像增强模拟
- ✅ WebSocket实时通信
- ✅ 响应式设计
- ✅ 完整的API文档

---

**开始使用**: `./start.sh --full` 或 `./start.sh --mock`