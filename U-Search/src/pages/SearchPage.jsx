import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, Space, Tag, message, Dropdown, Menu, Modal, Select, Form, List, Tooltip } from 'antd';
import { SearchOutlined, GoogleOutlined, BaiduOutlined, LinkOutlined, InfoCircleOutlined, PlusOutlined, DeleteOutlined, RocketOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

// 搜索引擎图标映射
const EngineIcon = ({ engineName }) => {
  switch (engineName) {
    case 'Google':
      return <GoogleOutlined />;
    case '百度':
      return <BaiduOutlined />;
    default:
      return <LinkOutlined />;
  }
};

// 搜索语法类型
const SYNTAX_TYPES = [
  { value: 'site', label: '站点限制', placeholder: 'example.com', description: '限制搜索结果来自特定网站' },
  { value: 'intitle', label: '标题包含', placeholder: '关键词', description: '搜索标题中包含指定关键词的页面' },
  { value: 'inurl', label: '网址包含', placeholder: '关键词', description: '搜索网址中包含指定关键词的页面' },
  { value: 'filetype', label: '文件类型', placeholder: 'pdf', description: '搜索特定类型的文件' },
  { value: 'exact', label: '精确匹配', placeholder: '完整短语', description: '搜索完全匹配的短语' }
];

const SearchPage = ({ language, searchEngines, defaultEngine }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [convertedQuery, setConvertedQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [syntaxFilters, setSyntaxFilters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // 加载搜索历史
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);
  
  // 处理搜索输入变化
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    updateConvertedQuery(value, syntaxFilters);
  };
  
  // 更新转换后的查询
  const updateConvertedQuery = (baseQuery, filters) => {
    let converted = baseQuery || '';
    
    filters.forEach(filter => {
      switch (filter.type) {
        case 'site':
          converted += ` site:${filter.value}`;
          break;
        case 'intitle':
          converted += ` intitle:${filter.value}`;
          break;
        case 'inurl':
          converted += ` inurl:${filter.value}`;
          break;
        case 'filetype':
          converted += ` filetype:${filter.value}`;
          break;
        case 'exact':
          converted += ` "${filter.value}"`;
          break;
        default:
          break;
      }
    });
    
    setConvertedQuery(converted);
  };
  
  // 保存搜索历史
  const saveSearchHistory = (query, engineId) => {
    const newRecord = {
      id: Date.now(),
      query,
      engineId,
      timestamp: new Date().toISOString(),
      filters: syntaxFilters
    };
    
    const updatedHistory = [newRecord, ...searchHistory.slice(0, 99)]; // 限制100条记录
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };
  
  // 执行搜索
  const performSearch = (engineId) => {
    if (!searchQuery.trim() && syntaxFilters.length === 0) {
      message.warning(language === 'zh' ? '请输入搜索内容或添加筛选条件' : 'Please enter search content or add filters');
      return;
    }
    
    const engine = searchEngines.find(e => e.id === engineId);
    if (!engine) {
      message.error(language === 'zh' ? '搜索引擎未找到' : 'Search engine not found');
      return;
    }
    
    const converted = convertedQuery || searchQuery;
    saveSearchHistory(converted, engineId);
    
    // 跳转到搜索引擎
    const searchUrl = `${engine.url}${encodeURIComponent(converted)}`;
    window.open(searchUrl, '_blank');
  };
  
  // 显示语法添加模态框
  const showAddSyntaxModal = () => {
    if (syntaxFilters.length >= 50) {
      message.warning(language === 'zh' ? '最多只能添加50个搜索语法' : 'You can add up to 50 search syntaxes');
      return;
    }
    setIsModalVisible(true);
  };
  
  // 处理语法添加
  const handleAddSyntax = (values) => {
    const newFilter = {
      id: Date.now(),
      type: values.type,
      value: values.value
    };
    
    const updatedFilters = [...syntaxFilters, newFilter];
    setSyntaxFilters(updatedFilters);
    updateConvertedQuery(searchQuery, updatedFilters);
    setIsModalVisible(false);
    form.resetFields();
  };
  
  // 删除语法
  const removeSyntax = (id) => {
    const updatedFilters = syntaxFilters.filter(filter => filter.id !== id);
    setSyntaxFilters(updatedFilters);
    updateConvertedQuery(searchQuery, updatedFilters);
  };
  
  // 获取语法类型标签
  const getSyntaxTypeLabel = (type) => {
    const syntax = SYNTAX_TYPES.find(s => s.value === type);
    return syntax ? (language === 'zh' ? syntax.label : syntax.value) : type;
  };
  
  // 获取默认搜索引擎
  const defaultEngineObj = searchEngines.find(e => e.id === defaultEngine) || searchEngines[0];
  
  // 获取启用的搜索引擎
  const enabledEngines = searchEngines.filter(e => e.enabled);
  
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center mb-8 mt-4 md:mt-8 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            {language === 'zh' ? '聚合搜索引擎' : 'Aggregate Search Engine'}
          </span>
        </h1>
        <p className="text-gray-300 mb-6 animate-fade-in-up delay-100">
          {language === 'zh' 
            ? '支持多种搜索引擎，智能转换搜索语法' 
            : 'Support multiple search engines with intelligent syntax conversion'}
        </p>
        
        <div className="max-w-2xl mx-auto px-4">
          <Search
            size="large"
            placeholder={language === 'zh' 
              ? '请输入搜索内容' 
              : 'Enter search content'}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={() => performSearch(defaultEngine)}
            enterButton={
              <Button 
                type="primary" 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 border-none hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
              >
                <SearchOutlined />
              </Button>
            }
            className="mb-4 search-input-animate"
          />
          
          <div className="mb-4 animate-fade-in-up delay-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-200">
                {language === 'zh' ? '搜索筛选器' : 'Search Filters'}
              </h3>
              <Tooltip title={language === 'zh' ? '添加筛选条件' : 'Add filter'}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={showAddSyntaxModal}
                  size="small"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                >
                  <span className="hidden md:inline">{language === 'zh' ? '添加筛选' : 'Add Filter'}</span>
                </Button>
              </Tooltip>
            </div>
            
            {syntaxFilters.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {syntaxFilters.map(filter => (
                  <Tag 
                    key={filter.id} 
                    color="blue" 
                    closable
                    onClose={() => removeSyntax(filter.id)}
                    className="flex items-center bg-blue-900/30 border-blue-700 text-blue-100 hover:bg-blue-800/50 transition-all duration-300"
                  >
                    <span className="font-medium mr-1">{getSyntaxTypeLabel(filter.type)}:</span>
                    {filter.value}
                  </Tag>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm py-2 animate-pulse">
                {language === 'zh' ? '暂无筛选器，点击上方按钮添加' : 'No filters, click the button above to add'}
              </div>
            )}
          </div>
          
          {convertedQuery && (
            <div className="text-left mb-6 bg-blue-900/20 p-3 rounded-lg border border-blue-700/30 animate-fade-in-up delay-300">
              <div className="flex items-center text-sm text-blue-300 mb-1">
                <InfoCircleOutlined className="mr-2" />
                {language === 'zh' ? '生成的搜索语法' : 'Generated Search Syntax'}:
              </div>
              <div className="font-mono text-sm bg-gray-800/50 p-2 rounded border border-gray-700 text-cyan-300">
                {convertedQuery}
              </div>
            </div>
          )}
          
          <div className="mb-8 animate-fade-in-up delay-400">
            <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center justify-center">
              <RocketOutlined className="mr-2 text-blue-400" />
              {language === 'zh' ? '快捷搜索' : 'Quick Search'}
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {enabledEngines.slice(0, 5).map(engine => (
                <Button
                  key={engine.id}
                  type="primary"
                  onClick={() => performSearch(engine.id)}
                  icon={<EngineIcon engineName={engine.name} />}
                  size="large"
                  className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:from-gray-700 hover:to-gray-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <span className="text-gray-100">{engine.name}</span>
                </Button>
              ))}
              
              {enabledEngines.length > 5 && (
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: enabledEngines.slice(5).map(engine => ({
                      key: engine.id,
                      label: (
                        <Button
                          type="default"
                          onClick={() => performSearch(engine.id)}
                          icon={<EngineIcon engineName={engine.name} />}
                          block
                          className="flex items-center justify-start bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-blue-500 transition-all duration-300"
                        >
                          {engine.name}
                        </Button>
                      )
                    }))
                  }}
                >
                  <Button 
                    size="large"
                    className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:from-gray-700 hover:to-gray-800 hover:border-blue-500 transition-all duration-300"
                  >
                    {language === 'zh' ? '更多引擎' : 'More Engines'}
                  </Button>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加语法模态框 */}
      <Modal
        title={
          <div className="text-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-t-lg">
            <div className="flex items-center">
              <PlusOutlined className="mr-2" />
              <span className="font-semibold">{language === 'zh' ? '添加搜索语法' : 'Add Search Syntax'}</span>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
        className="syntax-modal-wrapper rounded-lg overflow-hidden"
        styles={{
          mask: { backgroundColor: 'rgba(15, 23, 42, 0.8)' },
          body: { 
            padding: '20px', 
            background: '#0f172a',
            color: '#e2e8f0',
            fontFamily: 'inherit'
          },
          header: { 
            background: 'linear-gradient(to right, #2563eb, #06b6d4)',
            marginBottom: '0',
            padding: '16px 20px',
            color: 'white'
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSyntax}
          className="syntax-form"
        >
          <Form.Item
            name="type"
            label={<span className="text-gray-300 font-medium">{language === 'zh' ? '语法类型' : 'Syntax Type'}</span>}
            rules={[{ required: true, message: language === 'zh' ? '请选择语法类型' : 'Please select syntax type' }]}
          >
            <Select 
              placeholder={language === 'zh' ? '请选择语法类型' : 'Select syntax type'}
              className="syntax-select bg-gray-800 border-gray-700 text-gray-100"
              popupClassName="syntax-select-dropdown"
              size="middle"
            >
              {SYNTAX_TYPES.map(syntax => (
                <Option key={syntax.value} value={syntax.value} className="syntax-option">
                  <div className="syntax-option-content py-1">
                    <div className="syntax-option-title">{syntax.label}</div>
                    <div className="syntax-option-desc">{syntax.description}</div>
                    <div className="syntax-option-example">示例: {syntax.value}:{syntax.placeholder}</div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="value"
            label={<span className="text-gray-300 font-medium">{language === 'zh' ? '值' : 'Value'}</span>}
            rules={[{ required: true, message: language === 'zh' ? '请输入值' : 'Please enter value' }]}
          >
            <Input 
              placeholder={language === 'zh' ? `请输入${SYNTAX_TYPES.find(s => s.value === form.getFieldValue()?.type)?.placeholder || '值'}` : 'Enter value'} 
              className="syntax-input bg-gray-800 border-gray-700 text-gray-100"
              size="middle"
            />
          </Form.Item>
          
          <Form.Item className="mb-0 mt-1">
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
                className="syntax-cancel-btn bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                size="middle"
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="syntax-add-btn bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:from-blue-700 hover:to-cyan-700"
                size="middle"
                icon={<PlusOutlined />}
              >
                {language === 'zh' ? '添加语法' : 'Add Syntax'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SearchPage;