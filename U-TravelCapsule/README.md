# U-TravelCapsule - 智能旅行胶囊

U-TravelCapsule 是一款智能旅行管理应用，帮助用户轻松规划旅行行程、管理打包清单、计算旅行费用，并提供紧急联系方式和PDF导出功能。

## 声明

本项目由阿里云ESA提供加速、计算和保护
![阿里云ESA](aliyun.png)

## 功能特性

- **交互式时间轴** - 使用图形化方式展示每日行程安排，清晰直观
- **智能打包清单** - 支持勾选式操作，可分类管理物品，实时显示打包进度
- **紧急信息集成** - 预置当地医院、大使馆等关键联系信息
- **费用计算器** - 实时计算旅行费用，支持多人分摊和可视化展示
- **离线功能** - 生成包含完整行程信息的PDF手册，方便离线查看
- **数据持久化** - 使用LocalStorage自动保存所有数据

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **UI样式**: Tailwind CSS 3.4
- **图标库**: Lucide React
- **日期处理**: date-fns
- **PDF生成**: jsPDF
- **状态管理**: React Hooks
- **数据存储**: LocalStorage

## 快速开始

### 安装依赖

```bash
cd U-TravelCapsule
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

### 1. 创建或加载行程

- 点击"加载示例数据"可查看示例旅行计划
- 点击"创建新行程"开始规划自己的旅行

### 2. 行程安排

- 使用时间轴视图查看每日行程
- 不同类型活动用不同颜色和图标标识
- 点击天数切换查看不同日期的安排

### 3. 打包清单

- 按类别查看和管理物品
- 点击复选框标记物品已打包
- 调整物品数量、添加新物品或删除物品
- 实时查看打包进度百分比

### 4. 费用计算

- 添加各项旅行支出
- 选择支出类别和分摊人员
- 自动计算总支出、人均消费
- 查看分类统计和人均分摊详情

### 5. 紧急信息

- 一键拨打当地报警电话（110）或救护车（119）
- 查看当地医院地址和电话
- 获取大使馆联系方式和紧急联络电话

### 6. 导出PDF

- 生成包含完整旅行信息的PDF手册
- 包含行程安排、打包清单、紧急联系方式
- 适合离线查看和打印携带

## 数据存储

所有数据均保存在浏览器LocalStorage中，刷新页面不会丢失数据。如需清除数据，可：
1. 点击"创建新行程"
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
U-TravelCapsule/
├── src/
│   ├── components/        # React组件
│   │   ├── Header.jsx    # 页面头部
│   │   ├── Timeline.jsx  # 时间轴组件
│   │   ├── PackingList.jsx    # 打包清单
│   │   ├── ExpenseCalculator.jsx  # 费用计算器
│   │   ├── EmergencyInfo.jsx  # 紧急信息
│   │   └── PDFExport.jsx  # PDF导出
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
