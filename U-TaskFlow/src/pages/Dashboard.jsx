import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MoreVertical, Trash2, Kanban } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [boards, setBoards] = useState([])
  const [showNewBoardModal, setShowNewBoardModal] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [showMenu, setShowMenu] = useState(null)

  useEffect(() => {
    const savedBoards = localStorage.getItem('taskflow_boards')
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards))
    } else {
      const defaultBoards = [
        {
          id: '1',
          name: '项目规划',
          description: '主要项目的规划和跟踪',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: '团队任务',
          description: '日常团队协作任务',
          createdAt: new Date().toISOString()
        }
      ]
      setBoards(defaultBoards)
      localStorage.setItem('taskflow_boards', JSON.stringify(defaultBoards))
    }
  }, [])

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return

    const newBoard = {
      id: Date.now().toString(),
      name: newBoardName,
      description: '自定义任务板',
      createdAt: new Date().toISOString()
    }

    const updatedBoards = [...boards, newBoard]
    setBoards(updatedBoards)
    localStorage.setItem('taskflow_boards', JSON.stringify(updatedBoards))

    setNewBoardName('')
    setShowNewBoardModal(false)
  }

  const handleDeleteBoard = (boardId, e) => {
    e.stopPropagation()
    if (window.confirm('确定要删除这个任务板吗？')) {
      const updatedBoards = boards.filter(b => b.id !== boardId)
      setBoards(updatedBoards)
      localStorage.setItem('taskflow_boards', JSON.stringify(updatedBoards))
    }
    setShowMenu(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600 mt-1">管理您的任务板和工作流</p>
        </div>
        <button
          onClick={() => setShowNewBoardModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>创建任务板</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <Link
            key={board.id}
            to={`/board/${board.id}`}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 group relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <Kanban className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {board.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(board.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(showMenu === board.id ? null : board.id)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600">{board.description}</p>

            {showMenu === board.id && (
              <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg border py-2 z-10">
                <button
                  onClick={(e) => handleDeleteBoard(board.id, e)}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>删除</span>
                </button>
              </div>
            )}
          </Link>
        ))}

        <button
          onClick={() => setShowNewBoardModal(true)}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all min-h-[200px]"
        >
          <Plus className="w-12 h-12 text-gray-400 mb-4" />
          <span className="text-gray-600 font-medium">创建新任务板</span>
        </button>
      </div>

      {showNewBoardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">创建新任务板</h2>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="输入任务板名称"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowNewBoardModal(false)
                  setNewBoardName('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateBoard}
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

export default Dashboard
