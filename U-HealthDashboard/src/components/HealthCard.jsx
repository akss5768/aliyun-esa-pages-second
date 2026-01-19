import { Droplet, Activity, Moon, Weight, AlertTriangle, Phone, Edit, X, Save, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function HealthCard({ profile, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleUpdate = (field, value) => {
    onUpdate({ ...profile, [field]: value });
  };

  const startEditing = () => {
    setEditForm({
      name: profile.name || '',
      age: profile.age || '',
      bloodType: profile.bloodType || '',
      height: profile.height || '',
      weight: profile.weight || '',
      allergies: [...(profile.allergies || [])],
      chronicDiseases: [...(profile.chronicDiseases || [])],
      emergencyContact: {
        name: profile.emergencyContact?.name || '',
        phone: profile.emergencyContact?.phone || ''
      }
    });
    setIsEditing(true);
  };

  const saveChanges = () => {
    // 数据验证
    if (!editForm.name || !editForm.name.trim()) {
      alert('请输入姓名');
      return;
    }
    if (!editForm.age || editForm.age <= 0 || editForm.age > 150) {
      alert('请输入有效的年龄（1-150）');
      return;
    }
    if (!editForm.bloodType) {
      alert('请选择血型');
      return;
    }
    if (!editForm.height || editForm.height <= 0 || editForm.height > 300) {
      alert('请输入有效的身高（1-300 cm）');
      return;
    }
    if (!editForm.weight || editForm.weight <= 0 || editForm.weight > 500) {
      alert('请输入有效的体重（1-500 kg）');
      return;
    }

    // 确保紧急联系人至少填写一个字段
    if (editForm.emergencyContact) {
      if (!editForm.emergencyContact.name && !editForm.emergencyContact.phone) {
        editForm.emergencyContact = { name: '', phone: '' };
      }
    }

    onUpdate({
      ...editForm,
      name: editForm.name.trim(),
      age: parseInt(editForm.age),
      height: parseFloat(editForm.height),
      weight: parseFloat(editForm.weight),
      allergies: editForm.allergies || [],
      chronicDiseases: editForm.chronicDiseases || []
    });
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const addAllergy = () => {
    const newAllergy = prompt('请输入过敏源:');
    if (newAllergy && newAllergy.trim()) {
      setEditForm({
        ...editForm,
        allergies: [...(editForm.allergies || []), newAllergy.trim()]
      });
    }
  };

  const removeAllergy = (index) => {
    setEditForm({
      ...editForm,
      allergies: editForm.allergies.filter((_, i) => i !== index)
    });
  };

  const addChronicDisease = () => {
    const newDisease = prompt('请输入慢性疾病:');
    if (newDisease && newDisease.trim()) {
      setEditForm({
        ...editForm,
        chronicDiseases: [...(editForm.chronicDiseases || []), newDisease.trim()]
      });
    }
  };

  const removeChronicDisease = (index) => {
    setEditForm({
      ...editForm,
      chronicDiseases: editForm.chronicDiseases.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{profile?.name || '用户'}</h2>
            <p className="text-blue-100">健康档案</p>
          </div>
          {!isEditing && (
            <button
              onClick={startEditing}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <Edit className="w-5 h-5" />
              <span>编辑</span>
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">编辑档案信息</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
              <input
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入年龄"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">血型</label>
              <select
                value={editForm.bloodType}
                onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择血型</option>
                <option value="A型">A型</option>
                <option value="B型">B型</option>
                <option value="AB型">AB型</option>
                <option value="O型">O型</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">身高</label>
              <input
                type="number"
                value={editForm.height}
                onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入身高"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">体重</label>
              <input
                type="number"
                value={editForm.weight}
                onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入体重"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">过敏信息</label>
              <button
                onClick={addAllergy}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>添加</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editForm.allergies && editForm.allergies.map((allergy, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center space-x-1">
                  <span>{allergy}</span>
                  <button
                    onClick={() => removeAllergy(index)}
                    className="hover:text-red-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">慢性疾病</label>
              <button
                onClick={addChronicDisease}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>添加</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editForm.chronicDiseases && editForm.chronicDiseases.map((disease, index) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center space-x-1">
                  <span>{disease}</span>
                  <button
                    onClick={() => removeChronicDisease(index)}
                    className="hover:text-orange-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">紧急联系人</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">姓名</label>
                <input
                  type="text"
                  value={editForm.emergencyContact?.name || ''}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    emergencyContact: { ...editForm.emergencyContact, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入紧急联系人姓名"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">电话</label>
                <input
                  type="tel"
                  value={editForm.emergencyContact?.phone || ''}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    emergencyContact: { ...editForm.emergencyContact, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入紧急联系人电话"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={saveChanges}
              className="flex-1 flex items-center justify-center space-x-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
            >
              <Save className="w-5 h-5" />
              <span>保存</span>
            </button>
            <button
              onClick={cancelEditing}
              className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
            >
              <X className="w-5 h-5" />
              <span>取消</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">基本信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <Droplet className="w-6 h-6 text-red-500 mb-2" />
                <div className="text-sm text-gray-500">血型</div>
                <div className="text-xl font-bold text-gray-800">{profile.bloodType || '未设置'}</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <Activity className="w-6 h-6 text-blue-500 mb-2" />
                <div className="text-sm text-gray-500">年龄</div>
                <div className="text-xl font-bold text-gray-800">{profile.age ? `${profile.age}岁` : '未设置'}</div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <Weight className="w-6 h-6 text-green-500 mb-2" />
                <div className="text-sm text-gray-500">身高</div>
                <div className="text-xl font-bold text-gray-800">{profile.height ? `${profile.height}cm` : '未设置'}</div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <Moon className="w-6 h-6 text-purple-500 mb-2" />
                <div className="text-sm text-gray-500">体重</div>
                <div className="text-xl font-bold text-gray-800">{profile.weight ? `${profile.weight}kg` : '未设置'}</div>
              </div>
            </div>
          </div>

          {profile.allergies && profile.allergies.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-800">过敏信息</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.chronicDiseases && profile.chronicDiseases.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">慢性疾病</h3>
              <div className="flex flex-wrap gap-2">
                {profile.chronicDiseases.map((disease, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {disease}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.emergencyContact && profile.emergencyContact.name && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-bold text-gray-800">紧急联系人</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500">姓名：</span>
                  <span className="font-medium text-gray-800">{profile.emergencyContact.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">电话：</span>
                  <a href={`tel:${profile.emergencyContact.phone}`} className="font-medium text-blue-600 hover:underline">
                    {profile.emergencyContact.phone}
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
