import { useState } from 'react';
import { Clock, MapPin, Plane, Hotel, Utensils, Camera, ShoppingBag, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

const typeIcons = {
  transport: Plane,
  accommodation: Hotel,
  dining: Utensils,
  sightseeing: Camera,
  shopping: ShoppingBag
};

const typeColors = {
  transport: 'bg-blue-500',
  accommodation: 'bg-purple-500',
  dining: 'bg-orange-500',
  sightseeing: 'bg-green-500',
  shopping: 'bg-pink-500'
};

const activityTypes = [
  { value: 'transport', label: '交通', color: 'bg-blue-500' },
  { value: 'accommodation', label: '住宿', color: 'bg-purple-500' },
  { value: 'dining', label: '餐饮', color: 'bg-orange-500' },
  { value: 'sightseeing', label: '观光', color: 'bg-green-500' },
  { value: 'shopping', label: '购物', color: 'bg-pink-500' }
];

export default function Timeline({ schedule, onUpdate }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [editingActivity, setEditingActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
    time: '',
    activity: '',
    location: '',
    type: 'sightseeing'
  });
  
  const editable = !!onUpdate;

  if (!schedule || schedule.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">暂无行程安排</p>
        <p className="text-sm">点击下方按钮添加新的行程</p>
        {editable && (
          <button
            onClick={() => {
              const newSchedule = [{
                day: 1,
                date: new Date().toISOString().split('T')[0],
                activities: []
              }];
              onUpdate(newSchedule);
            }}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            新建行程
          </button>
        )}
      </div>
    );
  }

  const currentDay = schedule[selectedDay];

  const addActivity = () => {
    if (newActivity.time && newActivity.activity && newActivity.location) {
      const updatedSchedule = [...schedule];
      updatedSchedule[selectedDay] = {
        ...currentDay,
        activities: [...currentDay.activities, { ...newActivity }]
      };
      onUpdate(updatedSchedule);
      setNewActivity({ time: '', activity: '', location: '', type: 'sightseeing' });
    }
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      activities: updatedSchedule[dayIndex].activities.filter((_, i) => i !== activityIndex)
    };
    onUpdate(updatedSchedule);
  };

  const updateActivity = (dayIndex, activityIndex, updatedActivity) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].activities[activityIndex] = updatedActivity;
    onUpdate(updatedSchedule);
    setEditingActivity(null);
  };

  const addDay = () => {
    const lastDay = schedule[schedule.length - 1];
    const newDayNumber = lastDay.day + 1;
    const newDate = new Date(lastDay.date);
    newDate.setDate(newDate.getDate() + 1);
    const newDateString = newDate.toISOString().split('T')[0];
    
    const updatedSchedule = [
      ...schedule,
      {
        day: newDayNumber,
        date: newDateString,
        activities: []
      }
    ];
    onUpdate(updatedSchedule);
    setSelectedDay(updatedSchedule.length - 1);
  };

  const removeDay = (dayIndex) => {
    if (schedule.length <= 1) return; // 至少保留一天
    const updatedSchedule = schedule.filter((_, i) => i !== dayIndex);
    // 重置天数编号
    const resortedSchedule = updatedSchedule.map((day, idx) => ({
      ...day,
      day: idx + 1
    }));
    onUpdate(resortedSchedule);
    if (selectedDay >= resortedSchedule.length) {
      setSelectedDay(resortedSchedule.length - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-2">
        {schedule.map((day, index) => (
          <div key={`${day.day}-${index}`} className="flex items-center space-x-1">
            <button
              onClick={() => setSelectedDay(index)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedDay === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              第 {day.day} 天
            </button>
            {editable && (
              <button
                onClick={() => removeDay(index)}
                disabled={schedule.length <= 1}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {editable && (
          <button
            onClick={addDay}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>添加天数</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            第 {currentDay.day} 天 - {currentDay.date}
          </h3>
          {editable && (
            <button
              onClick={addDay}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Plus className="w-4 h-4" />
              <span>添加活动</span>
            </button>
          )}
        </div>

        {editable && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">添加新活动</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">时间</label>
                <input
                  type="time"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">活动</label>
                <input
                  type="text"
                  value={newActivity.activity}
                  onChange={(e) => setNewActivity({...newActivity, activity: e.target.value})}
                  placeholder="活动内容"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地点</label>
                <input
                  type="text"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                  placeholder="地点"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={addActivity}
              className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              添加活动
            </button>
          </div>
        )}

        <div className="relative space-y-6 before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
          {currentDay.activities.map((activity, index) => {
            const Icon = typeIcons[activity.type] || MapPin;
            
            if (editingActivity === `${selectedDay}-${index}`) {
              return (
                <div key={index} className="relative pl-12 bg-blue-50 p-4 rounded-lg">
                  <div className={`absolute left-0 w-8 h-8 rounded-full ${typeColors[activity.type]} flex items-center justify-center text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        type="time"
                        value={activity.time}
                        onChange={(e) => {
                          const updated = {...activity, time: e.target.value};
                          updateActivity(selectedDay, index, updated);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={activity.activity}
                        onChange={(e) => {
                          const updated = {...activity, activity: e.target.value};
                          updateActivity(selectedDay, index, updated);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={activity.location}
                        onChange={(e) => {
                          const updated = {...activity, location: e.target.value};
                          updateActivity(selectedDay, index, updated);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={activity.type}
                        onChange={(e) => {
                          const updated = {...activity, type: e.target.value};
                          updateActivity(selectedDay, index, updated);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        {activityTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => setEditingActivity(null)}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>取消</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={index} className="relative pl-12">
                <div className={`absolute left-0 w-8 h-8 rounded-full ${typeColors[activity.type]} flex items-center justify-center text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-700">{activity.time}</span>
                    </div>
                    <div className="flex space-x-2">
                      {editable && (
                        <button
                          onClick={() => setEditingActivity(`${selectedDay}-${index}`)}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {editable && (
                        <button
                          onClick={() => removeActivity(selectedDay, index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {activity.activity}
                  </h4>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {activity.location}
                  </div>
                  
                  <span className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'transport' ? 'bg-blue-100 text-blue-700' :
                    activity.type === 'accommodation' ? 'bg-purple-100 text-purple-700' :
                    activity.type === 'dining' ? 'bg-orange-100 text-orange-700' :
                    activity.type === 'sightseeing' ? 'bg-green-100 text-green-700' :
                    'bg-pink-100 text-pink-700'
                  }`}>
                    {activity.type === 'transport' ? '交通' :
                     activity.type === 'accommodation' ? '住宿' :
                     activity.type === 'dining' ? '餐饮' :
                     activity.type === 'sightseeing' ? '观光' : '购物'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {currentDay.activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>此日暂无活动安排</p>
          </div>
        )}
      </div>
    </div>
  );
}
