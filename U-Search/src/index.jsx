import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import App from './App';
import './index.css';

// 根据浏览器语言设置初始语言
const getLocale = () => {
  const lang = navigator.language || navigator.languages[0];
  if (lang.startsWith('zh')) {
    return zhCN;
  }
  return enUS;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={getLocale()}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);