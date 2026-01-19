# U-TaskFlow 构建指南

## 快速开始

1. 进入项目目录:
```bash
cd U-TaskFlow
```

2. 安装依赖:
```bash
npm install
```

3. 开发模式:
```bash
npm run dev
```

4. 生产构建:
```bash
npm run build
```

5. 预览构建结果:
```bash
npm run preview
```

## 项目文件清单

### 核心配置文件
- package.json - 项目依赖和脚本
- vite.config.js - Vite 构建配置
- tailwind.config.js - Tailwind CSS 配置
- postcss.config.js - PostCSS 配置
- esa.jsonc - ESA Pages 部署配置

### 源代码文件
- src/index.jsx - 应用入口
- src/index.css - 全局样式
- src/App.jsx - 主应用组件（路由配置）

### 页面组件
- src/pages/Home.jsx - 首页
- src/pages/Dashboard.jsx - 仪表板（任务板列表）
- src/pages/TaskBoard.jsx - 任务板看板视图
- src/pages/WorkflowDesigner.jsx - 工作流设计器
- src/pages/Analytics.jsx - 数据分析

### 通用组件
- src/components/Navbar.jsx - 导航栏

### 文档文件
- README.md - 项目文档
- 提交.txt - 提交信息

## 技术栈确认

✅ React 18.2.0 - 核心框架
✅ React Router 6.22.0 - 路由方案
✅ Tailwind CSS 3.4.14 - UI样式
✅ React Hooks - 状态管理
✅ LocalStorage - 数据持久化
✅ Vite 5.1.0 - 构建工具
✅ Lucide React 0.344.0 - 图标库

## 功能确认

✅ 任务板创建和管理
✅ 看板视图和任务流转
✅ 工作流可视化设计
✅ 数据分析和统计
✅ 本地数据持久化
✅ 响应式设计

## 部署检查清单

- [ ] 所有依赖已正确安装
- [ ] 生产构建成功 (npm run build)
- [ ] dist 目录生成完整
- [ ] 环境变量配置正确（如需要）
- [ ] aliyun.png 文件已放置
- [ ] 提交.txt 内容已填写

## 注意事项

1. 确保从项目根目录复制 aliyun.png 到 U-TaskFlow 目录
2. 确保 Node.js 版本 >= 18.0.0
3. 构建 output 目录为 dist
4. 数据存储使用 LocalStorage，按浏览器隔离

## 问题排查

如果遇到构建问题：

1. 清除缓存：
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. 检查 Node.js 版本：
```bash
node -v
```

3. 查看详细错误信息：
```bash
npm run build -- --debug
```
