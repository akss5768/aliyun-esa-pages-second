# U-CompetitionHub 竞赛信息展示平台

U-CompetitionHub 是一个现代化的竞赛信息展示平台，帮助用户快速查找和了解各类竞赛信息，包括编程、学术、设计、商业等多个领域的竞赛。

## 声明

本项目由阿里云ESA提供加速、计算和保护
![阿里云ESA](aliyun.png)

## 功能特性

- **多类型竞赛展示** - 支持编程竞赛、学术竞赛、设计竞赛、商业竞赛、体育竞赛等多种类型
- **智能筛选功能** - 按类别、状态、级别筛选竞赛，支持关键词搜索
- **分页功能** - 支持分页浏览竞赛列表，可自定义每页显示数量
- **详细竞赛信息** - 提供竞赛简介、主办单位、报名时间、参赛要求等详细信息
- **收藏功能** - 支持收藏感兴趣的竞赛
- **数据持久化** - 使用浏览器 localStorage 进行数据存储
- **响应式设计** - 完美适配桌面、平板和手机设备
- **统计仪表盘** - 实时显示竞赛数量统计信息

## 技术栈

- **前端框架**: React 18
- **路由**: React Router
- **UI样式**: Tailwind CSS
- **状态管理**: React Hooks
- **数据存储**: LocalStorage
- **构建工具**: Vite
- **图标库**: Lucide React

## 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

## 安装和启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd U-CompetitionHub
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录中。

### 5. 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 可复用的UI组件
│   ├── CompetitionCard.jsx      # 竞赛卡片组件
│   ├── CompetitionDetail.jsx    # 竞赛详情组件
│   ├── FilterBar.jsx            # 筛选栏组件
│   └── StatsCard.jsx            # 统计卡片组件
├── data/               # 数据文件
│   └── competitionData.js       # 竞赛数据
├── utils/              # 工具函数
│   └── storage.js              # localStorage封装
├── App.jsx             # 主应用组件
├── index.css           # 全局样式
└── main.jsx            # 应用入口文件
```

## 部署

### 部署到阿里云ESA

项目已配置为可在阿里云ESA平台部署，配置文件 `esa.jsonc` 定义了部署参数：

- **构建命令**: `npm install`
- **构建输出目录**: `./dist`
- **404处理策略**: 单页应用模式

要部署到阿里云ESA，只需将项目推送到配置的仓库，ESA将自动构建和部署。

### 部署到其他平台

1. 构建生产版本:

```bash
npm run build
```

2. 将 `dist/` 目录中的文件部署到您的静态托管服务

## 数据存储

本项目使用浏览器 localStorage 作为数据存储方案：

- **竞赛数据**: `competitionHub_competitions`
- **收藏记录**: `competitionBookmarks`

## 竞赛状态说明

- **进行中**: 竞赛正在报名进行中
- **即将开始**: 竞赛尚未开始报名
- **已结束**: 竞赛已经结束

## 功能说明

### 竞赛列表

- 以卡片形式展示所有竞赛
- 支持分页浏览，可自定义每页显示数量（6/9/12/18）
- 显示竞赛状态、级别、标题、描述、标签等关键信息
- 点击卡片可查看详细信息
- 翻页时自动滚动到页面顶部

### 筛选功能

- **关键词搜索**: 搜索竞赛名称、描述、标签
- **类别筛选**: 按竞赛类别筛选
- **状态筛选**: 按竞赛状态（报名中、即将开始等）筛选
- **级别筛选**: 按竞赛级别（国际级、国家级等）筛选

### 竞赛详情

- 显示完整的竞赛信息
- 支持分享和收藏功能
- 提供官方链接访问

### 我的收藏

- 查看所有收藏的竞赛
- 快速访问感兴趣的竞赛

## 开发

### 添加新的竞赛类型

在 `src/data/competitionData.js` 中修改 `competitionCategories` 数组：

```javascript
export const competitionCategories = [
  // 添加新的竞赛类别
  { id: 7, name: '新类别', icon: 'IconName', description: '描述' }
];
```

### 添加新的竞赛数据

在 `src/data/competitionData.js` 中向 `sampleCompetitions` 数组添加新的竞赛对象。

### 自定义样式

样式使用 Tailwind CSS 定义，可以在 `src/index.css` 中添加自定义样式，在 `tailwind.config.js` 中扩展配置。

## 故障排除

### 依赖安装问题

如果安装依赖时遇到问题，尝试清理缓存:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 构建错误

如果构建时出现错误，检查控制台输出以定位问题，通常需要检查 JavaScript 语法错误或导入/导出问题。

## 许可证

该项目遵循以下协议 [MIT license](https://opensource.org/licenses/MIT).
