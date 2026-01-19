import { useState, useEffect, useMemo } from 'react';
import { Trophy, Menu, X, RefreshCw, Star, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import CompetitionCard from './components/CompetitionCard';
import CompetitionDetail from './components/CompetitionDetail';
import FilterBar from './components/FilterBar';
import StatsCard from './components/StatsCard';
import { sampleCompetitions } from './data/competitionData';
import { storage } from './utils/storage';

function App() {
  const [competitions, setCompetitions] = useState(sampleCompetitions);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // 加载收藏数据
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('competitionBookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  useEffect(() => {
    const savedCompetitions = storage.get('competitionHub_competitions');
    if (savedCompetitions) {
      setCompetitions(savedCompetitions);
    }
  }, []);

  useEffect(() => {
    if (competitions.length > 0) {
      storage.set('competitionHub_competitions', competitions);
    }
  }, [competitions]);

  const filteredCompetitions = useMemo(() => {
    // 首先根据是否显示收藏来筛选
    const sourceCompetitions = showBookmarksOnly 
      ? competitions.filter(c => bookmarks.includes(c.id))
      : competitions;

    return sourceCompetitions.filter((competition) => {
      const matchesSearch =
        competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        competition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        competition.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === '' || competition.category === selectedCategory;

      const matchesStatus = selectedStatus === '' || competition.status === selectedStatus;

      const matchesLevel = selectedLevel === '' || competition.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesStatus && matchesLevel;
    });
  }, [competitions, bookmarks, showBookmarksOnly, searchTerm, selectedCategory, selectedStatus, selectedLevel]);

  // 重置页码当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, selectedLevel, showBookmarksOnly]);

  // 计算分页数据
  const totalPages = Math.ceil(filteredCompetitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompetitions = filteredCompetitions.slice(startIndex, endIndex);



  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedLevel('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadSampleData = () => {
    setCompetitions(sampleCompetitions);
    setSelectedCompetition(null);
    setShowBookmarksOnly(false);
    resetFilters();
    setShowMobileMenu(false);
  };

  const clearAllData = () => {
    if (confirm('确定要清空所有数据吗？')) {
      storage.remove('competitionHub_competitions');
      localStorage.removeItem('competitionBookmarks');
      setCompetitions([]);
      setBookmarks([]);
      setShowBookmarksOnly(false);
      setSelectedCompetition(null);
      resetFilters();
    }
  };

  // 切换收藏状态
  const toggleBookmark = (competitionId) => {
    const newBookmarks = bookmarks.includes(competitionId)
      ? bookmarks.filter(id => id !== competitionId)
      : [...bookmarks, competitionId];
    
    setBookmarks(newBookmarks);
    localStorage.setItem('competitionBookmarks', JSON.stringify(newBookmarks));
  };

  const bookmarkedCompetitions = competitions.filter(c => bookmarks.includes(c.id));

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8" />
              <h1 className="text-xl font-bold">U-CompetitionHub</h1>
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex items-center space-x-4 text-sm">
              <span className="opacity-90">共 {competitions.length} 个竞赛</span>
              <span className="opacity-90">已收藏 {bookmarks.length} 个</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${
            showMobileMenu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 md:hidden">
            <button
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
              <span>关闭菜单</span>
            </button>
          </div>

          <div className="p-4 space-y-2">
            <button
              onClick={() => {
                setShowBookmarksOnly(false);
                setSelectedCompetition(null);
                setShowMobileMenu(false);
                resetFilters();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                !showBookmarksOnly && !selectedCompetition 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="font-medium">竞赛列表</span>
            </button>

            <button
              onClick={() => {
                setShowBookmarksOnly(true);
                setSelectedCompetition(null);
                setShowMobileMenu(false);
                resetFilters();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                showBookmarksOnly && !selectedCompetition
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Star className="w-5 h-5" />
              <span className="font-medium">我的收藏</span>
            </button>
          </div>

          <div className="border-t p-4 space-y-2">
            <button
              onClick={loadSampleData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              <span>加载示例数据</span>
            </button>

            <button
              onClick={clearAllData}
              className="w-full px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
            >
              清空数据
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {selectedCompetition ? (
              <CompetitionDetail
                competition={selectedCompetition}
                onBack={() => setSelectedCompetition(null)}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
              />
            ) : (
              <>
                {showBookmarksOnly && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-white">
                      <Star className="w-6 h-6 fill-white" />
                      <div>
                        <h3 className="text-lg font-bold">我的收藏</h3>
                        <p className="text-sm opacity-90">共收藏 {bookmarks.length} 个竞赛</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowBookmarksOnly(false);
                        resetFilters();
                      }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition font-medium"
                    >
                      返回全部
                    </button>
                  </div>
                )}
                <StatsCard 
                  competitions={showBookmarksOnly ? bookmarkedCompetitions : competitions}
                  onStatusFilter={setSelectedStatus}
                  selectedStatus={selectedStatus}
                />
                <FilterBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  selectedLevel={selectedLevel}
                  onLevelChange={setSelectedLevel}
                  onResetFilters={resetFilters}
                />

                {filteredCompetitions.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    {showBookmarksOnly ? (
                      <>
                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          {bookmarks.length === 0 ? '还没有收藏任何竞赛' : '未找到符合条件的收藏竞赛'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {bookmarks.length === 0 
                            ? '浏览竞赛列表，点击星标按钮收藏感兴趣的竞赛' 
                            : '请调整筛选条件或搜索关键词'}
                        </p>
                        <div className="flex justify-center space-x-3">
                          {bookmarks.length === 0 ? (
                            <button
                              onClick={() => {
                                setShowBookmarksOnly(false);
                                resetFilters();
                              }}
                              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                              浏览竞赛
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={resetFilters}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                              >
                                清除筛选
                              </button>
                              <button
                                onClick={() => {
                                  setShowBookmarksOnly(false);
                                  resetFilters();
                                }}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                              >
                                查看全部
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">未找到符合条件的竞赛</h3>
                        <p className="text-gray-500 mb-4">请调整筛选条件或搜索关键词</p>
                        <button
                          onClick={resetFilters}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          清除筛选
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        找到 {filteredCompetitions.length} 个竞赛
                      </h2>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">每页显示:</label>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value={6}>6 个</option>
                          <option value={9}>9 个</option>
                          <option value={12}>12 个</option>
                          <option value={18}>18 个</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {paginatedCompetitions.map((competition) => (
                        <CompetitionCard
                          key={competition.id}
                          competition={competition}
                          onClick={() => setSelectedCompetition(competition)}
                          bookmarks={bookmarks}
                          onToggleBookmark={toggleBookmark}
                        />
                      ))}
                    </div>

                    {/* 分页控制 */}
                    {totalPages > 1 && (
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-sm text-gray-600">
                            显示第 {startIndex + 1} - {Math.min(endIndex, filteredCompetitions.length)} 条，共 {filteredCompetitions.length} 条
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="上一页"
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="flex space-x-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                // 只显示部分页码
                                const showPage =
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 && page <= currentPage + 1);

                                if (!showPage) {
                                  return null;
                                }

                                return (
                                  <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-lg font-medium transition ${
                                      currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="下一页"
                            >
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowMobileMenu(false)} />
      )}
    </div>
  );
}

export default App;
