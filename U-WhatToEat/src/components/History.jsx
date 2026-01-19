import { useState } from 'react';
import { History as HistoryIcon, Star, Trash2, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function History({ history, onUpdate }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredHistory = [...history]
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  const categories = ['all', '中餐', '西餐', '日韩料理', '快餐', '素食'];

  const deleteHistoryItem = (id) => {
    onUpdate(history.filter(item => item.id !== id));
  };

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">暂无历史记录</p>
        <p className="text-sm">推荐菜品后会自动保存到历史记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">历史记录</h3>
            <p className="text-sm opacity-90">共 {history.length} 次记录</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">筛选：</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filterCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? '全部' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">排序：</span>
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              sortBy === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            按日期
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              sortBy === 'rating' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            按评分
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredHistory.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.category === '中餐' ? 'bg-red-100 text-red-700' :
                    item.category === '西餐' ? 'bg-blue-100 text-blue-700' :
                    item.category === '日韩料理' ? 'bg-green-100 text-green-700' :
                    item.category === '快餐' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-800 mb-1">{item.dishName}</h4>

                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(item.date), 'yyyy-MM-dd')}</span>
                </div>

                {item.feedback && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">反馈：</span>
                      {item.feedback}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => deleteHistoryItem(item.id)}
                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && history.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">没有符合条件的记录</p>
        </div>
      )}
    </div>
  );
}
