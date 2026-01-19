import { useState, useEffect } from 'react'
import { MapPin, Calendar } from 'lucide-react'

const Forecast = () => {
  const [selectedCity, setSelectedCity] = useState(null)
  const [cities, setCities] = useState([])
  const [forecasts, setForecasts] = useState({})

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

    const savedForecasts = localStorage.getItem('weather_forecasts')
    if (savedForecasts) {
      setForecasts(JSON.parse(savedForecasts))
    } else {
      const defaultForecasts = {}
      const defaultCities = ['北京', '上海', '广州', '深圳', '杭州']
      defaultCities.forEach(cityName => {
        defaultForecasts[cityName] = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tempHigh: Math.floor(Math.random() * 15) + 15,
          tempLow: Math.floor(Math.random() * 10) + 5,
          condition: ['晴', '多云', '阴', '小雨', '中雨'][Math.floor(Math.random() * 5)],
          icon: ['☀️', '⛅', '☁️', '🌧️', '🌧️'][Math.floor(Math.random() * 5)]
        }))
      })
      setForecasts(defaultForecasts)
      localStorage.setItem('weather_forecasts', JSON.stringify(defaultForecasts))
    }
  }, [])

  if (!selectedCity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">暂无城市数据</p>
      </div>
    )
  }

  const cityForecasts = forecasts[selectedCity.name] || []

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">天气预报</h1>
        <p className="text-gray-600 mt-1">查看7天天气预报</p>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              selectedCity.id === city.id
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{city.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">{selectedCity.name} - 未来7天</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {cityForecasts.map((day, index) => {
            const date = new Date(day.date)
            const dayName = index === 0 ? '今天' : weekDays[date.getDay()]
            const displayDate = `${date.getMonth() + 1}/${date.getDate()}`

            return (
              <div
                key={index}
                className={`p-4 rounded-lg text-center ${
                  index === 0
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm font-medium mb-2">{dayName}</div>
                <div className="text-xs opacity-75 mb-3">{displayDate}</div>
                <div className="text-4xl mb-3">{day.icon}</div>
                <div className="text-sm font-medium">{day.condition}</div>
                <div className="flex justify-center space-x-2 mt-2">
                  <span className="font-bold">{day.tempHigh}°</span>
                  <span className="opacity-75">{day.tempLow}°</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">详细预报</h2>
        </div>

        <div className="space-y-4">
          {cityForecasts.map((day, index) => {
            const date = new Date(day.date)
            const dayName = index === 0 ? '今天' : weekDays[date.getDay()]
            const displayDate = `${date.getMonth() + 1}月${date.getDate()}日`

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{day.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {dayName} {displayDate}
                    </div>
                    <div className="text-sm text-gray-600">{day.condition}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {day.tempHigh}°C
                    </div>
                    <div className="text-sm text-blue-600">
                      {day.tempLow}°C
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">天气预报说明</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>天气预报基于历史数据和模型预测，仅供参考</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>实际天气可能因突发气候变化而有所偏差</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>建议出行前查看实时天气信息</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Forecast
