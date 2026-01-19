import { useState } from 'react';
import { Pill, Bell, Clock, Plus, Trash2, Check, Edit, X, Save } from 'lucide-react';
import { format } from 'date-fns';

export default function MedicationReminder({ medications, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editMed, setEditMed] = useState(null);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '08:00',
    remind: true
  });

  const addMedication = () => {
    if (!newMed.name || !newMed.name.trim()) {
      alert('请填写药物名称');
      return;
    }
    if (!newMed.dosage || !newMed.dosage.trim()) {
      alert('请填写剂量');
      return;
    }
    if (!newMed.frequency || !newMed.frequency.trim()) {
      alert('请填写频率');
      return;
    }
    if (!newMed.time) {
      alert('请填写服用时间');
      return;
    }

    onUpdate([...medications, { ...newMed, id: Date.now() }]);
    setNewMed({ name: '', dosage: '', frequency: '', time: '08:00', remind: true });
    setShowAddForm(false);
  };

  const removeMedication = (id) => {
    if (confirm('确定要删除这个药物吗？')) {
      onUpdate(medications.filter(med => med.id !== id));
    }
  };

  const toggleRemind = (id) => {
    onUpdate(medications.map(med =>
      med.id === id ? { ...med, remind: !med.remind } : med
    ));
  };

  const startEdit = (med) => {
    setEditingId(med.id);
    setEditMed({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time,
      remind: med.remind
    });
  };

  const saveEdit = (id) => {
    if (!editMed.name || !editMed.name.trim()) {
      alert('请填写药物名称');
      return;
    }
    if (!editMed.dosage || !editMed.dosage.trim()) {
      alert('请填写剂量');
      return;
    }
    if (!editMed.frequency || !editMed.frequency.trim()) {
      alert('请填写频率');
      return;
    }
    if (!editMed.time) {
      alert('请填写服用时间');
      return;
    }

    onUpdate(medications.map(med =>
      med.id === id ? { ...med, ...editMed } : med
    ));
    setEditingId(null);
    setEditMed(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditMed(null);
  };

  const markAsTaken = (id) => {
    const today = new Date().toISOString().split('T')[0];
    const med = medications.find(m => m.id === id);
    if (med) {
      const takenDates = med.takenDates || [];
      if (takenDates.includes(today)) {
        // 如果今天已经标记，则取消标记
        onUpdate(medications.map(m =>
          m.id === id ? { ...m, takenDates: takenDates.filter(d => d !== today) } : m
        ));
      } else {
        // 标记为今天已服用
        onUpdate(medications.map(m =>
          m.id === id ? { ...m, takenDates: [...takenDates, today] } : m
        ));
      }
    }
  };

  const isTakenToday = (med) => {
    const today = new Date().toISOString().split('T')[0];
    return med.takenDates && med.takenDates.includes(today);
  };

  // 如果显示添加表单，直接返回表单界面
  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Pill className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold">用药管理</h3>
                <p className="text-sm opacity-90">{medications?.length || 0} 种药物需服用</p>
              </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">药物名称</label>
            <input
              type="text"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              placeholder="如：维生素C"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">剂量</label>
            <input
              type="text"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              placeholder="如：1片/次"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">频率</label>
            <input
              type="text"
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              placeholder="如：每日1次"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服用时间</label>
            <input
              type="time"
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remind"
              checked={newMed.remind}
              onChange={(e) => setNewMed({ ...newMed, remind: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="remind" className="text-sm text-gray-700">启用提醒</label>
          </div>

          <button
            onClick={addMedication}
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
          >
            确认添加
          </button>
        </div>
      </div>
    );
  }

  // 如果没有数据且不显示表单，显示空状态
  if (!medications || medications.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Pill className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">暂无用药记录</p>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          添加药物
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Pill className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">用药管理</h3>
              <p className="text-sm opacity-90">{medications.length} 种药物需服用</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? '关闭' : '添加'}</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">今日用药</h3>
      </div>

      <div className="space-y-3">
        {medications && medications.length > 0 && [...medications].sort((a, b) => a.time.localeCompare(b.time)).map(med => {
          const isEditing = editingId === med.id;
          const takenToday = isTakenToday(med);

          if (isEditing) {
            return (
              <div key={med.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">药物名称</label>
                    <input
                      type="text"
                      value={editMed.name}
                      onChange={(e) => setEditMed({ ...editMed, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">剂量</label>
                    <input
                      type="text"
                      value={editMed.dosage}
                      onChange={(e) => setEditMed({ ...editMed, dosage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">频率</label>
                    <input
                      type="text"
                      value={editMed.frequency}
                      onChange={(e) => setEditMed({ ...editMed, frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">服用时间</label>
                    <input
                      type="time"
                      value={editMed.time}
                      onChange={(e) => setEditMed({ ...editMed, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`remind-edit-${med.id}`}
                      checked={editMed.remind}
                      onChange={(e) => setEditMed({ ...editMed, remind: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor={`remind-edit-${med.id}`} className="text-sm text-gray-700">启用提醒</label>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => saveEdit(med.id)}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                    >
                      保存修改
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={med.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Pill className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{med.name}</h4>
                    <p className="text-sm text-gray-600">{med.dosage} · {med.frequency}</p>
                    <div className="flex items-center space-x-1 mt-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{med.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => startEdit(med)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeMedication(med.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="删除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className={`w-4 h-4 ${med.remind ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${med.remind ? 'text-blue-600' : 'text-gray-400'}`}>
                    {med.remind ? '提醒已开启' : '提醒已关闭'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={med.remind}
                      onChange={() => toggleRemind(med.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>

                  <button
                    onClick={() => markAsTaken(med.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition ${
                      takenToday
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-sm">{takenToday ? '已服用' : '标记已服用'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
