import { useState } from 'react';
import { Shuffle, RotateCcw, Clock, Target } from 'lucide-react';

export default function TaskGenerator({ taskTypes, onGenerate, onReset }) {
  const [selectedTypes, setSelectedTypes] = useState(Object.keys(taskTypes));
  const [selectedPriorities, setSelectedPriorities] = useState([1, 2, 3]);
  const [maxTasks, setMaxTasks] = useState(5);

  const categories = Object.keys(taskTypes);

  const toggleCategory = (category) => {
    setSelectedTypes(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePriority = (priority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const generateTasks = () => {
    const availableTasks = [];
    
    selectedTypes.forEach(category => {
      const tasks = taskTypes[category].filter(task =>
        selectedPriorities.includes(task.priority)
      );
      availableTasks.push(...tasks);
    });

    if (availableTasks.length === 0) {
      alert('没有符合条件的任务，请调整筛选条件');
      return;
    }

    const shuffled = [...availableTasks].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, maxTasks);
    
    onGenerate(selected);
  };

  const resetGenerator = () => {
    setSelectedTypes(categories);
    setSelectedPriorities([1, 2, 3]);
    setMaxTasks(5);
    onReset();
  };

  const totalAvailable = Object.entries(taskTypes).reduce((sum, [category, tasks]) => {
    if (selectedTypes.includes(category)) {
      return sum + tasks.filter(task => selectedPriorities.includes(task.priority)).length;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Target className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">任务生成器</h3>
            <p className="text-sm opacity-90">智能随机生成今日任务清单</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">选择任务分类</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedTypes.includes(category)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">优先级筛选</label>
          <div className="flex space-x-3">
            {[
              { value: 1, label: '高', color: 'bg-red-100 text-red-700' },
              { value: 2, label: '中', color: 'bg-yellow-100 text-yellow-700' },
              { value: 3, label: '低', color: 'bg-green-100 text-green-700' }
            ].map(p => (
              <button
                key={p.value}
                onClick={() => togglePriority(p.value)}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  selectedPriorities.includes(p.value)
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            最大任务数量：{maxTasks}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={maxTasks}
            onChange={(e) => setMaxTasks(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>可选任务数：{totalAvailable}</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={generateTasks}
          disabled={totalAvailable === 0}
          className="flex-1 flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shuffle className="w-6 h-6" />
          <span>生成任务</span>
        </button>

        <button
          onClick={resetGenerator}
          className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {totalAvailable === 0 && categories.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800 font-medium">没有符合条件的任务</p>
          <p className="text-yellow-600 text-sm mt-1">请选择任务分类和优先级</p>
        </div>
      )}
    </div>
  );
}
