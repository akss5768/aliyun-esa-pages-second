import { useState } from 'react';
import { Plus, Trash2, Edit, Search } from 'lucide-react';

export default function DishManager({ dishes, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [newDish, setNewDish] = useState({
    name: '',
    category: '中餐',
    rating: 3
  });

  const categories = Object.keys(dishes);

  const addDish = () => {
    if (newDish.name) {
      const updatedDishes = {
        ...dishes,
        [newDish.category]: [
          ...dishes[newDish.category],
          { ...newDish, id: Date.now() }
        ]
      };
      onUpdate(updatedDishes);
      setNewDish({ name: '', category: '中餐', rating: 3 });
      setShowAddForm(false);
    }
  };

  const updateDish = () => {
    if (editingDish && newDish.name) {
      const updatedDishes = {
        ...dishes,
        [editingDish.category]: dishes[editingDish.category].map(dish =>
          dish.id === editingDish.id ? { ...newDish, id: editingDish.id } : dish
        )
      };
      onUpdate(updatedDishes);
      setEditingDish(null);
      setNewDish({ name: '', category: '中餐', rating: 3 });
    }
  };

  const deleteDish = (category, dishId) => {
    const updatedDishes = {
      ...dishes,
      [category]: dishes[category].filter(dish => dish.id !== dishId)
    };
    onUpdate(updatedDishes);
  };

  const editDish = (category, dish) => {
    setEditingDish(dish);
    setNewDish({ name: dish.name, category: dish.category, rating: dish.rating });
    setShowAddForm(true);
  };

  const filteredDishes = categories.reduce((acc, category) => {
    const filtered = dishes[category].filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">菜品管理</h3>
            <p className="text-sm opacity-90">共 {Object.values(dishes).flat().length} 道菜品</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <Plus className="w-5 h-5" />
            <span>添加菜品</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h4 className="font-bold text-gray-800">
            {editingDish ? '编辑菜品' : '添加新菜品'}
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">菜品名称</label>
            <input
              type="text"
              value={newDish.name}
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
              placeholder="如：宫保鸡丁"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select
              value={newDish.category}
              onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">评分</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setNewDish({ ...newDish, rating })}
                  className={`w-10 h-10 rounded-lg transition ${
                    newDish.rating >= rating
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={editingDish ? updateDish : addDish}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              {editingDish ? '更新' : '添加'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingDish(null);
                setNewDish({ name: '', category: '中餐', rating: 3 });
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
            placeholder="搜索菜品..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(filteredDishes).map(([category, categoryDishes]) => (
          <div key={category} className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>{category}</span>
              <span className="text-sm font-normal text-gray-500">{categoryDishes.length} 道菜品</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryDishes.map(dish => (
                <div
                  key={dish.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{dish.name}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={`text-sm ${star <= dish.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editDish(category, dish)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteDish(category, dish.id)}
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
