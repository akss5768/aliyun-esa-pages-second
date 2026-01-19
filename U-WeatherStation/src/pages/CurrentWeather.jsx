import { useState, useEffect } from 'react'
import { MapPin, Wind, Droplets, Eye, Thermometer, Clock } from 'lucide-react'

const CurrentWeather = () => {
  const [selectedCity, setSelectedCity] = useState(null)
  const [cities, setCities] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCityName, setNewCityName] = useState('')

  useEffect(() => {
    const savedCities = localStorage.getItem('weather_cities')
    if (savedCities) {
      const parsedCities = JSON.parse(savedCities)
      setCities(parsedCities)
      if (parsedCities.length > 0) {
        setSelectedCity(parsedCities[0])
      }
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
      setSelectedCity(defaultCities[0])
      localStorage.setItem('weather_cities', JSON.stringify(defaultCities))
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
    setSelectedCity(newCity)
  }

  const handleDeleteCity = (cityId) => {
    if (window.confirm('确定要删除这个城市吗？')) {
      const updatedCities = cities.filter(c => c.id !== cityId)
      setCities(updatedCities)
      localStorage.setItem('weather_cities', JSON.stringify(updatedCities))

      if (selectedCity && selectedCity.id === cityId && updatedCities.length > 0) {
        setSelectedCity(updatedCities[0])
      }
    }
  }

  if (!selectedCity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">暂无城市数据，请添加城市</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">当前天气</h1>
          <p className="text-gray-600 mt-1">查看实时天气信息</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          添加城市
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div
            key={city.id}
            onClick={() => setSelectedCity(city)}
            className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              selectedCity.id === city.id
                ? 'ring-4 ring-blue-500'
                : 'hover:shadow-xl'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">{city.name}</h3>
              </div>
              {cities.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteCity(city.id)
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-5xl">{city.icon}</span>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">{city.temp}°C</div>
                <div className="text-gray-600">{city.condition}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCity && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCity.name} - 详细信息
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Thermometer className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{selectedCity.temp}°C</div>
              <div className="text-sm text-gray-600">温度</div>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <Droplets className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
              <div className="text-2xl font-bold text-gray-900">{selectedCity.humidity}%</div>
              <div className="text-sm text-gray-600">湿度</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <Wind className="w-8 h-8 mx-auto mb-2 text-teal-600" />
              <div className="text-2xl font-bold text-gray-900">{selectedCity.wind} km/h</div>
              <div className="text-sm text-gray-600">风速</div>
            </div>
            <div className="text-center p-4 bg-sky-50 rounded-lg">
              <Eye className="w-8 h-8 mx-auto mb-2 text-sky-600" />
              <div className="text-2xl font-bold text-gray-900">{selectedCity.visibility} km</div>
              <div className="text-sm text-gray-600">能见度</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <div className="text-lg font-bold text-gray-900">{new Date(selectedCity.lastUpdate).toLocaleTimeString('zh-CN')}</div>
              <div className="text-sm text-gray-600">更新时间</div>
            </div>
          </div>
        </div>
      )}

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

export default CurrentWeather
