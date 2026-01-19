import { Calendar, ExternalLink, Tag, Trophy, Users, Clock, DollarSign, Star } from 'lucide-react';
import { statusColors, levelColors } from '../data/competitionData';

export default function CompetitionCard({ competition, onClick, bookmarks, onToggleBookmark }) {
  const statusColor = statusColors[competition.status] || 'bg-gray-500';
  const levelColor = levelColors[competition.level] || 'bg-gray-500';
  const isBookmarked = bookmarks?.includes(competition.id);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onToggleBookmark(competition.id);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden relative"
    >
      <button
        onClick={handleBookmarkClick}
        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
        title={isBookmarked ? '取消收藏' : '添加收藏'}
      >
        <Star className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
      </button>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`${statusColor} text-white text-xs font-medium px-3 py-1 rounded-full`}>
            {competition.status}
          </span>
          <span className={`${levelColor} text-white text-xs font-medium px-3 py-1 rounded-full mr-12`}>
            {competition.level}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {competition.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {competition.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {competition.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            <span className="truncate">{competition.organizer}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-red-500" />
            <span>截止: {competition.deadline}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
            <span>{competition.registrationFee}</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="line-clamp-1">{competition.prize}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500">{competition.category}</span>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
