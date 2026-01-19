import { ArrowLeft, Calendar, ExternalLink, Tag, Trophy, Users, Clock, DollarSign, Info, Share2, Star } from 'lucide-react';
import { statusColors, levelColors } from '../data/competitionData';

export default function CompetitionDetail({ competition, onBack, bookmarks, onToggleBookmark }) {
  const statusColor = statusColors[competition.status] || 'bg-gray-500';
  const levelColor = levelColors[competition.level] || 'bg-gray-500';
  const isBookmarked = bookmarks?.includes(competition.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: competition.title,
          text: competition.description,
          url: competition.url
        });
      } catch (error) {
        console.error('分享失败:', error);
      }
    }
  };

  const handleBookmark = () => {
    onToggleBookmark(competition.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white/90 hover:text-white mb-4 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回列表</span>
        </button>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`${statusColor} text-white text-sm font-medium px-3 py-1 rounded-full`}>
              {competition.status}
            </span>
            <span className={`${levelColor} text-white text-sm font-medium px-3 py-1 rounded-full`}>
              {competition.level}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              title="分享"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition ${
                isBookmarked 
                  ? 'bg-yellow-400 hover:bg-yellow-500' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
              title={isBookmarked ? '取消收藏' : '添加收藏'}
            >
              <Star className={`w-5 h-5 ${isBookmarked ? 'fill-white text-white' : ''}`} />
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">{competition.title}</h1>
        <p className="text-white/90">{competition.category}</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center mb-3">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">竞赛简介</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">{competition.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-900">主办单位</h3>
            </div>
            <p className="text-gray-600">{competition.organizer}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-semibold text-gray-900">报名截止</h3>
            </div>
            <p className="text-gray-600">{competition.deadline}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-900">报名费用</h3>
            </div>
            <p className="text-gray-600">{competition.registrationFee}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="font-semibold text-gray-900">奖项设置</h3>
            </div>
            <p className="text-gray-600">{competition.prize}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <Clock className="w-5 h-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">参赛要求</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">{competition.requirements}</p>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <Tag className="w-5 h-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">相关标签</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {competition.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition cursor-pointer"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <a
            href={competition.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition font-medium"
          >
            <ExternalLink className="w-5 h-5" />
            <span>访问官网</span>
          </a>
        </div>
      </div>
    </div>
  );
}
