# U-Search 聚合搜索引擎

U-Search 是一个聚合搜索引擎项目，支持多个搜索引擎的聚合搜索功能。

## 声明

本项目由阿里云ESA提供加速、计算和保护  
![阿里云ESA](aliyun.png)

## 编译和部署

### 环境要求

- Node.js >= 16.x
- npm

### 安装和构建

1. 安装依赖：

```bash
npm install
```

2. 构建项目：

```bash
npm run build
```

构建后的文件会出现在 `dist/` 目录中，可以直接部署到任何静态文件服务器上。

### 开发模式

运行以下命令启动开发服务器：

```bash
npm run dev
```

这将在 http://localhost:5173 (或自动分配的端口) 上启动开发服务器。

### 预览生产构建

```bash
npm run preview
```

这将在本地启动一个服务器来预览生产构建的项目。

### 自动部署

您也可以使用提供的部署脚本：

```bash
./deploy.sh
```

### 技术栈

- React 18
- Tailwind CSS 3.4.19 (低于4.0)
- Vite
- Ant Design

## 注意事项

- Tailwind CSS 版本已锁定在 3.x 系列，确保低于 4.0 版本
- 使用 localStorage 存储历史记录和设置
- 支持多个搜索引擎的聚合搜索
- 项目采用轻量化设计，适合快速部署和使用
