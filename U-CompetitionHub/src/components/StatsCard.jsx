import { Clock, Trophy, TrendingUp, CheckCircle } from 'lucide-react';

export default function StatsCard({ competitions, onStatusFilter, selectedStatus }) {
  const total = competitions.length;
  const active = competitions.filter(c => c.status === '进行中').length;
  const upcoming = competitions.filter(c => c.status === '即将开始').length;
  const finished = competitions.filter(c => c.status === '已结束').length;

  const stats = [
    { label: '全部竞赛', value: total, icon: Trophy, color: 'text-blue-500', bgColor: 'bg-blue-100', status: '' },
    { label: '即将开始', value: upcoming, icon: TrendingUp, color: 'text-yellow-500', bgColor: 'bg-yellow-100', status: '即将开始' },
    { label: '进行中', value: active, icon: Clock, color: 'text-green-500', bgColor: 'bg-green-100', status: '进行中' },
    { label: '已结束', value: finished, icon: CheckCircle, color: 'text-gray-500', bgColor: 'bg-gray-100', status: '已结束' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isActive = selectedStatus === stat.status;
        return (
          <div 
            key={index} 
            onClick={() => onStatusFilter(stat.status)}
            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} ${stat.color} rounded-lg mb-3`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
