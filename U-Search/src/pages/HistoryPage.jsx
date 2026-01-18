import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Card, Button, Space, Tag, Empty, Popconfirm, message, Segmented, Collapse, Tooltip } from 'antd';
import { DeleteOutlined, SearchOutlined, FilterOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const HistoryPage = ({ language }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [filterEngine, setFilterEngine] = useState('all');
  const navigate = useNavigate();
  
  // 加载搜索历史
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);
  
  // 获取所有搜索引擎类型
  const getEngineTypes = () => {
    const engines = JSON.parse(localStorage.getItem('searchEngines') || '[]');
    return engines.map(engine => engine.id);
  };
  
  // 删除单条历史记录
  const deleteHistoryItem = (id) => {
    const updatedHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    message.success(language === 'zh' ? '记录已删除' : 'Record deleted');
  };
  
  // 清空所有历史记录
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.setItem('searchHistory', JSON.stringify([]));
    message.success(language === 'zh' ? '历史记录已清空' : 'History cleared');
  };
  
  // 重新搜索
  const reSearch = (query, engineId, filters = []) => {
    // 保存到历史记录
    const newRecord = {
      id: Date.now(),
      query,
      engineId,
      timestamp: new Date().toISOString(),
      filters
    };
    
    const updatedHistory = [newRecord, ...searchHistory];
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
    // 跳转到主页并执行搜索
    navigate(`/#/?query=${encodeURIComponent(query)}&engine=${engineId}`);
  };
  
  // 获取搜索引擎名称
  const getEngineName = (engineId) => {
    const engines = JSON.parse(localStorage.getItem('searchEngines') || '[]');
    const engine = engines.find(e => e.id === engineId);
    return engine ? engine.name : engineId;
  };
  
  // 获取语法类型标签
  const getSyntaxTypeLabel = (type) => {
    const labels = {
      site: language === 'zh' ? '站点限制' : 'Site',
      intitle: language === 'zh' ? '标题包含' : 'In Title',
      inurl: language === 'zh' ? '网址包含' : 'In URL',
      filetype: language === 'zh' ? '文件类型' : 'File Type',
      exact: language === 'zh' ? '精确匹配' : 'Exact Match'
    };
    return labels[type] || type;
  };
  
  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // 过滤历史记录
  const filteredHistory = filterEngine === 'all' 
    ? searchHistory 
    : searchHistory.filter(item => item.engineId === filterEngine);
  
  // 获取分段器选项
  const getSegmentedOptions = () => {
    const engines = JSON.parse(localStorage.getItem('searchEngines') || '[]');
    const options = [
      { label: language === 'zh' ? '全部' : 'All', value: 'all' }
    ];
    
    engines.forEach(engine => {
      options.push({ 
        label: engine.name, 
        value: engine.id 
      });
    });
    
    return options;
  };
  
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-100 mb-4 md:mb-0 flex items-center">
          <ClockCircleOutlined className="mr-2 text-blue-400" />
          {language === 'zh' ? '搜索历史' : 'Search History'}
        </h1>
        
        <div className="flex items-center space-x-4">
          <Segmented
            options={getSegmentedOptions()}
            value={filterEngine}
            onChange={setFilterEngine}
            size="middle"
            className="bg-gray-800 text-gray-200"
          />
          
          <Popconfirm
            title={language === 'zh' ? '确定清空所有历史记录吗？' : 'Clear all history records?'}
            onConfirm={clearAllHistory}
            okText={language === 'zh' ? '确定' : 'Yes'}
            cancelText={language === 'zh' ? '取消' : 'No'}
          >
            <Button 
              type="primary" 
              danger
              disabled={searchHistory.length === 0}
              className="bg-gradient-to-r from-red-600 to-orange-600 border-none hover:from-red-700 hover:to-orange-700 transition-all duration-300"
            >
              {language === 'zh' ? '清空记录' : 'Clear History'}
            </Button>
          </Popconfirm>
        </div>
      </div>
      
      {filteredHistory.length === 0 ? (
        <div className="flex justify-center items-center h-64 animate-fade-in">
          <Empty 
            description={language === 'zh' ? '暂无搜索历史' : 'No search history'} 
            imageStyle={{ height: 80 }}
            className="text-gray-400"
          />
        </div>
      ) : (
        <List
          dataSource={filteredHistory}
          renderItem={item => (
            <List.Item
              key={item.id}
              className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 mb-4 hover:border-blue-500/50 transition-all duration-300 history-item-animate"
            >
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div className="font-medium text-gray-100 mb-2 md:mb-0 truncate max-w-md">
                    {item.query}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Tag color="blue" className="bg-blue-900/30 border-blue-700 text-blue-200">
                      {getEngineName(item.engineId)}
                    </Tag>
                    <span className="text-sm text-gray-400">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                </div>
                
                {/* 显示搜索语法 */}
                {item.filters && item.filters.length > 0 && (
                  <div className="mb-3">
                    <Collapse bordered={false} size="small" className="bg-gray-800/30 border border-gray-700 rounded-md">
                      <Panel 
                        header={
                          <span className="flex items-center text-gray-300">
                            <FilterOutlined className="mr-2" />
                            <span>{language === 'zh' ? '搜索语法' : 'Search Syntax'}</span>
                            <span className="ml-2 text-gray-500 text-sm">({item.filters.length})</span>
                          </span>
                        } 
                        key="syntax"
                      >
                        <div className="flex flex-wrap gap-2">
                          {item.filters.map((filter, index) => (
                            <Tag key={index} color="blue" className="bg-blue-900/30 border-blue-700 text-blue-200">
                              <span className="font-medium mr-1">{getSyntaxTypeLabel(filter.type)}:</span>
                              {filter.value}
                            </Tag>
                          ))}
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Tooltip title={language === 'zh' ? '重新搜索' : 'Re-search'}>
                    <Button 
                      type="primary" 
                      icon={<SearchOutlined />}
                      onClick={() => reSearch(item.query, item.engineId, item.filters)}
                      size="small"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                    >
                      <span className="hidden md:inline">{language === 'zh' ? '重新搜索' : 'Re-search'}</span>
                    </Button>
                  </Tooltip>
                  
                  <Popconfirm
                    title={language === 'zh' ? '确定删除这条记录吗？' : 'Delete this record?'}
                    onConfirm={() => deleteHistoryItem(item.id)}
                    okText={language === 'zh' ? '确定' : 'Yes'}
                    cancelText={language === 'zh' ? '取消' : 'No'}
                  >
                    <Tooltip title={language === 'zh' ? '删除' : 'Delete'}>
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined className="text-red-400" />}
                        danger
                        size="small"
                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default HistoryPage;