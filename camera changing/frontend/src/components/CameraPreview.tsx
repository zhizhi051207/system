import { useRef, useState } from 'react'
import { Camera, Power, AlertCircle } from 'lucide-react'

interface CameraPreviewProps {
  isActive: boolean
  zoomLevel: number
  onCameraToggle: () => void
}

const CameraPreview = ({ isActive, zoomLevel, onCameraToggle }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCameraStart = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('无法访问摄像头。请检查权限和连接。')
      console.error('Camera error:', err)
    }
  }

  const handleCameraStop = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const handleToggle = () => {
    if (isActive) {
      handleCameraStop()
    } else {
      handleCameraStart()
    }
    onCameraToggle()
  }

  const zoomStyle = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: 'center',
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
        {isActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={zoomStyle}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
            <Camera className="w-24 h-24 text-gray-700 mb-4" />
            <p className="text-gray-500">摄像头已关闭</p>
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-medium">{zoomLevel.toFixed(1)}x</span>
        </div>

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
            <div className="bg-red-900/90 backdrop-blur-sm p-4 rounded-lg max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">摄像头错误</span>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          {isActive ? '关闭摄像头' : '开启摄像头'}
        </button>

        <div className="text-sm text-gray-400">
          {isActive ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              实时预览中
            </span>
          ) : (
            '点击按钮开始预览'
          )}
        </div>
      </div>

      {/* Camera info */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">摄像头信息</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">状态：</span>
            <span className={isActive ? 'text-green-400' : 'text-gray-500'}>
              {isActive ? '活动' : '未激活'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">变焦：</span>
            <span className="text-blue-400">{zoomLevel.toFixed(1)}x</span>
          </div>
          <div>
            <span className="text-gray-400">分辨率：</span>
            <span className="text-gray-300">1280×720</span>
          </div>
          <div>
            <span className="text-gray-400">AI增强：</span>
            <span className="text-green-400">启用</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraPreview