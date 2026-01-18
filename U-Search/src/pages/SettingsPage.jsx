import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, List, Switch, Input, Space, message, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, DragOutlined, CheckCircleOutlined, WarningOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';

const SettingsPage = ({ language, searchEngines, defaultEngine, onSaveEngines, onSaveDefault }) => {
  const [engines, setEngines] = useState(searchEngines);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  
  // 开始编辑搜索引擎
  const startEdit = (engine) => {
    setEditingId(engine.id);
    setEditForm({ ...engine });
  };
  
  // 保存编辑
  const saveEdit = () => {
    if (!editForm.name || !editForm.url) {
      message.error(language === 'zh' ? '请填写完整信息' : 'Please fill in all fields');
      return;
    }
    
    const updatedEngines = engines.map(engine => 
      engine.id === editingId ? { ...engine, ...editForm } : engine
    );
    
    setEngines(updatedEngines);
    setEditingId(null);
    setEditForm({});
    message.success(language === 'zh' ? '保存成功' : 'Saved successfully');
  };
  
  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };
  
  // 切换搜索引擎启用状态
  const toggleEngine = (id) => {
    const updatedEngines = engines.map(engine => 
      engine.id === id ? { ...engine, enabled: !engine.enabled } : engine
    );
    
    setEngines(updatedEngines);
  };
  
  // 删除搜索引擎
  const deleteEngine = (id) => {
    if (engines.length <= 1) {
      message.warning(language === 'zh' ? '至少保留一个搜索引擎' : 'Keep at least one search engine');
      return;
    }
    
    const updatedEngines = engines.filter(engine => engine.id !== id);
    setEngines(updatedEngines);
    
    // 如果删除的是默认搜索引擎，设置第一个为默认
    if (id === defaultEngine && updatedEngines.length > 0) {
      onSaveDefault(updatedEngines[0].id);
    }
    
    message.success(language === 'zh' ? '删除成功' : 'Deleted successfully');
  };
  
  // 添加新搜索引擎
  const addNewEngine = () => {
    const newEngine = {
      id: `custom_${Date.now()}`,
      name: language === 'zh' ? '新搜索引擎' : 'New Search Engine',
      url: 'https://example.com/search?q=',
      enabled: true,
      icon: 'Link'
    };
    
    const updatedEngines = [...engines, newEngine];
    setEngines(updatedEngines);
    startEdit(newEngine);
  };
  
  // 保存所有设置
  const saveAllSettings = () => {
    onSaveEngines(engines);
    
    // 如果当前默认引擎被禁用，设置第一个启用的为默认
    const defaultEngineObj = engines.find(e => e.id === defaultEngine);
    if (!defaultEngineObj || !defaultEngineObj.enabled) {
      const firstEnabled = engines.find(e => e.enabled);
      if (firstEnabled) {
        onSaveDefault(firstEnabled.id);
      }
    }
  };
  
  // 重置为默认设置
  const resetToDefault = () => {
    const defaultEngines = [
      { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=', enabled: true, icon: 'Google' },
      { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=', enabled: true, icon: 'Baidu' },
      { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q=', enabled: true, icon: 'Bing' },
      { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', enabled: true, icon: 'DuckDuckGo' },
      { id: 'sogou', name: '搜狗', url: 'https://www.sogou.com/web?query=', enabled: true, icon: 'Sogou' }
    ];
    
    setEngines(defaultEngines);
    onSaveDefault('google');
    message.success(language === 'zh' ? '已重置为默认设置' : 'Reset to default settings');
  };
  
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-100 mb-4 md:mb-0">
          {language === 'zh' ? '搜索引擎设置' : 'Search Engine Settings'}
        </h1>
        
        <div className="flex space-x-2">
          <Tooltip title={language === 'zh' ? '添加搜索引擎' : 'Add Search Engine'}>
            <Button 
              onClick={addNewEngine}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
            >
              <span className="hidden md:inline">{language === 'zh' ? '添加搜索引擎' : 'Add Search Engine'}</span>
            </Button>
          </Tooltip>
          
          <Popconfirm
            title={language === 'zh' ? '确定重置所有设置吗？' : 'Reset all settings?'}
            onConfirm={resetToDefault}
            okText={language === 'zh' ? '确定' : 'Yes'}
            cancelText={language === 'zh' ? '取消' : 'No'}
          >
            <Tooltip title={language === 'zh' ? '重置默认' : 'Reset Default'}>
              <Button className="bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 hover:from-gray-600 hover:to-gray-700 transition-all duration-300">
                <ReloadOutlined />
                <span className="hidden md:inline ml-1">{language === 'zh' ? '重置默认' : 'Reset Default'}</span>
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
      
      <Card className="mb-6 bg-gray-800/50 border border-gray-700 animate-fade-in-up delay-100">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          {language === 'zh' ? '默认搜索引擎' : 'Default Search Engine'}
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {engines.filter(e => e.enabled).map(engine => (
            <Button
              key={engine.id}
              type={defaultEngine === engine.id ? 'primary' : 'default'}
              onClick={() => onSaveDefault(engine.id)}
              icon={defaultEngine === engine.id ? <CheckCircleOutlined /> : null}
              className={`transition-all duration-300 ${defaultEngine === engine.id 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:from-blue-700 hover:to-cyan-700' 
                : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-blue-500'}`}
            >
              {engine.name}
            </Button>
          ))}
        </div>
      </Card>
      
      <Card className="bg-gray-800/50 border border-gray-700 animate-fade-in-up delay-200">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          {language === 'zh' ? '搜索引擎管理' : 'Search Engine Management'}
        </h2>
        
        <List
          dataSource={engines}
          renderItem={engine => (
            <List.Item 
              key={engine.id}
              className="bg-gray-800/30 rounded-lg border border-gray-700 p-4 mb-4 hover:border-blue-500/50 transition-all duration-300 settings-item-animate"
            >
              {editingId === engine.id ? (
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {language === 'zh' ? '名称' : 'Name'}
                      </label>
                      <Input 
                        value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    
                    <div className="md:col-span-7">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        URL {language === 'zh' ? '模板' : 'Template'}
                      </label>
                      <Input 
                        value={editForm.url}
                        onChange={e => setEditForm({...editForm, url: e.target.value})}
                        placeholder="https://example.com/search?q="
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex items-end">
                      <Switch 
                        checked={editForm.enabled}
                        onChange={checked => setEditForm({...editForm, enabled: checked})}
                        checkedChildren={language === 'zh' ? '启用' : 'Enabled'}
                        unCheckedChildren={language === 'zh' ? '禁用' : 'Disabled'}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      onClick={saveEdit} 
                      type="primary"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                    >
                      {language === 'zh' ? '保存' : 'Save'}
                    </Button>
                    <Button 
                      onClick={cancelEdit}
                      className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 transition-all duration-300"
                    >
                      {language === 'zh' ? '取消' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-3 md:mb-0">
                    <DragOutlined className="text-gray-500 mr-3 cursor-move" />
                    <div>
                      <div className="font-medium text-gray-100">{engine.name}</div>
                      <div className="text-sm text-gray-400 truncate max-w-md">
                        {engine.url}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={engine.enabled}
                      onChange={() => toggleEngine(engine.id)}
                      checkedChildren={language === 'zh' ? '启用' : 'Enabled'}
                      unCheckedChildren={language === 'zh' ? '禁用' : 'Disabled'}
                      className="bg-gray-700"
                    />
                    
                    <Tooltip title={language === 'zh' ? '编辑' : 'Edit'}>
                      <Button 
                        icon={<EditOutlined className="text-gray-300" />}
                        onClick={() => startEdit(engine)}
                        size="small"
                        className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-blue-500 transition-all duration-300"
                      />
                    </Tooltip>
                    
                    <Popconfirm
                      title={language === 'zh' ? '确定删除这个搜索引擎吗？' : 'Delete this search engine?'}
                      onConfirm={() => deleteEngine(engine.id)}
                      okText={language === 'zh' ? '确定' : 'Yes'}
                      cancelText={language === 'zh' ? '取消' : 'No'}
                    >
                      <Tooltip title={language === 'zh' ? '删除' : 'Delete'}>
                        <Button 
                          icon={<DeleteOutlined className="text-red-400" />}
                          danger
                          size="small"
                          className="bg-gray-700 border-gray-600 text-red-400 hover:bg-gray-600 hover:border-red-500 hover:text-red-300 transition-all duration-300"
                        />
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
              )}
            </List.Item>
          )}
        />
      </Card>
      
      <div className="flex justify-end space-x-3 mt-6 animate-fade-in-up delay-300">
        <Button 
          onClick={saveAllSettings} 
          type="primary"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
        >
          <SaveOutlined />
          <span className="ml-1">{language === 'zh' ? '保存设置' : 'Save Settings'}</span>
        </Button>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 transition-all duration-300"
        >
          {language === 'zh' ? '返回主页' : 'Back to Home'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;