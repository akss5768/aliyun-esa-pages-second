import { useState, useEffect, useRef } from 'react'
import { Monitor, Tablet, Smartphone, RotateCw, AlertCircle, Shield } from 'lucide-react'

// CORS代理服务配置
const CORS_PROXIES = [
  {
    name: 'AllOrigins',
    url: 'https://api.allorigins.win/raw?url=',
    description: '免费CORS代理,支持大多数网站'
  },
  {
    name: 'CORS Anywhere',
    url: 'https://cors-anywhere.herokuapp.com/',
    description: '需临时访问demo页面授权'
  },
  {
    name: 'CorsProxy',
    url: 'https://corsproxy.io/?',
    description: '高性能代理,支持多种格式'
  }
]

function ResponsiveTest() {
  const [selectedDevice, setSelectedDevice] = useState('desktop')
  const [customWidth, setCustomWidth] = useState(1920)
  const [customHeight, setCustomHeight] = useState(1080)
  const [url, setUrl] = useState('https://www.baidu.com')
  const [proxyUrl, setProxyUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedProxy, setSelectedProxy] = useState(0)
  const iframeRef = useRef(null)

  const proxyConfig = CORS_PROXIES[selectedProxy]

  const fetchPageWithProxy = async () => {
    if (!url) return
    
    setLoading(true)
    setError('')
    
    try {
      const proxyFetchUrl = proxyConfig.url + encodeURIComponent(url)
      const response = await fetch(proxyFetchUrl)
      
      if (!response.ok) {
        throw new Error(`代理请求失败: ${response.status}`)
      }
      
      const html = await response.text()
      
      // 处理相对路径,将资源链接转换为绝对路径
      const processedHtml = processHTMLResources(html, url)
      
      const blob = new Blob([processedHtml], { type: 'text/html' })
      const objectUrl = URL.createObjectURL(blob)
      setProxyUrl(objectUrl)
      
      return () => URL.revokeObjectURL(objectUrl)
    } catch (err) {
      setError(`加载失败: ${err.message}. 尝试切换其他代理服务`)
      setProxyUrl('')
    } finally {
      setLoading(false)
    }
  }

  const processHTMLResources = (html, baseUrl) => {
    try {
      const urlObj = new URL(baseUrl)
      const domain = urlObj.origin
      
      // 替换相对链接为绝对链接
      let processed = html
        .replace(/href=["']([^"']+)["']/g, (match, href) => {
          if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return match
          }
          const fullUrl = href.startsWith('/') ? `${domain}${href}` : `${domain}/${href}`
          return `href="${fullUrl}"`
        })
        .replace(/src=["']([^"']+)["']/g, (match, src) => {
          if (src.startsWith('http') || src.startsWith('data:')) {
            return match
          }
          const fullUrl = src.startsWith('/') ? `${domain}${src}` : `${domain}/${src}`
          return `src="${fullUrl}"`
        })
        .replace(/<base[^>]*>/gi, '')
      
      // 添加base标签
      const baseTag = `<base href="${baseUrl}">`
      if (processed.includes('<head>')) {
        processed = processed.replace('<head>', `<head>${baseTag}`)
      } else if (processed.includes('<html>')) {
        processed = processed.replace('<html>', `<html><head>${baseTag}</head>`)
      } else {
        processed = baseTag + processed
      }
      
      return processed
    } catch (e) {
      console.error('处理HTML资源失败:', e)
      return html
    }
  }

  useEffect(() => {
    fetchPageWithProxy()
  }, [url, selectedProxy])

  const handleRefresh = () => {
    fetchPageWithProxy()
  }

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl)
  }

  const devices = [
    { id: 'desktop', name: '桌面', icon: Monitor, width: 1920, height: 1080 },
    { id: 'laptop', name: '笔记本', icon: Monitor, width: 1366, height: 768 },
    { id: 'tablet', name: '平板', icon: Tablet, width: 768, height: 1024 },
    { id: 'mobile', name: '手机', icon: Smartphone, width: 375, height: 667 }
  ]

  const currentDevice = devices.find(d => d.id === selectedDevice)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <header className="bg-white shadow-lg rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          响应式设计测试
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">设备选择</h2>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {devices.map(device => {
              const Icon = device.icon
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device.id)}
                  className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    selectedDevice === device.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={32} />
                  <span className="text-sm">{device.name}</span>
                  <span className="text-xs opacity-80">{device.width}x{device.height}</span>
                </button>
              )
            })}
          </div>

          <h2 className="text-lg font-bold mb-4">自定义尺寸</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">宽度</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">高度</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              onClick={() => setSelectedDevice('custom')}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              应用自定义尺寸
            </button>
          </div>

          <h2 className="text-lg font-bold mb-4 mt-6">CORS代理</h2>
          <div className="space-y-2 mb-4">
            {CORS_PROXIES.map((proxy, index) => (
              <button
                key={proxy.name}
                onClick={() => setSelectedProxy(index)}
                className={`w-full p-3 text-left rounded-lg transition-all ${
                  selectedProxy === index
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield size={16} className={selectedProxy === index ? 'text-green-600' : 'text-gray-500'} />
                  <span className="font-semibold text-sm">{proxy.name}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{proxy.description}</p>
              </button>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-4">测试URL</h2>
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="输入URL (支持HTTP/HTTPS)"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
            刷新页面
          </button>
          
          {error && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-2">💡 使用说明:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>选择不同的CORS代理服务</li>
              <li>支持HTTP和HTTPS协议</li>
              <li>自动处理页面中的资源链接</li>
              <li>部分网站可能有其他安全限制</li>
              <li>如果加载失败,尝试切换代理服务</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white shadow-lg rounded-2xl p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">预览</h2>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {proxyConfig.name}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {selectedDevice === 'custom'
                ? `${customWidth} x ${customHeight}`
                : `${currentDevice.width} x ${currentDevice.height}`}
            </div>
          </div>
          <div className="flex justify-center bg-gray-100 rounded-xl p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                <p>正在通过{proxyConfig.name}加载页面...</p>
              </div>
            ) : proxyUrl ? (
              <iframe
                ref={iframeRef}
                src={proxyUrl}
                className="bg-white shadow-2xl transition-all duration-300"
                style={{
                  width: selectedDevice === 'custom' ? customWidth : currentDevice.width,
                  height: selectedDevice === 'custom' ? customHeight : currentDevice.height,
                  maxWidth: '100%'
                }}
                title="Responsive Preview"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation"
                allowFullScreen
              />
            ) : (
              <div className="text-center text-gray-500 py-20">
                <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg">页面加载失败</p>
                <p className="text-sm mt-2">请检查URL或尝试其他代理服务</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveTest
