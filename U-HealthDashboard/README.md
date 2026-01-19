# U-HealthDashboard - 迷你健康仪表盘

U-HealthDashboard 是一款迷你健康管理应用，帮助用户记录健康指标、管理用药提醒、追踪症状变化，并生成可打印的健康报告。

## 声明

本项目由阿里云ESA提供加速、计算和保护
![阿里云ESA](aliyun.png)

## 功能特性

- **健康档案** - 存储血型、过敏信息、慢性疾病和紧急联系人等关键健康信息
- **数据可视化** - 使用动态图表展示血压、心率、体重、睡眠等健康指标趋势
- **用药管理** - 带提醒功能的日历系统，记录药物服用时间和剂量
- **症状追踪** - 支持图文记录的症状日志，按严重程度分类
- **数据导出** - 一键生成可打印的PDF健康报告
- **数据持久化** - 使用LocalStorage自动保存所有数据

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **UI样式**: Tailwind CSS 3.4
- **图表库**: Recharts
- **图标库**: Lucide React
- **日期处理**: date-fns
- **PDF生成**: jsPDF
- **状态管理**: React Hooks
- **数据存储**: LocalStorage

## 快速开始

### 安装依赖

```bash
cd U-HealthDashboard
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

### 1. 创建或加载健康档案

- 点击"加载示例数据"可查看示例健康档案
- 点击"创建新档案"开始记录自己的健康信息

### 2. 健康档案

- 查看血型、年龄、身高、体重等基本信息
- 记录过敏源和慢性疾病
- 设置紧急联系人信息

### 3. 健康趋势

- 查看血压、心率、体重、睡眠的历史趋势图
- 了解最近7天的健康指标变化
- 识别健康状况的改善或恶化

### 4. 用药管理

- 添加需要服用的药物
- 设置剂量、频率和服用时间
- 启用或关闭用药提醒
- 标记药物已服用

### 5. 症状追踪

- 记录出现的症状及日期
- 选择症状严重程度（轻微、中等、严重）
- 添加备注信息
- 查看历史症状记录

### 6. 健康报告

- 一键生成包含所有健康信息的PDF报告
- 包含用户信息、过敏信息、健康指标、用药清单和症状记录
- 适合打印或分享给医生

## 数据存储

所有数据均保存在浏览器LocalStorage中，刷新页面不会丢失数据。如需清除数据，可：
1. 点击"创建新档案"
2. 或在浏览器开发者工具中清除LocalStorage

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 部署说明

### 部署到阿里云ESA

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录内容上传到阿里云ESA
3. 配置域名访问

### 其他部署方式

- Vercel
- Netlify
- GitHub Pages
- 任何支持静态网站托管的服务

## 项目结构

```
U-HealthDashboard/
├── src/
│   ├── components/        # React组件
│   │   ├── HealthCard.jsx    # 健康档案卡片
│   │   ├── VitalsChart.jsx   # 健康指标图表
│   │   ├── MedicationReminder.jsx  # 用药提醒
│   │   ├── SymptomTracker.jsx      # 症状追踪
│   │   └── HealthReport.jsx       # 健康报告
│   ├── data/             # 示例数据
│   │   └── sampleData.js
│   ├── utils/            # 工具函数
│   │   └── storage.js    # LocalStorage封装
│   ├── App.jsx           # 主应用组件
│   ├── main.jsx          # 应用入口
│   └── index.css         # 样式文件
├── public/               # 静态资源
├── package.json          # 依赖配置
├── vite.config.js        # Vite配置
└── tailwind.config.js    # Tailwind配置
```

## 许可证

本项目由阿里云ESA提供加速、计算和保护
