import { useState, useEffect } from 'react';
import { CheckSquare, Shuffle, List, History as HistoryIcon, Settings, Menu, X, Plus } from 'lucide-react';
import TaskGenerator from './components/TaskGenerator';
import TaskList from './components/TaskList';
import TaskManager from './components/TaskManager';
import History from './components/History';
import { storage } from './utils/storage';
import { sampleTaskTypes, sampleHistory, defaultTaskTypes, defaultHistory } from './data/sampleData';
import { format, isToday, parseISO } from 'date-fns';

function App() {
  const [taskTypes, setTaskTypes] = useState(defaultTaskTypes);
  const [history, setHistory] = useState(defaultHistory);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('generator');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const savedTaskTypes = storage.get('dailyTask_taskTypes');
    const savedHistory = storage.get('dailyTask_history');
    const savedDailyTasks = storage.get('dailyTask_dailyTasks');
    const savedDailyTasksDate = storage.get('dailyTask_dailyTasksDate');

    if (savedTaskTypes) {
      setTaskTypes(savedTaskTypes);
    }

    if (savedHistory) {
      setHistory(savedHistory);
    }

    if (savedDailyTasks && savedDailyTasksDate) {
      const savedDate = parseISO(savedDailyTasksDate);
      if (isToday(savedDate)) {
        setDailyTasks(savedDailyTasks);
        setActiveTab('tasks');
      } else {
        storage.remove('dailyTask_dailyTasks');
        storage.remove('dailyTask_dailyTasksDate');
      }
    }
  }, []);

  useEffect(() => {
    if (Object.values(taskTypes).flat().length > 0) {
      storage.set('dailyTask_taskTypes', taskTypes);
    }
  }, [taskTypes]);

  useEffect(() => {
    if (history.length > 0) {
      storage.set('dailyTask_history', history);
    }
  }, [history]);

  useEffect(() => {
    if (dailyTasks.length > 0) {
      storage.set('dailyTask_dailyTasks', dailyTasks);
      storage.set('dailyTask_dailyTasksDate', format(new Date(), 'yyyy-MM-dd'));
    } else {
      storage.remove('dailyTask_dailyTasks');
      storage.remove('dailyTask_dailyTasksDate');
    }
    
    // 自动保存当日任务状态到历史记录
    saveCurrentDayProgress();
  }, [dailyTasks]);

  // 添加一个effect来监听任务完成状态变化并自动保存到历史记录
  useEffect(() => {
    if (dailyTasks.length > 0) {
      saveCurrentDayProgress();
    }
  }, [dailyTasks]);
  
  const saveCurrentDayProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const completedTasks = JSON.parse(localStorage.getItem('dailyTask_completedTasks') || '[]');
    const completedCount = completedTasks.length;
    
    if (dailyTasks.length > 0) { // 只有在有任务时才保存到历史
      const newEntry = {
        date: today,
        tasks: dailyTasks.map(t => t.name),
        completed: completedCount,
        total: dailyTasks.length
      };
      
      const updatedHistory = history.filter(h => h.date !== today);
      setHistory([newEntry, ...updatedHistory]);
    }
  };

  const handleGenerate = (tasks) => {
    if (dailyTasks.length > 0) {
      if (confirm('今日任务已生成，重新生成将会清空当前的今日任务。是否继续？')) {
        setDailyTasks(tasks);
        // 重置任务完成状态
        localStorage.removeItem('dailyTask_completedTasks');
        localStorage.removeItem('dailyTask_completedTasksDate');
        setActiveTab('tasks');
      }
    } else {
      setDailyTasks(tasks);
      setActiveTab('tasks');
    }
  };

  const handleReset = () => {
    setDailyTasks([]);
    // 重置任务完成状态
    localStorage.removeItem('dailyTask_completedTasks');
    localStorage.removeItem('dailyTask_completedTasksDate');
  };

  const handleClearTasks = () => {
    setDailyTasks([]);
    // 重置任务完成状态
    localStorage.removeItem('dailyTask_completedTasks');
    localStorage.removeItem('dailyTask_completedTasksDate');
  };

  const handleAddToHistory = (tasks, completedCount) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEntry = {
      date: today,
      tasks: tasks.map(t => t.name),
      completed: completedCount,
      total: tasks.length
    };
    
    const updatedHistory = history.filter(h => h.date !== today);
    setHistory([newEntry, ...updatedHistory]);
    
    alert(`已将当前进度保存到历史记录\n${today}: ${completedCount}/${tasks.length} 任务完成`);
  };

  const handleCompleteDay = (tasks, completedCount) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEntry = {
      date: today,
      tasks: tasks.map(t => t.name),
      completed: completedCount,
      total: tasks.length
    };
    
    const updatedHistory = history.filter(h => h.date !== today);
    setHistory([newEntry, ...updatedHistory]);
    setDailyTasks([]);
  };

  const useSampleData = () => {
    storage.clear();
    setTaskTypes(sampleTaskTypes);
    setHistory(sampleHistory);
    setDailyTasks([]);
    setActiveTab('generator');
    setShowMobileMenu(false);
  };

  const createNew = () => {
    storage.clear();
    setTaskTypes(defaultTaskTypes);
    setHistory(defaultHistory);
    setDailyTasks([]);
    setActiveTab('generator');
    setShowMobileMenu(false);
  };

  const tabs = [
    { id: 'generator', icon: Shuffle, label: '生成任务' },
    { id: 'tasks', icon: CheckSquare, label: '今日任务' },
    { id: 'manager', icon: List, label: '任务库' },
    { id: 'history', icon: HistoryIcon, label: '历史记录' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-8 h-8" />
              <h1 className="text-xl font-bold">U-DailyTask</h1>
            </div>
            
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="opacity-90">任务库：{Object.values(taskTypes).flat().length} 个任务</span>
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
          <div className="max-w-4xl mx-auto">
            {activeTab === 'generator' && (
              <TaskGenerator 
                taskTypes={taskTypes} 
                onGenerate={handleGenerate} 
                onReset={handleReset} 
              />
            )}
            {activeTab === 'tasks' && (
              <TaskList
                dailyTasks={dailyTasks}
                onUpdate={setDailyTasks}
                onDelete={setDailyTasks}
                onClear={handleClearTasks}
                onAddToHistory={handleAddToHistory}
                onSaveProgress={saveCurrentDayProgress}
              />
            )}
            {activeTab === 'manager' && (
              <TaskManager 
                taskTypes={taskTypes} 
                onUpdate={setTaskTypes} 
              />
            )}
            {activeTab === 'history' && (
              <History 
                history={history} 
                onUpdate={setHistory} 
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
