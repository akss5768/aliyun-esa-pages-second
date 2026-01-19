import { useState, useEffect } from 'react';
import { Heart, Activity, Pill, Thermometer, FileText, Menu, X, User, Plus } from 'lucide-react';
import HealthCard from './components/HealthCard';
import VitalsChart from './components/VitalsChart';
import MedicationReminder from './components/MedicationReminder';
import SymptomTracker from './components/SymptomTracker';
import HealthReport from './components/HealthReport';
import { storage } from './utils/storage';
import { sampleHealthData, defaultHealthData } from './data/sampleData';

function App() {
  const [healthData, setHealthData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // 初始化加载数据
    const saved = storage.get('healthDashboard');
    console.log('从 localStorage 加载数据:', saved);
    console.log('localStorage 原始值:', localStorage.getItem('healthDashboard'));

    // 检查是否有有效的保存数据
    const hasValidSavedData = saved &&
      Object.keys(saved).length > 0 &&
      saved.profile &&
      saved.vitals &&
      Array.isArray(saved.vitalHistory) &&
      Array.isArray(saved.medications) &&
      Array.isArray(saved.symptoms);

    if (hasValidSavedData) {
      console.log('使用已保存的数据');
      setHealthData(saved);
    } else {
      console.log('使用示例数据');
      // 如果没有保存的数据或数据无效，使用示例数据并保存
      setHealthData(sampleHealthData);
      storage.set('healthDashboard', sampleHealthData);
      console.log('示例数据已保存到 localStorage');
      console.log('保存后的 localStorage:', localStorage.getItem('healthDashboard'));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // 只在初始化完成后且数据变化时保存
    if (isInitialized && healthData && Object.keys(healthData).length > 0) {
      console.log('保存数据到 localStorage:', healthData);
      storage.set('healthDashboard', healthData);
    }
  }, [healthData, isInitialized]);

  const updateHealthData = (key, value) => {
    console.log(`updateHealthData - key: ${key}, value:`, value);
    setHealthData(prev => ({ ...prev, [key]: value }));
  };

  // 支持同时更新多个字段
  const updateMultipleFields = (updates) => {
    console.log('updateMultipleFields - updates:', updates);
    setHealthData(prev => ({ ...prev, ...updates }));
  };

  const useSampleData = () => {
    setHealthData(sampleHealthData);
    // 立即保存到localStorage
    storage.set('healthDashboard', sampleHealthData);
    setActiveTab('profile');
    setShowMobileMenu(false);
  };

  const clearProfileData = () => {
    if (confirm('确定要清除所有健康档案数据吗？此操作不可恢复。')) {
      console.log('清除所有数据');
      setHealthData(defaultHealthData);
      storage.remove('healthDashboard');
      setActiveTab('profile');
      setShowMobileMenu(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: '健康档案' },
    { id: 'vitals', icon: Activity, label: '健康趋势' },
    { id: 'medications', icon: Pill, label: '用药管理' },
    { id: 'symptoms', icon: Thermometer, label: '症状追踪' },
    { id: 'report', icon: FileText, label: '健康报告' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8" />
              <h1 className="text-xl font-bold">U-HealthDashboard</h1>
            </div>
            
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm opacity-90">欢迎，</span>
              <span className="font-semibold">{healthData?.profile?.name || '用户'}</span>
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
              onClick={clearProfileData}
              className="w-full px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
            >
              清除档案数据
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {!isInitialized ? (
              <div className="text-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-lg">加载中...</p>
              </div>
            ) : (
              <>
                {activeTab === 'profile' && (
                  <HealthCard
                    profile={healthData?.profile || {}}
                    onUpdate={(profile) => updateHealthData('profile', profile)}
                  />
                )}
                {activeTab === 'vitals' && (
                  <VitalsChart
                    vitalHistory={healthData?.vitalHistory || []}
                    vitals={healthData?.vitals || {}}
                    onUpdate={(vitalHistory) => {
                      // 确保传入的是有效的数组
                      if (!Array.isArray(vitalHistory)) {
                        console.error('vitalHistory 必须是数组');
                        return;
                      }

                      // 按日期排序获取最新记录
                      const sortedHistory = [...vitalHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
                      const latestRecord = sortedHistory.length > 0 ? sortedHistory[0] : null;

                      // 更新 vitals 数据
                      const updatedVitals = latestRecord
                        ? {
                            bloodPressure: {
                              systolic: latestRecord.systolic || 0,
                              diastolic: latestRecord.diastolic || 0,
                              date: latestRecord.date
                            },
                            heartRate: { value: latestRecord.heartRate || 0, date: latestRecord.date },
                            weight: { value: latestRecord.weight || 0, date: latestRecord.date },
                            sleep: { value: latestRecord.sleep || 0, date: latestRecord.date }
                          }
                        : (healthData?.vitals || {
                            bloodPressure: { systolic: 0, diastolic: 0, date: '' },
                            heartRate: { value: 0, date: '' },
                            weight: { value: 0, date: '' },
                            sleep: { value: 0, date: '' }
                          });

                      updateMultipleFields({
                        vitalHistory: vitalHistory,
                        vitals: updatedVitals
                      });
                    }}
                  />
                )}
                {activeTab === 'medications' && (
                  <MedicationReminder
                    medications={healthData?.medications || []}
                    onUpdate={(medications) => updateHealthData('medications', medications)}
                  />
                )}
                {activeTab === 'symptoms' && (
                  <SymptomTracker
                    symptoms={healthData?.symptoms || []}
                    onUpdate={(symptoms) => updateHealthData('symptoms', symptoms)}
                  />
                )}
                {activeTab === 'report' && <HealthReport healthData={healthData || {}} />}
              </>
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
