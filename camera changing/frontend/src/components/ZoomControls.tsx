import { ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react'
import { ZoomSettings } from '../types/camera'

interface ZoomControlsProps {
  zoomLevel: number
  onZoomChange: (zoom: number) => void
  settings: ZoomSettings
}

const ZoomControls = ({ zoomLevel, onZoomChange, settings }: ZoomControlsProps) => {
  const { min, max, step } = settings

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    onZoomChange(value)
  }

  const handleButtonZoom = (direction: 'in' | 'out') => {
    let newZoom = zoomLevel
    if (direction === 'in') {
      newZoom = Math.min(max, zoomLevel + step)
    } else {
      newZoom = Math.max(min, zoomLevel - step)
    }
    onZoomChange(newZoom)
  }

  const handlePresetZoom = (preset: number) => {
    onZoomChange(preset)
  }

  const zoomPercentage = ((zoomLevel - min) / (max - min)) * 100

  return (
    <div className="space-y-6">
      {/* Main slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">变焦级别</span>
          <span className="text-2xl font-bold text-blue-400">{zoomLevel.toFixed(1)}x</span>
        </div>

        <div className="relative pt-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={zoomLevel}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
          />
          
          {/* Slider labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{min}x</span>
            <span>{((min + max) / 2).toFixed(1)}x</span>
            <span>{max}x</span>
          </div>
        </div>

        {/* Quick zoom buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleButtonZoom('out')}
            disabled={zoomLevel <= min}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg transition"
          >
            <ZoomOut className="w-4 h-4" />
            缩小
          </button>
          <button
            onClick={() => handleButtonZoom('in')}
            disabled={zoomLevel >= max}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg transition"
          >
            <ZoomIn className="w-4 h-4" />
            放大
          </button>
        </div>
      </div>

      {/* Preset zoom levels */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">预设变焦</h3>
        <div className="grid grid-cols-4 gap-2">
          {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map(preset => (
            <button
              key={preset}
              onClick={() => handlePresetZoom(preset)}
              className={`py-2 rounded-lg transition ${
                Math.abs(zoomLevel - preset) < 0.05
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {preset}x
            </button>
          ))}
        </div>
      </div>

      {/* Zoom level indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">当前变焦级别：</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${zoomPercentage}%` }}
              />
            </div>
            <span className="font-medium">{zoomPercentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-gray-400 mb-1">推荐设置</div>
            <div className="text-green-400 font-medium">1.0x - 2.0x</div>
            <div className="text-xs text-gray-500 mt-1">最佳AI增强效果</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-gray-400 mb-1">处理延迟</div>
            <div className="text-blue-400 font-medium">{zoomLevel < 2.0 ? '< 50ms' : '< 100ms'}</div>
            <div className="text-xs text-gray-500 mt-1">实时增强</div>
          </div>
        </div>
      </div>

      {/* Zoom warning */}
      {zoomLevel > 2.0 && (
        <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-400 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-300">高变焦警告</h4>
              <p className="text-sm text-yellow-200/80 mt-1">
                变焦级别超过2.0x时，AI处理时间会增加。建议保持在2.0x以下以获得最佳实时性能。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper component for warning icon
const ZoomAlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

export default ZoomControls