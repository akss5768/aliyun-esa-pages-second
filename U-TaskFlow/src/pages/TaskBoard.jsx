import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, ArrowLeft, Trash2, Edit2, Save, X } from 'lucide-react'

const TaskBoard = () => {
  const { boardId } = useParams()
  const [board, setBoard] = useState(null)
  const [tasks, setTasks] = useState([])
  const [columns, setColumns] = useState([])
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    const savedBoards = localStorage.getItem('taskflow_boards')
    if (savedBoards) {
      const boards = JSON.parse(savedBoards)
      const foundBoard = boards.find(b => b.id === boardId)
      if (foundBoard) {
        setBoard(foundBoard)
      }
    }

    const savedTasks = localStorage.getItem(`taskflow_tasks_${boardId}`)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      const defaultTasks = [
        {
          id: '1',
          title: '需求分析',
          description: '分析产品需求和用户故事',
          columnId: 'todo',
          priority: 'high'
        },
        {
          id: '2',
          title: '原型设计',
          description: '创建交互原型和线框图',
          columnId: 'inprogress',
          priority: 'medium'
        },
        {
          id: '3',
          title: '开发实现',
          description: '根据设计文档进行开发',
          columnId: 'inprogress',
          priority: 'high'
        },
        {
          id: '4',
          title: '测试验证',
          description: '执行测试用例并修复问题',
          columnId: 'review',
          priority: 'medium'
        },
        {
          id: '5',
          title: '上线部署',
          description: '部署到生产环境',
          columnId: 'done',
          priority: 'high'
        }
      ]
      setTasks(defaultTasks)
      localStorage.setItem(`taskflow_tasks_${boardId}`, JSON.stringify(defaultTasks))
    }

    const savedColumns = localStorage.getItem(`taskflow_columns_${boardId}`)
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns))
    } else {
      const defaultColumns = [
        { id: 'todo', name: '待办', color: 'bg-gray-100' },
        { id: 'inprogress', name: '进行中', color: 'bg-blue-100' },
        { id: 'review', name: '审核中', color: 'bg-yellow-100' },
        { id: 'done', name: '已完成', color: 'bg-green-100' }
      ]
      setColumns(defaultColumns)
      localStorage.setItem(`taskflow_columns_${boardId}`, JSON.stringify(defaultColumns))
    }
  }, [boardId])

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !selectedColumn) return

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      columnId: selectedColumn,
      priority: 'medium'
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem(`taskflow_tasks_${boardId}`, JSON.stringify(updatedTasks))

    setNewTaskTitle('')
    setNewTaskDescription('')
    setSelectedColumn(null)
    setShowNewTaskModal(false)
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm('确定要删除这个任务吗？')) {
      const updatedTasks = tasks.filter(t => t.id !== taskId)
      setTasks(updatedTasks)
      localStorage.setItem(`taskflow_tasks_${boardId}`, JSON.stringify(updatedTasks))
    }
  }

  const handleMoveTask = (taskId, newColumnId) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, columnId: newColumnId } : t
    )
    setTasks(updatedTasks)
    localStorage.setItem(`taskflow_tasks_${boardId}`, JSON.stringify(updatedTasks))
  }

  const handleUpdateTask = () => {
    const updatedTasks = tasks.map(t =>
      t.id === editingTask.id
        ? { ...t, title: editingTask.title, description: editingTask.description }
        : t
    )
    setTasks(updatedTasks)
    localStorage.setItem(`taskflow_tasks_${boardId}`, JSON.stringify(updatedTasks))
    setEditingTask(null)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!board) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">加载中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{board.name}</h1>
            <p className="text-gray-600">{board.description}</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>添加任务</span>
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-6 pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`${column.color} rounded-t-lg px-4 py-3`}>
              <h3 className="font-semibold text-gray-900">{column.name}</h3>
              <span className="text-sm text-gray-600">
                {tasks.filter(t => t.columnId === column.id).length} 个任务
              </span>
            </div>
            <div className="bg-white rounded-b-lg shadow-lg min-h-[400px] p-4 space-y-3">
              {tasks.filter(t => t.columnId === column.id).map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingTask?.id === task.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateTask}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                          <span>保存</span>
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                          <span>取消</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
                        </span>
                        <select
                          value={task.columnId}
                          onChange={(e) => handleMoveTask(task.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {columns.map(col => (
                            <option key={col.id} value={col.id}>{col.name}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">创建新任务</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="任务标题"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="任务描述"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择状态
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {columns.map((column) => (
                    <button
                      key={column.id}
                      onClick={() => setSelectedColumn(column.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedColumn === column.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {column.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowNewTaskModal(false)
                  setNewTaskTitle('')
                  setNewTaskDescription('')
                  setSelectedColumn(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskBoard
