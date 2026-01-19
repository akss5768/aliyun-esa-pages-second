import { useState, useEffect } from 'react';
import { History as HistoryIcon, TrendingUp, CheckCircle2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getMonth, getYear, addMonths, subMonths, getDay, startOfWeek } from 'date-fns';

export default function History({ history, onUpdate }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(() => {
    const saved = localStorage.getItem('dailyTask_showCalendar');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('dailyTask_showCalendar', JSON.stringify(showCalendar));
  }, [showCalendar]);

  if (!history || history.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <HistoryIcon className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">历史记录</h3>
              <p className="text-sm opacity-90">任务完成情况追踪</p>
            </div>
          </div>
        </div>

        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md">
          <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">暂无历史记录</p>
          <p className="text-sm">完成任务后会自动记录到历史</p>
        </div>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalDays = history.length;
  const totalTasks = history.reduce((sum, day) => sum + day.total, 0);
  const completedTasks = history.reduce((sum, day) => sum + day.completed, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  calendarDays.push(...monthDays);

  const getHistoryForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return history.find(h => h.date === dateStr);
  };

  const handleDateClick = (date) => {
    const historyData = getHistoryForDate(date);
    if (historyData) {
      setSelectedDate(date);
    }
  };

  const filteredHistory = selectedDate
    ? sortedHistory.filter(h => h.date === format(selectedDate, 'yyyy-MM-dd'))
    : sortedHistory;

  const displayedHistory = selectedDate && filteredHistory.length > 0 ? filteredHistory : sortedHistory;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HistoryIcon className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">历史记录</h3>
              <p className="text-sm opacity-90">任务完成情况追踪</p>
            </div>
          </div>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">{showCalendar ? '隐藏日历' : '显示日历'}</span>
          </button>
        </div>
      </div>

      {showCalendar && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold text-gray-800">
              {format(currentMonth, 'yyyy年MM月')}
            </h4>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="min-h-[60px]"></div>;
              }

              const historyData = getHistoryForDate(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={date.getTime()}
                  onClick={() => historyData && handleDateClick(date)}
                  disabled={!historyData}
                  className={`
                    p-2 rounded-lg text-center transition min-h-[60px] flex flex-col items-center justify-center
                    ${historyData
                      ? 'cursor-pointer hover:bg-green-50 hover:scale-105'
                      : 'text-gray-300 cursor-not-allowed'
                    }
                    ${isSelected ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                    ${isTodayDate && !isSelected ? 'border-2 border-blue-500' : ''}
                  `}
                >
                  <div className="text-sm font-medium">
                    {format(date, 'd')}
                  </div>
                  {historyData && (
                    <div className={`text-xs mt-1 ${isSelected ? 'text-white' : 'text-green-600'}`}>
                      {historyData.completed}/{historyData.total}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 w-full py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition font-medium"
            >
              显示全部历史
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{totalDays}</div>
          <div className="text-sm text-gray-500">记录天数</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-gray-500">已完成任务</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{totalTasks}</div>
          <div className="text-sm text-gray-500">总任务数</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{completionRate}%</div>
          <div className="text-sm text-gray-500">完成率</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h4 className="text-lg font-bold text-gray-800">
            {selectedDate ? format(selectedDate, 'yyyy-MM-dd') + ' 的任务' : '完成趋势'}
          </h4>
        </div>

        {displayedHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>该日期没有任务记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedHistory.map((day) => {
              const dayCompletionRate = day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0;
              const isPerfect = day.completed === day.total;
              
              return (
                <div key={day.date} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {isPerfect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      <span className="font-semibold text-gray-800">
                        {format(new Date(day.date), 'yyyy-MM-dd')}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {day.completed} / {day.total} 任务
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isPerfect ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        dayCompletionRate >= 80 ? 'bg-blue-500' :
                        dayCompletionRate >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${dayCompletionRate}%` }}
                    />
                  </div>

                  {/* 详细任务列表 */}
                  <div className="space-y-2">
                    {day.tasks.map((task, taskIndex) => {
                      const isCompleted = taskIndex < day.completed;
                      return (
                        <div 
                          key={taskIndex} 
                          className={`flex items-center justify-between p-2 rounded text-sm ${
                            isCompleted 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300'
                            }`}>
                              {isCompleted && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                            <span>{task}</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-white">
                            {isCompleted ? '已完成' : '未完成'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}