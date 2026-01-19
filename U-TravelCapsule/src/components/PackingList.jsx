import { useState } from 'react';
import { Package, Check, Plus, Trash2 } from 'lucide-react';

export default function PackingList({ packingList, onUpdate }) {
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(packingList)[0] || ''
  );

  const toggleItem = (category, itemId) => {
    const updatedList = {
      ...packingList,
      [category]: packingList[category].map(item =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    };
    onUpdate(updatedList);
  };

  const addItem = (category) => {
    const itemName = prompt('请输入物品名称：');
    if (itemName && itemName.trim()) {
      const newItem = {
        id: Date.now(),
        item: itemName.trim(),
        quantity: 1,
        packed: false
      };
      const updatedList = {
        ...packingList,
        [category]: [...packingList[category], newItem]
      };
      onUpdate(updatedList);
    }
  };

  const removeItem = (category, itemId) => {
    const updatedList = {
      ...packingList,
      [category]: packingList[category].filter(item => item.id !== itemId)
    };
    onUpdate(updatedList);
  };

  const updateQuantity = (category, itemId, quantity) => {
    if (quantity < 1) return;
    const updatedList = {
      ...packingList,
      [category]: packingList[category].map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    };
    onUpdate(updatedList);
  };

  const calculateProgress = () => {
    let total = 0;
    let packed = 0;
    Object.values(packingList).forEach(items => {
      total += items.length;
      packed += items.filter(item => item.packed).length;
    });
    return total === 0 ? 0 : Math.round((packed / total) * 100);
  };

  const progress = calculateProgress();

  if (!packingList || Object.keys(packingList).length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">暂无打包清单</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">打包进度</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-white/20 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-bold text-2xl">{progress}%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.keys(packingList).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category} ({packingList[category].length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{selectedCategory}</h3>
          <button
            onClick={() => addItem(selectedCategory)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" />
            <span>添加</span>
          </button>
        </div>

        <div className="space-y-3">
          {packingList[selectedCategory]?.map(item => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition ${
                item.packed 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleItem(selectedCategory, item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    item.packed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {item.packed && <Check className="w-4 h-4" />}
                </button>

                <span className={`font-medium ${item.packed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {item.item}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(selectedCategory, item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(selectedCategory, item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(selectedCategory, item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
