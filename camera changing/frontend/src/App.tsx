import { useState } from 'react'
import CameraPreview from './components/CameraPreview'
import ZoomControls from './components/ZoomControls'
import StatusIndicator from './components/StatusIndicator'
import { CameraState, DEFAULT_ZOOM_SETTINGS } from './types/camera'

function App() {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    zoomLevel: DEFAULT_ZOOM_SETTINGS.defaultValue,
    isProcessing: false,
    error: null,
  })

  const handleZoomChange = (zoomLevel: number) => {
    setCameraState(prev => ({ ...prev, zoomLevel }))
  }

  const handleCameraToggle = () => {
    setCameraState(prev => ({ 
      ...prev, 
      isActive: !prev.isActive,
      error: null 
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Psygo AI Camera</h1>
              <p className="text-gray-400 mt-1">AI-powered zoom enhancement</p>
            </div>
            <StatusIndicator state={cameraState} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left panel - Camera preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Camera Preview</h2>
              <CameraPreview 
                isActive={cameraState.isActive}
                zoomLevel={cameraState.zoomLevel}
                onCameraToggle={handleCameraToggle}
              />
            </div>
          </div>

          {/* Right panel - Controls */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Zoom Controls</h2>
              <ZoomControls
                zoomLevel={cameraState.zoomLevel}
                onZoomChange={handleZoomChange}
                settings={DEFAULT_ZOOM_SETTINGS}
              />
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">AI Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enhancement Level
                  </label>
                  <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
                    <option value="low">Low (Fast)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="high">High (Quality)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Processing Mode
                  </label>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                      Real-time
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition">
                      Batch
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Turn on camera to start preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Adjust zoom level with the slider</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>AI will enhance zoomed images automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Check status indicator for processing info</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Psygo AI Camera v0.1.0 • React + FastAPI + MySQL • AI-powered zoom enhancement</p>
          <p className="mt-2 text-sm">Team: Arnaldo (PM), Cindy, Bob, LiHua</p>
        </div>
      </footer>
    </div>
  )
}

export default App