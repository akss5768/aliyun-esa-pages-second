import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Button, Tooltip } from 'antd';
import { SearchOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';

const { Header } = Layout;

const AppHeader = ({ language, toggleLanguage }) => {
  return (
    <Header className="flex items-center justify-between px-4 md:px-6 bg-gray-900/90 border-b border-gray-700 shadow-lg backdrop-blur-sm">
      <div className="flex items-center animate-fade-in">
        <Link 
          to="/" 
          className="text-xl font-bold text-blue-400 flex items-center hover:text-blue-300 transition-all duration-300"
        >
          <div className="relative mr-2">
            <SearchOutlined className="text-blue-400 animate-pulse" />
            <div className="absolute inset-0 bg-blue-400 rounded-full filter blur-md opacity-30 animate-ping"></div>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            {language === 'zh' ? '聚合搜索' : 'Aggregate Search'}
          </span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        <Tooltip title={language === 'zh' ? '搜索历史' : 'Search History'}>
          <Button 
            type="text" 
            icon={<HistoryOutlined className="text-gray-300 hover:text-blue-300 transition-colors" />}
            onClick={() => window.location.hash = '/history'}
            className="flex items-center text-gray-300 hover:text-blue-300 transition-colors duration-300"
          >
            <span className="hidden md:inline ml-1">{language === 'zh' ? '历史记录' : 'History'}</span>
          </Button>
        </Tooltip>
        
        <Tooltip title={language === 'zh' ? '设置' : 'Settings'}>
          <Button 
            type="text" 
            icon={<SettingOutlined className="text-gray-300 hover:text-blue-300 transition-colors" />}
            onClick={() => window.location.hash = '/settings'}
            className="flex items-center text-gray-300 hover:text-blue-300 transition-colors duration-300"
          >
            <span className="hidden md:inline ml-1">{language === 'zh' ? '设置' : 'Settings'}</span>
          </Button>
        </Tooltip>
        
        <Tooltip title={language === 'zh' ? '切换语言' : 'Toggle Language'}>
          <Button 
            onClick={toggleLanguage}
            className="ml-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-blue-500 transition-all duration-300"
          >
            {language === 'zh' ? 'EN' : '中文'}
          </Button>
        </Tooltip>
      </div>
    </Header>
  );
};

export default AppHeader;