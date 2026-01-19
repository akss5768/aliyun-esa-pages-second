import { useState, useEffect } from 'react';
import { Clock, Package, Calculator, AlertTriangle, Download, Menu, X, Plus } from 'lucide-react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import PackingList from './components/PackingList';
import ExpenseCalculator from './components/ExpenseCalculator';
import EmergencyInfo from './components/EmergencyInfo';
import PDFExport from './components/PDFExport';
import { storage } from './utils/storage';
import { sampleTripData, defaultTripData } from './data/sampleData';

function App() {
  const [tripData, setTripData] = useState(() => {
    const saved = storage.get('travelCapsule');
    return saved || sampleTripData;
  });
  const [activeTab, setActiveTab] = useState('timeline');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // 初始化历史行程
  useEffect(() => {
    if (!storage.get('travelHistory')) {
      storage.set('travelHistory', []);
    }
  }, []);

  // 仅用于初始化后的更新，避免重复保存
  useEffect(() => {
    // 确保数据被保存
    storage.set('travelCapsule', tripData);
  }, []);

  useEffect(() => {
    // 总是保存数据，不仅仅是当id存在时
    storage.set('travelCapsule', tripData);
  }, [tripData]);

  const updateTripData = (key, value) => {
    setTripData(prev => ({ ...prev, [key]: value }));
  };

  const saveCurrentTrip = () => {
    // 获取历史行程列表
    const history = storage.get('travelHistory', []);
    // 检查是否已经存在相同ID的行程
    const existingIndex = history.findIndex(trip => trip.id === tripData.id);
    
    // 如果存在，则更新它；否则添加新的
    let newHistory;
    if (existingIndex !== -1) {
      newHistory = [...history];
      newHistory[existingIndex] = { ...tripData, savedAt: new Date().toISOString() };
    } else {
      newHistory = [...history, { ...tripData, savedAt: new Date().toISOString() }];
    }
    
    storage.set('travelHistory', newHistory);
    alert('行程已保存！');
    
    // 保存后清空当前行程并重置为默认值
    const newTripData = {
      ...defaultTripData,
      id: Date.now(),
    };
    setTripData(newTripData);
  };

  const loadTrip = (trip) => {
    setTripData(trip);
    setShowHistory(false);
    setShowMobileMenu(false);
  };

  const deleteTrip = (tripId) => {
    const history = storage.get('travelHistory', []);
    const newHistory = history.filter(trip => trip.id !== tripId);
    storage.set('travelHistory', newHistory);
    // 如果删除的是当前显示的行程，刷新历史记录列表
    if (showHistory) {
      setTripData(prev => ({ ...prev })); // 触发重新渲染
    }
  };

  const useSampleData = () => {
    // 使用示例数据，但确保ID是当前时间戳以避免冲突
    const sampleDataWithCurrentId = {
      ...sampleTripData,
      id: Date.now(),
    };
    setTripData(sampleDataWithCurrentId);
    setActiveTab('timeline');
    setShowMobileMenu(false);
  };

  const createNewTrip = () => {
    // 为新行程生成唯一ID
    const newTripData = {
      ...defaultTripData,
      id: Date.now(),
    };
    setTripData(newTripData);
    setActiveTab('timeline');
    setShowMobileMenu(false);
  };

  const tabs = [
    { id: 'timeline', icon: Clock, label: '行程安排' },
    { id: 'packing', icon: Package, label: '打包清单' },
    { id: 'expenses', icon: Calculator, label: '费用计算' },
    { id: 'emergency', icon: AlertTriangle, label: '紧急信息' },
    { id: 'export', icon: Download, label: '导出PDF' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        tripData={tripData} 
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)} 
        onUpdate={(updatedData) => setTripData(updatedData)}
      />

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
              onClick={createNewTrip}
              className="w-full px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              新建空白行程
            </button>
            <button
              onClick={saveCurrentTrip}
              className="w-full px-4 py-3 border-2 border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition font-medium"
            >
              保存当前行程
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="w-full px-4 py-3 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition font-medium"
            >
              历史行程
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'timeline' && (
              <Timeline 
                schedule={tripData.schedule} 
                onUpdate={(schedule) => updateTripData('schedule', schedule)} 
              />
            )}
            {activeTab === 'packing' && (
              <PackingList 
                packingList={tripData.packingList} 
                onUpdate={(list) => updateTripData('packingList', list)} 
              />
            )}
            {activeTab === 'expenses' && (
              <ExpenseCalculator 
                expenses={tripData.expenses} 
                onUpdate={(expenses) => updateTripData('expenses', expenses)} 
              />
            )}
            {activeTab === 'emergency' && (
              <EmergencyInfo 
                emergencyInfo={tripData.emergencyInfo} 
                onUpdate={(emergencyInfo) => updateTripData('emergencyInfo', emergencyInfo)} 
              />
            )}
            {activeTab === 'export' && <PDFExport tripData={tripData} />}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      
      {/* 历史行程模态框 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">历史行程</h3>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {storage.get('travelHistory', []).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无历史行程</p>
                  </div>
                ) : (
                  storage.get('travelHistory', []).map((trip, index) => (
                    <div key={trip.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-semibold text-gray-800">{trip.destination || '未命名行程'}</h4>
                        <p className="text-sm text-gray-500">
                          {trip.startDate} ~ {trip.endDate} | 
                          <span className="ml-1">保存于 {(new Date(trip.savedAt)).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadTrip(trip)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                        >
                          加载
                        </button>
                        <button
                          onClick={() => deleteTrip(trip.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
