import { Link } from 'react-router-dom'
import { ThermometerSun, CloudRain, Wind, Droplets, ArrowRight } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: ThermometerSun,
      title: '实时天气',
      description: '查看当前温度、湿度和风速'
    },
    {
      icon: CloudRain,
      title: '天气预报',
      description: '7天天气预报，提前规划行程'
    },
    {
      icon: Wind,
      title: '空气质量',
      description: '实时空气质量指数和健康建议'
    },
    {
      icon: Droplets,
      title: '多城市管理',
      description: '管理多个城市的天气信息'
    }
  ]

  return (
    <div className="space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          U-WeatherStation
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          现代化的天气监测平台，实时掌握天气变化
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/current"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>查看天气</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/forecast"
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            查看预报
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            立即开始查看天气信息
          </h2>
          <p className="text-lg mb-6 opacity-90">
            添加您的城市，获取精准的天气数据和预报
          </p>
          <Link
            to="/settings"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            添加城市
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
