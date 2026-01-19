import { useState, useEffect } from 'react'
import { TrendingUp, CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react'

const Analytics = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0
  })
  const [completionRate, setCompletionRate] = useState(0)
  const [weeklyData, setWeeklyData] = useState([])

  useEffect(() => {
    const savedBoards = localStorage.getItem('taskflow_boards')
    if (savedBoards) {
      const boards = JSON.parse(savedBoards)
      let total = 0
      let completed = 0
      let inProgress = 0
      let pending = 0

      boards.forEach(board => {
        const savedTasks = localStorage.getItem(`taskflow_tasks_${board.id}`)
        if (savedTasks) {
          const tasks = JSON.parse(savedTasks)
          total += tasks.length
          completed += tasks.filter(t => t.columnId === 'done').length
          inProgress += tasks.filter(t => t.columnId === 'inprogress').length
          pending += tasks.filter(t => t.columnId === 'todo').length
        }
      })

      setStats({
        totalTasks: total,
        completedTasks: completed,
        inProgressTasks: inProgress,
        pendingTasks: pending
      })

      setCompletionRate(total > 0 ? Math.round((completed / total) * 100) : 0)
    }

    const savedWeeklyData = localStorage.getItem('taskflow_weekly_data')
    if (savedWeeklyData) {
      setWeeklyData(JSON.parse(savedWeeklyData))
    } else {
      const defaultWeeklyData = [
        { day: '周一', completed: 5, created: 8 },
        { day: '周二', completed: 7, created: 10 },
        { day: '周三', completed: 4, created: 6 },
        { day: '周四', completed: 6, created: 9 },
        { day: '周五', completed: 8, created: 12 },
        { day: '周六', completed: 3, created: 5 },
        { day: '周日', completed: 2, created: 4 }
      ]
      setWeeklyData(defaultWeeklyData)
      localStorage.setItem('taskflow_weekly_data', JSON.stringify(defaultWeeklyData))
    }
  }, [])

  const statCards = [
    {
      icon: CheckCircle2,
      label: '已完成',
      value: stats.completedTasks,
      color: 'bg-green-500',
      bgLight: 'bg-green-50'
    },
    {
      icon: Clock,
      label: '进行中',
      value: stats.inProgressTasks,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50'
    },
    {
      icon: AlertCircle,
      label: '待办',
      value: stats.pendingTasks,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50'
    },
    {
      icon: TrendingUp,
      label: '完成率',
      value: `${completionRate}%`,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50'
    }
  ]

  const maxTasksCreated = Math.max(...weeklyData.map(d => d.created), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">数据分析</h1>
        <p className="text-gray-600 mt-1">查看任务和工作流的数据洞察</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgLight}`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">周任务趋势</h2>
          </div>

          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{day.day}</span>
                  <div className="flex space-x-4 text-gray-600">
                    <span>创建: {day.created}</span>
                    <span>完成: {day.completed}</span>
                  </div>
                </div>
                <div className="relative h-6 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-blue-500 rounded-lg transition-all duration-500"
                    style={{ width: `${(day.created / maxTasksCreated) * 100}%` }}
                  ></div>
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500 rounded-lg transition-all duration-500"
                    style={{ width: `${(day.completed / maxTasksCreated) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600">创建的任务</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">完成的任务</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">任务状态分布</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">待办任务</span>
                <span className="font-medium text-gray-900">
                  {stats.totalTasks > 0 ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.totalTasks > 0 ? (stats.pendingTasks / stats.totalTasks) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">进行中</span>
                <span className="font-medium text-gray-900">
                  {stats.totalTasks > 0 ? Math.round((stats.inProgressTasks / stats.totalTasks) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.totalTasks > 0 ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">已完成</span>
                <span className="font-medium text-gray-900">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">整体完成率</p>
              <p className="text-4xl font-bold text-blue-600">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">效率洞察</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">高效时段</h3>
            <p className="text-sm text-green-700">根据数据分析，周一至周五是任务完成的高峰期，建议安排重要任务。</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">改进建议</h3>
            <p className="text-sm text-blue-700">待办任务较多，建议优先处理高优先级任务，减少积压。</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">团队协作</h3>
            <p className="text-sm text-purple-700">工作流执行良好，继续优化流程以提高效率。</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
