import { useState } from 'react';
import { Thermometer, Plus, Trash2, AlertCircle, X } from 'lucide-react';

const severityConfig = {
  mild: { label: '轻微', color: 'bg-green-100 text-green-700', icon: '😊' },
  moderate: { label: '中等', color: 'bg-yellow-100 text-yellow-700', icon: '😐' },
  severe: { label: '严重', color: 'bg-red-100 text-red-700', icon: '😫' }
};

export default function SymptomTracker({ symptoms, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editSymptom, setEditSymptom] = useState(null);
  const [newSymptom, setNewSymptom] = useState({
    date: new Date().toISOString().split('T')[0],
    symptoms: '',
    severity: 'mild',
    notes: ''
  });

  const resetNewSymptom = () => {
    setNewSymptom({
      date: new Date().toISOString().split('T')[0],
      symptoms: '',
      severity: 'mild',
      notes: ''
    });
  };

  const addSymptom = () => {
    if (!newSymptom.symptoms || !newSymptom.symptoms.trim()) {
      alert('请填写症状描述');
      return;
    }
    if (!newSymptom.date) {
      alert('请选择日期');
      return;
    }

    const symptomsList = symptoms || [];
    onUpdate([...symptomsList, { ...newSymptom, id: Date.now() }]);
    resetNewSymptom();
    setShowAddForm(false);
  };

  const startEdit = (symptom) => {
    setEditingId(symptom.id);
    setEditSymptom({
      date: symptom.date,
      symptoms: symptom.symptoms,
      severity: symptom.severity || 'mild',
      notes: symptom.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSymptom(null);
  };

  const saveEdit = (id) => {
    if (!editSymptom.symptoms || !editSymptom.symptoms.trim()) {
      alert('请填写症状描述');
      return;
    }
    if (!editSymptom.date) {
      alert('请选择日期');
      return;
    }
    onUpdate(symptoms.map(s =>
      s.id === id ? { ...s, ...editSymptom } : s
    ));
    cancelEdit();
  };

  const removeSymptom = (id) => {
    onUpdate(symptoms.filter(s => s.id !== id));
  };

  const displayContent = () => {
    if (showAddForm) {
      return (
        <>
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold">症状追踪</h3>
                <p className="text-sm opacity-90">共记录 {symptoms?.length || 0} 次症状</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">添加新症状</h4>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetNewSymptom();
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
                value={newSymptom.date}
                onChange={(e) => setNewSymptom({ ...newSymptom, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">症状描述</label>
              <input
                type="text"
                value={newSymptom.symptoms}
                onChange={(e) => setNewSymptom({ ...newSymptom, symptoms: e.target.value })}
                placeholder="如：头痛、发热"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">严重程度</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(severityConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setNewSymptom({ ...newSymptom, severity: key })}
                    className={`p-3 rounded-lg transition flex flex-col items-center space-y-1 ${
                      newSymptom.severity === key
                        ? config.color + ' ring-2 ring-offset-2'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{config.icon}</span>
                    <span className="text-sm font-medium">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea
                value={newSymptom.notes}
                onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                placeholder="可选：添加备注信息"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addSymptom}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                确认添加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetNewSymptom();
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

    if (!symptoms || symptoms.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Thermometer className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">暂无症状记录</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            添加症状
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">症状追踪</h3>
              <p className="text-sm opacity-90">共记录 {symptoms.length} 次症状</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">症状记录</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" />
            <span>添加</span>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">添加新症状</h4>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetNewSymptom();
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
                value={newSymptom.date}
                onChange={(e) => setNewSymptom({ ...newSymptom, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">症状描述</label>
              <input
                type="text"
                value={newSymptom.symptoms}
                onChange={(e) => setNewSymptom({ ...newSymptom, symptoms: e.target.value })}
                placeholder="如：头痛、发热"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">严重程度</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(severityConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setNewSymptom({ ...newSymptom, severity: key })}
                    className={`p-3 rounded-lg transition flex flex-col items-center space-y-1 ${
                      newSymptom.severity === key
                        ? config.color + ' ring-2 ring-offset-2'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{config.icon}</span>
                    <span className="text-sm font-medium">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea
                value={newSymptom.notes}
                onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                placeholder="可选：添加备注信息"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addSymptom}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                确认添加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetNewSymptom();
                }}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
              >
                取消
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {symptoms && symptoms.length > 0 && [...symptoms].sort((a, b) => new Date(b.date) - new Date(a.date)).map(symptom => {
            const config = severityConfig[symptom.severity];
            const isEditing = editingId === symptom.id;

            if (isEditing) {
              return (
                <div key={symptom.id} className="bg-white rounded-xl shadow-md p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                      <input
                        type="date"
                        value={editSymptom.date}
                        onChange={(e) => setEditSymptom({ ...editSymptom, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">症状描述</label>
                      <input
                        type="text"
                        value={editSymptom.symptoms}
                        onChange={(e) => setEditSymptom({ ...editSymptom, symptoms: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">严重程度</label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(severityConfig).map(([key, config]) => (
                          <button
                            key={key}
                            onClick={() => setEditSymptom({ ...editSymptom, severity: key })}
                            className={`p-3 rounded-lg transition flex flex-col items-center space-y-1 ${
                              editSymptom.severity === key
                                ? config.color + ' ring-2 ring-offset-2'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <span className="text-2xl">{config.icon}</span>
                            <span className="text-sm font-medium">{config.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                      <textarea
                        value={editSymptom.notes}
                        onChange={(e) => setEditSymptom({ ...editSymptom, notes: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => saveEdit(symptom.id)}
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
              <div key={symptom.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 cursor-pointer flex-1" onClick={() => startEdit(symptom)}>
                    <div className="text-3xl">{config.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{symptom.symptoms}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{symptom.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => startEdit(symptom)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      title="编辑"
                    >
                      <Thermometer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeSymptom(symptom.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="删除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {symptom.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{symptom.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
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
