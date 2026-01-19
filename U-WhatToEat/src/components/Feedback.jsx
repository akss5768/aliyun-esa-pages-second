import { useState } from 'react';
import { Star, MessageCircle, Send, Check } from 'lucide-react';

export default function Feedback({ currentDish, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (currentDish) {
      onSubmit({
        dishName: currentDish.name,
        category: currentDish.category,
        rating,
        feedback: feedback.trim() || '无反馈'
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedback('');
        setRating(5);
      }, 2000);
    }
  };

  if (!currentDish) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">先推荐菜品再给反馈</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">菜品反馈</h3>
            <p className="text-sm opacity-90">对推荐的菜品进行评价</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center mb-6">
          <p className="text-gray-500 mb-2">当前推荐菜品</p>
          <h4 className="text-2xl font-bold text-gray-800">{currentDish.name}</h4>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
            currentDish.category === '中餐' ? 'bg-red-100 text-red-700' :
            currentDish.category === '西餐' ? 'bg-blue-100 text-blue-700' :
            currentDish.category === '日韩料理' ? 'bg-green-100 text-green-700' :
            currentDish.category === '快餐' ? 'bg-yellow-100 text-yellow-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {currentDish.category}
          </span>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">评分</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">评价反馈</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="说说你的想法...（可选）"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition font-semibold"
            >
              <Send className="w-5 h-5" />
              <span>提交评价</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">评价已提交</h4>
            <p className="text-gray-500">感谢您的反馈！</p>
          </div>
        )}
      </div>
    </div>
  );
}
