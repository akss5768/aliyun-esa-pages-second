import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Clock, Target, GripVertical, RotateCcw, History as HistoryIcon } from 'lucide-react';
import { priorityLabels, priorityColors } from '../data/sampleData';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTask({ task, isCompleted, toggleTask, deleteTask, getPriorityBadge }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white rounded-xl shadow-md p-5 transition-all ${
      isCompleted ? 'opacity-60' : 'hover:shadow-lg'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => toggleTask(task.id)}
            className="flex-shrink-0 mt-1"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className={`text-lg font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                    {priorityLabels[task.priority]}优先级
                  </span>
                  <span className="text-sm text-gray-500">
                    {task.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>预计 {task.estimatedTime} 分钟</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            {...attributes}
            {...listeners}
            className="p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaskList({ dailyTasks, onUpdate, onDelete, onClear, onAddToHistory, onSaveProgress }) {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const savedCompletedTasks = localStorage.getItem('dailyTask_completedTasks');
    const savedCompletedTasksDate = localStorage.getItem('dailyTask_completedTasksDate');
    const today = new Date().toISOString().split('T')[0];

    if (savedCompletedTasks && savedCompletedTasksDate === today) {
      try {
        setCompletedTasks(JSON.parse(savedCompletedTasks));
      } catch (e) {
        console.error('Failed to parse completed tasks:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (completedTasks.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('dailyTask_completedTasks', JSON.stringify(completedTasks));
      localStorage.setItem('dailyTask_completedTasksDate', today);
    } else {
      localStorage.removeItem('dailyTask_completedTasks');
      localStorage.removeItem('dailyTask_completedTasksDate');
    }
  }, [completedTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleTask = (taskId) => {
    let newCompletedTasks;
    if (completedTasks.includes(taskId)) {
      newCompletedTasks = completedTasks.filter(id => id !== taskId);
    } else {
      newCompletedTasks = [...completedTasks, taskId];
    }
    setCompletedTasks(newCompletedTasks);
    
    // 如果有保存进度的回调，则调用它
    if (onSaveProgress) {
      setTimeout(() => onSaveProgress(), 0); // 使用setTimeout确保状态更新后再调用
    }
  };

  const getPriorityBadge = (priority) => {
    const config = {
      1: 'bg-red-100 text-red-700',
      2: 'bg-yellow-100 text-yellow-700',
      3: 'bg-green-100 text-green-700'
    };
    return config[priority] || config[2];
  };

  const deleteTask = (taskId) => {
    const newTasks = dailyTasks.filter(task => task.id !== taskId);
    const newCompletedTasks = completedTasks.filter(id => id !== taskId);
    setCompletedTasks(newCompletedTasks);
    onDelete(newTasks);
    
    // 如果有保存进度的回调，则调用它
    if (onSaveProgress) {
      setTimeout(() => onSaveProgress(), 0);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = dailyTasks.findIndex((task) => task.id === active.id);
      const newIndex = dailyTasks.findIndex((task) => task.id === over.id);
      const newTasks = arrayMove(dailyTasks, oldIndex, newIndex);
      onUpdate(newTasks);
      
      // 如果有保存进度的回调，则调用它
      if (onSaveProgress) {
        setTimeout(() => onSaveProgress(), 0);
      }
    }
  };

  const allCompleted = dailyTasks.length > 0 && completedTasks.length === dailyTasks.length;

  if (!dailyTasks || dailyTasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">暂无任务</p>
        <p className="text-sm">先生成今日任务清单</p>
      </div>
    );
  }

  const handleClearTasks = () => {
    if (confirm('确定要清除今日任务吗？此操作不可撤销。')) {
      setCompletedTasks([]);
      onClear();
      
      // 如果有保存进度的回调，则调用它
      if (onSaveProgress) {
        setTimeout(() => onSaveProgress(), 0);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">今日任务</h3>
            <p className="text-sm opacity-90">完成进度：{completedTasks.length} / {dailyTasks.length}</p>
          </div>
          <div className="flex items-center space-x-2">
            {allCompleted && (
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">全部完成！</span>
              </div>
            )}
            <button
              onClick={() => onAddToHistory && onAddToHistory(dailyTasks, completedTasks.length)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              title="保存到历史记录"
            >
              <HistoryIcon className="w-5 h-5" />
              <span className="text-sm font-medium">保存历史</span>
            </button>
            <button
              onClick={handleClearTasks}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              title="清除今日任务"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-sm font-medium">清除</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${dailyTasks.length > 0 ? (completedTasks.length / dailyTasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={dailyTasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {dailyTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <SortableTask
                  key={task.id}
                  task={task}
                  isCompleted={isCompleted}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                  getPriorityBadge={getPriorityBadge}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">预计总用时</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {dailyTasks.reduce((sum, task) => sum + task.estimatedTime, 0)} 分钟
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-blue-800">已完成</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {dailyTasks.reduce((sum, task) =>
                completedTasks.includes(task.id) ? sum + task.estimatedTime : sum,
                0
              )} 分钟
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
