import React, { useState } from 'react';
import { Phone, Stethoscope, Building, AlertTriangle, MapPin, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

// 紧急信息编辑器组件
const EmergencyInfoEditor = ({ emergencyInfo, onSave, onCancel }) => {
  const [editedInfo, setEditedInfo] = useState({
    hospitals: emergencyInfo.hospitals || [],
    embassy: emergencyInfo.embassy || {},
    localPolice: emergencyInfo.localPolice || {},
    ambulance: emergencyInfo.ambulance || {}
  });

  const handleInputChange = (field, subField, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value
      }
    }));
  };

  const handleEmbassyChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      embassy: {
        ...prev.embassy,
        [field]: value
      }
    }));
  };

  const addHospital = () => {
    setEditedInfo(prev => ({
      ...prev,
      hospitals: [...prev.hospitals, { name: '', address: '', phone: '' }]
    }));
  };

  const updateHospital = (index, field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      hospitals: prev.hospitals.map((hospital, i) =>
        i === index ? { ...hospital, [field]: value } : hospital
      )
    }));
  };

  const removeHospital = (index) => {
    setEditedInfo(prev => ({
      ...prev,
      hospitals: prev.hospitals.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <AlertTriangle className="w-8 h-8" />
          <h3 className="text-xl font-bold">编辑紧急联系方式</h3>
        </div>
        <p className="text-sm opacity-90">编辑紧急联系电话信息</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 报警电话 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Phone className="w-5 h-5 text-red-600" />
            <span>报警电话</span>
          </h4>
          <input
            type="text"
            placeholder="电话号码"
            value={editedInfo.localPolice.number || ''}
            onChange={(e) => handleInputChange('localPolice', 'number', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-2"
          />
          <input
            type="text"
            placeholder="名称"
            value={editedInfo.localPolice.name || ''}
            onChange={(e) => handleInputChange('localPolice', 'name', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* 救护车 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Phone className="w-5 h-5 text-orange-600" />
            <span>救护车</span>
          </h4>
          <input
            type="text"
            placeholder="电话号码"
            value={editedInfo.ambulance.number || ''}
            onChange={(e) => handleInputChange('ambulance', 'number', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-2"
          />
          <input
            type="text"
            placeholder="名称"
            value={editedInfo.ambulance.name || ''}
            onChange={(e) => handleInputChange('ambulance', 'name', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* 大使馆信息 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Building className="w-5 h-5 text-blue-600" />
          <span>大使馆/领事馆</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="机构名称"
            value={editedInfo.embassy.name || ''}
            onChange={(e) => handleEmbassyChange('name', e.target.value)}
            className="p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="电话号码"
            value={editedInfo.embassy.phone || ''}
            onChange={(e) => handleEmbassyChange('phone', e.target.value)}
            className="p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="地址"
            value={editedInfo.embassy.address || ''}
            onChange={(e) => handleEmbassyChange('address', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <input
          type="text"
          placeholder="紧急联络电话"
          value={editedInfo.embassy.emergency || ''}
          onChange={(e) => handleEmbassyChange('emergency', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* 医院列表 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-800 flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-green-600" />
            <span>当地医院</span>
          </h4>
          <button
            type="button"
            onClick={addHospital}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <Plus className="w-4 h-4" />
            <span>添加医院</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {editedInfo.hospitals.map((hospital, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="医院名称"
                  value={hospital.name}
                  onChange={(e) => updateHospital(index, 'name', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="电话号码"
                  value={hospital.phone}
                  onChange={(e) => updateHospital(index, 'phone', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="地址"
                  value={hospital.address}
                  onChange={(e) => updateHospital(index, 'address', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeHospital(index)}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>删除</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Save className="w-4 h-4" />
          <span>保存更改</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          <X className="w-4 h-4" />
          <span>取消</span>
        </button>
      </div>
    </form>
  );
};

export default function EmergencyInfo({ emergencyInfo, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  
  if (!emergencyInfo) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">暂无紧急信息</p>
      </div>
    );
  }

  // 如果没有onUpdate函数，则只读模式
  const editable = !!onUpdate;

  return (
    <div className="space-y-6">
      {editable && (
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>取消</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>编辑</span>
              </>
            )}
          </button>
        </div>
      )}
      
      {/* 编辑模式 */}
      {isEditing && editable && (
        <EmergencyInfoEditor
          emergencyInfo={emergencyInfo}
          onSave={(updatedInfo) => {
            onUpdate(updatedInfo);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
      
      {/* 只读模式 */}
      {!isEditing && (
        <React.Fragment>
          <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-xl font-bold">紧急联系方式</h3>
            </div>
            <p className="text-sm opacity-90">如遇紧急情况，请立即拨打以下电话</p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{emergencyInfo.localPolice?.name || '报警电话'}</h4>
                  <p className="text-3xl font-bold text-red-600">{emergencyInfo.localPolice?.number || '110'}</p>
                </div>
              </div>
              <a
                href={`tel:${emergencyInfo.localPolice?.number || '110'}`}
                className="block w-full py-3 bg-red-500 text-white text-center rounded-lg hover:bg-red-600 transition font-medium"
              >
                立即拨打
              </a>
            </div>
      
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{emergencyInfo.ambulance?.name || '救护车'}</h4>
                  <p className="text-3xl font-bold text-orange-600">{emergencyInfo.ambulance?.number || '119'}</p>
                </div>
              </div>
              <a
                href={`tel:${emergencyInfo.ambulance?.number || '119'}`}
                className="block w-full py-3 bg-orange-500 text-white text-center rounded-lg hover:bg-orange-600 transition font-medium"
              >
                立即拨打
              </a>
            </div>
          </div>
      
          {emergencyInfo.embassy && emergencyInfo.embassy.name && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{emergencyInfo.embassy.name}</h4>
                  <p className="text-sm text-gray-500">中国驻当地大使馆/领事馆</p>
                </div>
              </div>
      
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">地址</p>
                    <p className="text-gray-800">{emergencyInfo.embassy.address}</p>
                  </div>
                </div>
      
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">电话</p>
                    <p className="text-gray-800">{emergencyInfo.embassy.phone}</p>
                  </div>
                </div>
      
                {emergencyInfo.embassy.emergency && (
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">紧急联络</p>
                      <p className="text-red-600 font-semibold">{emergencyInfo.embassy.emergency}</p>
                      <a
                        href={`tel:${emergencyInfo.embassy.emergency}`}
                        className="inline-block mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                      >
                        紧急呼叫
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      
          {emergencyInfo.hospitals && emergencyInfo.hospitals.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">当地医院</h4>
                  <p className="text-sm text-gray-500">周边医疗机构</p>
                </div>
              </div>
      
              <div className="space-y-4">
                {emergencyInfo.hospitals.map((hospital, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-800">{hospital.name}</h5>
                      <a
                        href={`tel:${hospital.phone}`}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        <span>拨打</span>
                      </a>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-600">{hospital.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}
