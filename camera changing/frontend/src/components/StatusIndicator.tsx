import { CheckCircle, AlertCircle, Loader2, CameraOff } from 'lucide-react'
import { CameraState } from '../types/camera'

interface StatusIndicatorProps {
  state: CameraState
}

const StatusIndicator = ({ state }: StatusIndicatorProps) => {
  const { isActive, isProcessing, error, zoomLevel } = state

  const getStatusInfo = () => {
    if (error) {
      return {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        text: '错误',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        description: error,
      }
    }

    if (!isActive) {
      return {
        icon: <CameraOff className="w-5 h-5 text-gray-500" />,
        text: '摄像头关闭',
        color: 'text-gray-500',
        bg: 'bg-gray-500/10',
        description: '点击开启摄像头',
      }
    }

    if (isProcessing) {
      return {
        icon: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
        text: 'AI处理中',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        description: `增强 ${zoomLevel.toFixed(1)}x 变焦`,
      }
    }

    return {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      text: '运行正常',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      description: `实时增强 ${zoomLevel.toFixed(1)}x`,
    }
  }

  const status = getStatusInfo()

  return (
    <div className={`${status.bg} border border-white/5 rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        {status.icon}
        <div>
          <div className={`font-medium ${status.color}`}>{status.text}</div>
          <div className="text-sm text-gray-400 mt-0.5">{status.description}</div>
        </div>
      </div>

      {/* Status details */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
        <div>
          <div className="text-xs text-gray-500">摄像头状态</div>
          <div className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-gray-400'}`}>
            {isActive ? '活动' : '未激活'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">AI处理</div>
          <div className={`text-sm font-medium ${isProcessing ? 'text-blue-400' : 'text-green-400'}`}>
            {isProcessing ? '进行中' : '就绪'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">变焦级别</div>
          <div className="text-sm font-medium text-blue-400">{zoomLevel.toFixed(1)}x</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">延迟</div>
          <div className="text-sm font-medium text-gray-300">
            {zoomLevel < 2.0 ? '< 50ms' : '< 100ms'}
          </div>
        </div>
      </div>

      {/* Processing progress (if processing) */}
      {isProcessing && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>AI增强进度</span>
            <span>70%</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
              style={{ width: '70%' }}
            />
          </div>
        </div>
      )}

      {/* Error details */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
          <div className="text-sm text-red-300">{error}</div>
          <button className="mt-2 text-sm text-red-400 hover:text-red-300 transition">
            点击查看解决方案
          </button>
        </div>
      )}
    </div>
  )
}

export default StatusIndicator