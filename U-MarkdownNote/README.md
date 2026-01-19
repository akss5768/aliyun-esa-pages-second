# U-MarkdownNote 浏览器Markdown笔记

U-MarkdownNote 是一个功能完善的浏览器端Markdown笔记应用，支持实时预览、语法高亮、笔记管理等功能。无需服务器，所有数据存储在本地，安全可靠。

## 功能特性

- **实时预览** - 编辑时即时预览Markdown渲染效果
- **分屏显示** - 支持同时显示编辑器和预览区
- **完整Markdown支持** - 支持标题、列表、代码块、表格、引用等
- **笔记管理** - 创建、编辑、删除笔记，按时间排序
- **搜索功能** - 支持标题和内容的全文搜索
- **导出功能** - 导出笔记为.md文件
- **本地存储** - 使用浏览器localStorage保存数据
- **响应式设计** - 完美适配桌面、平板和手机设备
- **精美UI设计** - 采用渐变色和阴影效果，界面简洁明亮

## 技术栈

- **前端框架**: React 18
- **路由**: React Router
- **UI样式**: Tailwind CSS
- **Markdown渲染**: React Markdown + Remark GFM
- **状态管理**: React Hooks
- **数据库**: LocalStorage
- **构建工具**: Vite
- **图标库**: Lucide React

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
U-MarkdownNote/
├── src/
│   ├── pages/
│   │   └── MarkdownNote.jsx              # 主笔记页面
│   ├── data/
│   │   └── testData.json                 # 测试数据
│   ├── App.jsx                          # 应用入口
│   ├── index.jsx                        # React入口
│   └── index.css                        # 全局样式
├── public/                              # 静态资源
├── package.json                         # 项目配置
├── vite.config.js                      # Vite配置
├── tailwind.config.js                  # Tailwind配置
└── README.md                           # 项目说明
```

## 使用说明

1. **创建笔记** - 点击"新建笔记"按钮创建新笔记
2. **编辑内容** - 在左侧编辑器输入Markdown内容
3. **实时预览** - 右侧实时显示渲染效果
4. **切换视图** - 使用工具栏按钮切换编辑器/预览显示
5. **保存笔记** - 编辑完成后点击"保存"按钮
6. **搜索笔记** - 使用顶部搜索框查找笔记
7. **导出笔记** - 点击"导出"按钮下载.md文件
8. **删除笔记** - 点击"删除"按钮移除笔记

## 支持的Markdown语法

- 标题 (# ## ###)
- 粗体/斜体 (**bold** *italic*)
- 列表 (- 1.)
- 代码块 (\`\`\`)
- 引用 (>)
- 表格
- 链接
- 图片

## 部署说明

本项目已适配阿里云 ESA Pages 平台，可以直接部署：

```bash
npm run build
```

构建完成后，将 `dist` 目录部署到 ESA Pages 即可。

## 许可证

MIT
