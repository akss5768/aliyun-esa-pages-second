import { useState } from 'react';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import { priorityLabels } from '../data/sampleData';

export default function TaskManager({ taskTypes, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    category: '工作',
    priority: 2,
    estimatedTime: 30
  });

  const categories = Object.keys(taskTypes);

  const addTask = () => {
    if (newTask.name) {
      const updatedTypes = {
        ...taskTypes,
        [newTask.category]: [
          ...taskTypes[newTask.category],
          { ...newTask, id: Date.now() }
        ]
      };
      onUpdate(updatedTypes);
      setNewTask({ name: '', category: '工作', priority: 2, estimatedTime: 30 });
      setShowAddForm(false);
    }
  };

  const updateTask = () => {
    if (editingTask && newTask.name) {
      const updatedTypes = {
        ...taskTypes,
        [editingTask.category]: taskTypes[editingTask.category].map(task =>
          task.id === editingTask.id ? { ...newTask, id: editingTask.id } : task
        )
      };
      onUpdate(updatedTypes);
      setEditingTask(null);
      setNewTask({ name: '', category: '工作', priority: 2, estimatedTime: 30 });
      setShowAddForm(false);
    }
  };

  const deleteTask = (category, taskId) => {
    const updatedTypes = {
      ...taskTypes,
      [category]: taskTypes[category].filter(task => task.id !== taskId)
    };
    onUpdate(updatedTypes);
  };

  const editTask = (category, task) => {
    setEditingTask(task);
    setNewTask({ name: task.name, category: task.category, priority: task.priority, estimatedTime: task.estimatedTime });
    setShowAddForm(true);
  };

  const filteredTypes = categories.reduce((acc, category) => {
    const filtered = taskTypes[category].filter(task =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  const totalTasks = Object.values(taskTypes).flat().length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">任务库管理</h3>
            <p className="text-sm opacity-90">共 {totalTasks} 个任务</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <Plus className="w-5 h-5" />
            <span>添加任务</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h4 className="font-bold text-gray-800">
            {editingTask ? '编辑任务' : '添加新任务'}
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              placeholder="如：阅读技术文档"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 1, label: '高', color: 'bg-red-100 text-red-700' },
                { value: 2, label: '中', color: 'bg-yellow-100 text-yellow-700' },
                { value: 3, label: '低', color: 'bg-green-100 text-green-700' }
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => setNewTask({ ...newTask, priority: p.value })}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    newTask.priority === p.value
                      ? p.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              预计时间：{newTask.estimatedTime} 分钟
            </label>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={newTask.estimatedTime}
              onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={editingTask ? updateTask : addTask}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              {editingTask ? '更新' : '添加'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingTask(null);
                setNewTask({ name: '', category: '工作', priority: 2, estimatedTime: 30 });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索任务..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(filteredTypes).map(([category, tasks]) => (
          <div key={category} className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>{category}</span>
              <span className="text-sm font-normal text-gray-500">{tasks.length} 个任务</span>
            </h4>

            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{task.name}</div>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        task.priority === 1 ? 'bg-red-100 text-red-700' :
                        task.priority === 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {priorityLabels[task.priority]}优先级
                      </span>
                      <span>预计 {task.estimatedTime} 分钟</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editTask(category, task)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTask(category, task.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
