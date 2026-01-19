import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Zap, Users, BarChart3 } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: '快速创建',
      description: '直观的界面，快速创建任务和工作流'
    },
    {
      icon: Users,
      title: '团队协作',
      description: '轻松分配任务，跟踪团队进度'
    },
    {
      icon: BarChart3,
      title: '数据洞察',
      description: '可视化分析，优化工作效率'
    },
    {
      icon: CheckCircle2,
      title: '任务管理',
      description: '看板视图，拖拽操作，状态追踪'
    }
  ]

  return (
    <div className="space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">
          U-TaskFlow
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          现代化的任务流协作管理平台，让团队协作更高效
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>开始使用</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/workflow"
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            创建工作流
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

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            立即开始提升团队效率
          </h2>
          <p className="text-lg mb-6 opacity-90">
            创建第一个任务板，体验流畅的协作流程
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            立即开始
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
