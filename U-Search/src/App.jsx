import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout, message } from 'antd';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

const { Content } = Layout;

const App = () => {
  const [language, setLanguage] = useState('zh');
  const [searchEngines, setSearchEngines] = useState([]);
  const [defaultEngine, setDefaultEngine] = useState('');
  
  // 初始化搜索引擎配置
  useEffect(() => {
    const savedEngines = localStorage.getItem('searchEngines');
    const savedDefault = localStorage.getItem('defaultEngine');
    
    if (savedEngines) {
      setSearchEngines(JSON.parse(savedEngines));
    } else {
      // 默认搜索引擎配置
      const defaultEngines = [
        { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=', enabled: true, icon: 'Google' },
        { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=', enabled: true, icon: 'Baidu' },
        { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q=', enabled: true, icon: 'Bing' },
        { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', enabled: true, icon: 'DuckDuckGo' },
        { id: 'sogou', name: '搜狗', url: 'https://www.sogou.com/web?query=', enabled: true, icon: 'Sogou' }
      ];
      setSearchEngines(defaultEngines);
      localStorage.setItem('searchEngines', JSON.stringify(defaultEngines));
    }
    
    if (savedDefault) {
      setDefaultEngine(savedDefault);
    } else {
      const defaultId = 'google';
      setDefaultEngine(defaultId);
      localStorage.setItem('defaultEngine', defaultId);
    }
  }, []);
  
  // 保存搜索引擎配置
  const saveSearchEngines = (engines) => {
    setSearchEngines(engines);
    localStorage.setItem('searchEngines', JSON.stringify(engines));
    message.success(language === 'zh' ? '搜索引擎配置已保存' : 'Search engines configuration saved');
  };
  
  // 保存默认搜索引擎
  const saveDefaultEngine = (engineId) => {
    setDefaultEngine(engineId);
    localStorage.setItem('defaultEngine', engineId);
    message.success(language === 'zh' ? '默认搜索引擎已设置' : 'Default search engine set');
  };
  
  // 切换语言
  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
  };
  
  return (
    <HashRouter>
      <Layout className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
        <Header 
          language={language} 
          toggleLanguage={toggleLanguage} 
        />
        <Content className="flex-grow p-4 md:p-6 bg-gray-800/30">
          <Routes>
            <Route path="/" element={
              <SearchPage 
                language={language}
                searchEngines={searchEngines}
                defaultEngine={defaultEngine}
              />
            } />
            <Route path="/history" element={<HistoryPage language={language} />} />
            <Route path="/settings" element={
              <SettingsPage 
                language={language}
                searchEngines={searchEngines}
                defaultEngine={defaultEngine}
                onSaveEngines={saveSearchEngines}
                onSaveDefault={saveDefaultEngine}
              />
            } />
          </Routes>
        </Content>
      </Layout>
    </HashRouter>
  );
};

export default App;