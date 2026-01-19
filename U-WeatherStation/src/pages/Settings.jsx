import { useState, useEffect } from 'react'
import { Save, Trash2, Plus, Thermometer, Gauge, Cloud } from 'lucide-react'

const Settings = () => {
  const [cities, setCities] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCityName, setNewCityName] = useState('')
  const [temperatureUnit, setTemperatureUnit] = useState('celsius')
  const [windSpeedUnit, setWindSpeedUnit] = useState('kmh')

  useEffect(() => {
    const savedCities = localStorage.getItem('weather_cities')
    if (savedCities) {
      setCities(JSON.parse(savedCities))
    } else {
      const defaultCities = [
        {
          id: '1',
          name: '北京',
          temp: 15,
          humidity: 65,
          wind: 12,
          visibility: 10,
          pressure: 1013,
          condition: '晴',
          icon: '☀️',
          lastUpdate: new Date().toISOString()
        },
        {
          id: '2',
          name: '上海',
          temp: 18,
          humidity: 70,
          wind: 15,
          visibility: 8,
          pressure: 1015,
          condition: '多云',
          icon: '⛅',
          lastUpdate: new Date().toISOString()
        }
      ]
      setCities(defaultCities)
    }

    const savedSettings = localStorage.getItem('weather_settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setTemperatureUnit(settings.temperatureUnit || 'celsius')
      setWindSpeedUnit(settings.windSpeedUnit || 'kmh')
    }
  }, [])

  const handleAddCity = () => {
    if (!newCityName.trim()) return

    const newCity = {
      id: Date.now().toString(),
      name: newCityName,
      temp: Math.floor(Math.random() * 20) + 10,
      humidity: Math.floor(Math.random() * 40) + 40,
      wind: Math.floor(Math.random() * 20) + 5,
      visibility: Math.floor(Math.random() * 10) + 5,
      pressure: Math.floor(Math.random() * 30) + 1000,
      condition: ['晴', '多云', '阴', '小雨', '中雨'][Math.floor(Math.random() * 5)],
      icon: ['☀️', '⛅', '☁️', '🌧️', '🌧️'][Math.floor(Math.random() * 5)],
      lastUpdate: new Date().toISOString()
    }

    const updatedCities = [...cities, newCity]
    setCities(updatedCities)
    localStorage.setItem('weather_cities', JSON.stringify(updatedCities))

    setNewCityName('')
    setShowAddModal(false)
  }

  const handleDeleteCity = (cityId) => {
    if (window.confirm('确定要删除这个城市吗？')) {
      if (cities.length <= 1) {
        alert('至少保留一个城市')
        return
      }

      const updatedCities = cities.filter(c => c.id !== cityId)
      setCities(updatedCities)
      localStorage.setItem('weather_cities', JSON.stringify(updatedCities))
    }
  }

  const handleSaveSettings = () => {
    const settings = {
      temperatureUnit,
      windSpeedUnit
    }
    localStorage.setItem('weather_settings', JSON.stringify(settings))
    alert('设置已保存')
  }

  const handleClearAllData = () => {
    if (window.confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      localStorage.removeItem('weather_cities')
      localStorage.removeItem('weather_forecasts')
      localStorage.removeItem('weather_settings')
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-600 mt-1">管理城市和应用设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">城市管理</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>添加城市</span>
            </button>
          </div>

          <div className="space-y-3">
            {cities.map((city) => (
              <div
                key={city.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{city.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-600">
                      {city.condition} · {city.temp}°C
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCity(city.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={cities.length <= 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">单位设置</h2>
              <button
                onClick={handleSaveSettings}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>保存设置</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">温度单位</div>
                    <div className="text-sm text-gray-600">选择温度显示单位</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTemperatureUnit('celsius')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      temperatureUnit === 'celsius'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-200'
                    }`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setTemperatureUnit('fahrenheit')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      temperatureUnit === 'fahrenheit'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-200'
                    }`}
                  >
                    °F
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Gauge className="w-5 h-5 text-cyan-600" />
                  <div>
                    <div className="font-medium text-gray-900">风速单位</div>
                    <div className="text-sm text-gray-600">选择风速显示单位</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setWindSpeedUnit('kmh')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      windSpeedUnit === 'kmh'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-200'
                    }`}
                  >
                    km/h
                  </button>
                  <button
                    onClick={() => setWindSpeedUnit('mph')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      windSpeedUnit === 'mph'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-200'
                    }`}
                  >
                    mph
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">数据管理</h2>
            <div className="space-y-3">
              <button
                onClick={handleClearAllData}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>清除所有数据</span>
              </button>
              <p className="text-sm text-gray-600 text-center">
                此操作将删除所有城市和设置数据，不可恢复
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">添加城市</h2>
            <input
              type="text"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="输入城市名称"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewCityName('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddCity}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
