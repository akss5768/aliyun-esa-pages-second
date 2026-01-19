import { useState, useEffect } from 'react';
import { Utensils, Shuffle, List, History as HistoryIcon, MessageCircle, Menu, X, Plus } from 'lucide-react';
import RandomPicker from './components/RandomPicker';
import DishManager from './components/DishManager';
import History from './components/History';
import Feedback from './components/Feedback';
import { storage } from './utils/storage';
import { sampleDishes, sampleHistory, defaultDishes, defaultHistory } from './data/sampleData';
import { format } from 'date-fns';

function App() {
  const [dishes, setDishes] = useState(defaultDishes);
  const [history, setHistory] = useState(defaultHistory);
  const [currentDish, setCurrentDish] = useState(null);
  const [activeTab, setActiveTab] = useState('picker');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const savedDishes = storage.get('whatToEat_dishes');
    const savedHistory = storage.get('whatToEat_history');
    
    if (savedDishes) {
      setDishes(savedDishes);
    } else {
      setDishes(sampleDishes);
    }
    
    if (savedHistory) {
      setHistory(savedHistory);
    } else {
      setHistory(sampleHistory);
    }
  }, []);

  useEffect(() => {
    if (Object.values(dishes).flat().length > 0) {
      storage.set('whatToEat_dishes', dishes);
    }
  }, [dishes]);

  useEffect(() => {
    if (history.length > 0) {
      storage.set('whatToEat_history', history);
    }
  }, [history]);

  const handlePick = (dish) => {
    setCurrentDish(dish);
    // 不再自动跳转，由用户点击"去评价"按钮后手动跳转
  };

  const handleReset = () => {
    setCurrentDish(null);
  };

  const handleFeedback = (feedbackData) => {
    const newHistoryItem = {
      id: Date.now(),
      ...feedbackData,
      date: format(new Date(), 'yyyy-MM-dd')
    };
    setHistory([newHistoryItem, ...history]);
  };

  const useSampleData = () => {
    // 清空当前数据并加载示例数据
    setCurrentDish(null);
    setDishes(sampleDishes);
    setHistory(sampleHistory);
    setActiveTab('picker');
    setShowMobileMenu(false);

    // 更新 localStorage
    storage.set('whatToEat_dishes', sampleDishes);
    storage.set('whatToEat_history', sampleHistory);
  };

  const createNew = () => {
    setDishes(defaultDishes);
    setHistory(defaultHistory);
    setCurrentDish(null);
    setActiveTab('picker');
    setShowMobileMenu(false);
  };

  const tabs = [
    { id: 'picker', icon: Shuffle, label: '随机推荐' },
    { id: 'manager', icon: List, label: '菜品管理' },
    { id: 'history', icon: HistoryIcon, label: '历史记录' },
    { id: 'feedback', icon: MessageCircle, label: '评价反馈' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Utensils className="w-8 h-8" />
              <h1 className="text-xl font-bold">U-WhatToEat</h1>
            </div>
            
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="opacity-90">共 {Object.values(dishes).flat().length} 道菜品</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 md:hidden">
            <button
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
              <span>关闭菜单</span>
            </button>
          </div>

          <div className="p-4 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t p-4 space-y-2">
            <button
              onClick={useSampleData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>加载示例数据</span>
            </button>

            <button
              onClick={createNew}
              className="w-full px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              清空重置
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'picker' && (
              <RandomPicker 
                dishes={dishes} 
                onPick={handlePick} 
                onReset={handleReset} 
              />
            )}
            {activeTab === 'manager' && (
              <DishManager 
                dishes={dishes} 
                onUpdate={setDishes} 
              />
            )}
            {activeTab === 'history' && (
              <History 
                history={history} 
                onUpdate={setHistory} 
              />
            )}
            {activeTab === 'feedback' && (
              <Feedback 
                currentDish={currentDish} 
                onSubmit={handleFeedback} 
              />
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
}

export default App;
