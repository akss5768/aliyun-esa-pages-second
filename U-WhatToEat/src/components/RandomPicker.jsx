import { useState, useRef } from 'react';
import { Shuffle, RotateCcw, StopCircle, Star, CheckCircle, Filter } from 'lucide-react';

export default function RandomPicker({ dishes, onPick, onReset }) {
  const [selectedDish, setSelectedDish] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [excludedDishes, setExcludedDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const intervalRef = useRef(null);

  const allDishes = Object.values(dishes).flat();
  const availableDishes = allDishes.filter(dish => {
    const notExcluded = !excludedDishes.includes(dish.id);
    const categoryMatch = selectedCategory === 'all' || dish.category === selectedCategory;
    const ratingMatch = dish.rating >= minRating;
    return notExcluded && categoryMatch && ratingMatch;
  });

  const categories = ['all', '中餐', '西餐', '日韩料理', '快餐', '素食'];

  const pickRandom = () => {
    if (isAnimating) {
      // 停止随机
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsAnimating(false);
      if (selectedDish) {
        setExcludedDishes([...excludedDishes, selectedDish.id]);
        onPick(selectedDish); // 设置当前菜品
      }
    } else {
      // 开始随机
      if (availableDishes.length === 0) {
        alert('没有可选的菜品了，请重置！');
        return;
      }

      setIsAnimating(true);
      setSelectedDish(availableDishes[Math.floor(Math.random() * availableDishes.length)]);

      intervalRef.current = setInterval(() => {
        const randomDish = availableDishes[Math.floor(Math.random() * availableDishes.length)];
        setSelectedDish(randomDish);
      }, 100);
    }
  };

  const resetPicker = () => {
    if (isAnimating) {
      // 如果正在滚动，先停止
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsAnimating(false);
    }
    setExcludedDishes([]);
    setSelectedDish(null);
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">今日吃什么？</h3>
        <p className="text-sm opacity-90">随机推荐，解决选择困难</p>
      </div>

      {/* 筛选条件 */}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
        {/* 菜系筛选 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">菜系：</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                disabled={isAnimating}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {category === 'all' ? '全部' : category}
              </button>
            ))}
          </div>
        </div>

        {/* 评分筛选 */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">最低评分：</span>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                disabled={isAnimating}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  minRating === rating
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {rating === 0 ? '不限' : `${rating}星及以上`}
              </button>
            ))}
          </div>
        </div>

        {/* 筛选结果提示 */}
        <div className="text-sm text-gray-600 border-t pt-3">
          <span>筛选结果：{availableDishes.length} 道菜品</span>
          {(selectedCategory !== 'all' || minRating > 0) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setMinRating(0);
              }}
              disabled={isAnimating}
              className="ml-3 text-blue-500 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              清除筛选
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 text-center min-h-[280px] flex flex-col justify-center">
        {selectedDish ? (
          <>
            <div className={`transition-all ${isAnimating ? 'scale-105' : ''}`}>
              <div className="mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedDish.category === '中餐' ? 'bg-red-100 text-red-700' :
                  selectedDish.category === '西餐' ? 'bg-blue-100 text-blue-700' :
                  selectedDish.category === '日韩料理' ? 'bg-green-100 text-green-700' :
                  selectedDish.category === '快餐' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {selectedDish.category}
                </span>
              </div>

              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {selectedDish.name}
              </h2>

              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${star <= selectedDish.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>

              {excludedDishes.includes(selectedDish.id) && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>已从推荐池移除</span>
                </div>
              )}

              <div className="text-sm text-gray-500">
                剩余可选菜品：{availableDishes.length} / {allDishes.length}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 text-6xl">🍽️</div>
            <p className="text-gray-500">点击下方按钮开始推荐</p>
            <div className="mt-4 text-sm text-gray-400">
              可选菜品：{availableDishes.length} / {allDishes.length}
            </div>
          </>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={pickRandom}
          disabled={availableDishes.length === 0}
          className={`flex-1 flex items-center justify-center space-x-2 py-4 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            isAnimating
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
          }`}
        >
          {isAnimating ? (
            <>
              <StopCircle className="w-6 h-6" />
              <span>停止随机</span>
            </>
          ) : (
            <>
              <Shuffle className="w-6 h-6" />
              <span>随机推荐</span>
            </>
          )}
        </button>

        <button
          onClick={resetPicker}
          disabled={excludedDishes.length === 0}
          className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {availableDishes.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800 font-medium">所有菜品都已被选择过</p>
          <p className="text-yellow-600 text-sm mt-1">点击重置按钮重新开始</p>
        </div>
      )}
    </div>
  );
}
