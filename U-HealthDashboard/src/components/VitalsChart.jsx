import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Heart, Activity, Moon, Plus, X, Calendar, Droplet } from 'lucide-react';
import { useState } from 'react';

export default function VitalsChart({ vitalHistory, vitals, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    bloodPressure: '',
    heartRate: '',
    weight: '',
    sleep: ''
  });

  const resetForm = () => {
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      bloodPressure: '',
      heartRate: '',
      weight: '',
      sleep: ''
    });
  };

  const parseBloodPressure = (value) => {
    const parts = value.split('/').map(v => parseInt(v.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { systolic: parts[0], diastolic: parts[1] };
    }
    return null;
  };

  const addRecord = () => {
    // 检查是否所有字段都有值
    if (!newRecord.bloodPressure || !newRecord.heartRate || !newRecord.weight || !newRecord.sleep) {
      alert('请填写所有健康指标');
      return;
    }
    if (!newRecord.date) {
      alert('请选择日期');
      return;
    }

    const bp = parseBloodPressure(newRecord.bloodPressure);
    const heartRate = parseFloat(newRecord.heartRate);
    const weight = parseFloat(newRecord.weight);
    const sleep = parseFloat(newRecord.sleep);

    if (!bp || isNaN(heartRate) || isNaN(weight) || isNaN(sleep)) {
      alert('健康指标格式不正确，请检查输入值');
      return;
    }

    if (isNaN(bp.systolic) || isNaN(bp.diastolic)) {
      alert('血压格式不正确，请使用格式如 "120/80"');
      return;
    }

    // 添加数值范围验证
    if (bp.systolic < 50 || bp.systolic > 250 || bp.diastolic < 30 || bp.diastolic > 150) {
      alert('血压值超出正常范围，请检查输入值');
      return;
    }
    if (heartRate < 30 || heartRate > 220) {
      alert('心率值超出正常范围，请检查输入值');
      return;
    }
    if (weight < 10 || weight > 500) {
      alert('体重值超出正常范围，请检查输入值');
      return;
    }
    if (sleep < 0 || sleep > 24) {
      alert('睡眠时间超出正常范围，请检查输入值');
      return;
    }

    // 检查是否已存在同一天的记录
    const existingRecord = vitalHistory?.find(record => record.date === newRecord.date);
    if (existingRecord) {
      if (!confirm(`日期 ${newRecord.date} 的健康记录已存在，是否覆盖？`)) {
        return;
      }
    }

    const newVitalRecord = {
      date: newRecord.date,
      bloodPressure: newRecord.bloodPressure,
      systolic: bp.systolic,
      diastolic: bp.diastolic,
      heartRate: heartRate,
      weight: weight,
      sleep: sleep
    };

    // 更新历史记录，如果存在同日期的记录则替换
    let updatedHistory;
    if (existingRecord) {
      updatedHistory = (vitalHistory || []).map(record =>
        record.date === newRecord.date ? newVitalRecord : record
      );
    } else {
      updatedHistory = [...(vitalHistory || []), newVitalRecord];
    }

    onUpdate(updatedHistory);

    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      bloodPressure: '',
      heartRate: '',
      weight: '',
      sleep: ''
    });
    setShowAddForm(false);
  };
  const renderLineChart = (dataKey, color, strokeColor) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        {dataKey === 'heartRate' && <Heart className="w-5 h-5 text-red-500" />}
        {dataKey === 'weight' && <Activity className="w-5 h-5 text-blue-500" />}
        {dataKey === 'sleep' && <Moon className="w-5 h-5 text-purple-500" />}
        <h3 className="text-lg font-bold text-gray-800">
          {dataKey === 'heartRate' ? '心率趋势' : dataKey === 'weight' ? '体重趋势' : '睡眠趋势'}
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={[...vitalHistory].sort((a, b) => new Date(a.date) - new Date(b.date))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={2} dot={{ fill: color }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">最新记录</span>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">
              {vitals[dataKey]?.value || 0} {dataKey === 'heartRate' ? 'bpm' : dataKey === 'weight' ? 'kg' : '小时'}
            </span>
            {dataKey === 'heartRate' && (() => {
              const status = getHealthStatus('heartRate', vitals.heartRate);
              return status.message ? (
                <span className={`text-xs px-2 py-1 rounded ${
                  status.status === 'warning' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {status.message}
                </span>
              ) : null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );

  const getHealthStatus = (key, value) => {
    switch (key) {
      case 'bloodPressure':
        if (!value || !value.systolic || !value.diastolic) return { status: 'normal', message: '' };
        if (value.systolic > 140 || value.diastolic > 90) {
          return { status: 'warning', message: '偏高' };
        }
        if (value.systolic < 90 || value.diastolic < 60) {
          return { status: 'warning', message: '偏低' };
        }
        return { status: 'normal', message: '正常' };
      case 'heartRate':
        if (!value || !value.value) return { status: 'normal', message: '' };
        if (value.value > 100) return { status: 'warning', message: '偏高' };
        if (value.value < 60) return { status: 'warning', message: '偏低' };
        return { status: 'normal', message: '正常' };
      case 'weight':
      case 'sleep':
        return { status: 'normal', message: '' };
      default:
        return { status: 'normal', message: '' };
    }
  };

  const displayContent = () => {
    // 如果显示添加表单，直接返回表单界面
    if (showAddForm) {
      return (
        <>
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">健康指标趋势</h3>
                <p className="text-sm opacity-90">共记录 {vitalHistory?.length || 0} 天健康数据</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <X className="w-4 h-4" />
                <span>关闭</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">添加健康记录</h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Droplet className="w-4 h-4 text-pink-500" />
                  <span>血压 (收缩压/舒张压)</span>
                </label>
                <input
                  type="text"
                  value={newRecord.bloodPressure}
                  onChange={(e) => setNewRecord({ ...newRecord, bloodPressure: e.target.value })}
                  placeholder="如: 120/80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>心率 (bpm)</span>
                </label>
                <input
                  type="number"
                  value={newRecord.heartRate}
                  onChange={(e) => setNewRecord({ ...newRecord, heartRate: e.target.value })}
                  placeholder="如: 72"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>体重 (kg)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newRecord.weight}
                  onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
                  placeholder="如: 68.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Moon className="w-4 h-4 text-purple-500" />
                  <span>睡眠 (小时)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newRecord.sleep}
                  onChange={(e) => setNewRecord({ ...newRecord, sleep: e.target.value })}
                  placeholder="如: 7.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addRecord}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                确认添加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </>
      );
    }

    // 如果没有数据且不显示表单，显示空状态
    if (!vitalHistory || vitalHistory.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">暂无健康数据</p>
          <p className="text-sm">开始记录您的健康指标吧</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>添加健康记录</span>
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">健康指标趋势</h3>
              <p className="text-sm opacity-90">共记录 {vitalHistory.length} 天健康数据</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? '关闭' : '添加记录'}</span>
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">添加健康记录</h4>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Droplet className="w-4 h-4 text-pink-500" />
                  <span>血压 (收缩压/舒张压)</span>
                </label>
                <input
                  type="text"
                  value={newRecord.bloodPressure}
                  onChange={(e) => setNewRecord({ ...newRecord, bloodPressure: e.target.value })}
                  placeholder="如: 120/80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>心率 (bpm)</span>
                </label>
                <input
                  type="number"
                  value={newRecord.heartRate}
                  onChange={(e) => setNewRecord({ ...newRecord, heartRate: e.target.value })}
                  placeholder="如: 72"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>体重 (kg)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newRecord.weight}
                  onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
                  placeholder="如: 68.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Moon className="w-4 h-4 text-purple-500" />
                  <span>睡眠 (小时)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newRecord.sleep}
                  onChange={(e) => setNewRecord({ ...newRecord, sleep: e.target.value })}
                  placeholder="如: 7.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addRecord}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                确认添加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
              >
                取消
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-bold text-gray-800">血压趋势</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[...vitalHistory].sort((a, b) => new Date(a.date) - new Date(b.date))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="#ec4899" strokeWidth={2} name="收缩压" />
                <Line type="monotone" dataKey="diastolic" stroke="#8b5cf6" strokeWidth={2} name="舒张压" />
              </LineChart>
            </ResponsiveContainer>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">最新血压</span>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">
              {vitals.bloodPressure?.systolic || 0}/{vitals.bloodPressure?.diastolic || 0} mmHg
            </span>
            {(() => {
              const status = getHealthStatus('bloodPressure', vitals.bloodPressure);
              return status.message ? (
                <span className={`text-xs px-2 py-1 rounded ${
                  status.status === 'warning' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {status.message}
                </span>
              ) : null;
            })()}
          </div>
        </div>
      </div>
          </div>

          {renderLineChart('heartRate', '#ef4444', '#ef4444')}
          {renderLineChart('weight', '#3b82f6', '#3b82f6')}
          {renderLineChart('sleep', '#8b5cf6', '#8b5cf6')}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {displayContent()}
    </div>
  );
}
