# LLM 密钥保管库

一个安全管理和存储 LLM API 密钥的现代化 Web 应用程序。支持多种 LLM 平台，提供直观的界面来管理您的 API 密钥。

## ✨ 主要特性

- 🔐 **安全管理** - 安全地存储和管理您的 LLM API 密钥
- 🎨 **美观界面** - 现代化的用户界面，支持主题切换
- 🌐 **多语言支持** - 支持中文和英文界面
- 🏷️ **标签系统** - 为密钥添加标签以便分类管理
- 🔍 **搜索功能** - 快速搜索和筛选密钥
- 📊 **快速统计** - 查看密钥总数和状态概览
- 📤 **导入导出** - 支持密钥的备份和恢复
- 🎯 **状态管理** - 轻松切换密钥的可用状态
- 🎨 **颜色标识** - 为不同密钥设置颜色以便识别
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn、pnpm 或 bun

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可在浏览器中查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 🛠️ 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) - React 全栈框架
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **数据库**: [Dexie](https://dexie.org/) - 浏览器端 IndexedDB 封装
- **表单**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - 高性能表单处理
- **UI 组件**: [Radix UI](https://www.radix-ui.com/) - 无样式的可访问组件
- **图标**: [Lucide React](https://lucide.dev/) - 美观的图标库
- **通知**: [Sonner](https://sonner.emilkowal.ski/) - 现代化的 Toast 通知

## 📁 项目结构

```
llm-keyvault/
├── app/                    # Next.js App Router
├── components/             # React 组件
│   ├── ui/                # 基础 UI 组件
│   └── *.tsx              # 功能组件
├── contexts/              # React Context
├── dictionaries/          # 多语言字典
├── lib/                   # 工具函数和配置
├── types/                 # TypeScript 类型定义
└── public/                # 静态资源
```

## 🔧 主要功能

### 密钥管理
- 添加、编辑、删除 API 密钥
- 支持多种 LLM 平台（OpenAI、Anthropic、本地模型等）
- 密钥状态管理（可用/不可用）
- 一键复制密钥或域名

### 组织和分类
- 为密钥设置昵称和备注
- 使用标签系统分类管理
- 颜色标识便于视觉识别
- 强大的搜索和筛选功能

### 数据安全
- 🔒 **100% 本地存储** - 所有密钥数据仅存储在您的浏览器本地，**绝对不会发送到任何后端服务器**
- 🛡️ **隐私保护** - 数据完全保留在您的设备上，确保您的 API 密钥绝对安全
- 📤 **导入导出** - 支持导入导出功能进行本地备份
- 👁️ **内容隐藏** - 密钥内容可以隐藏/显示，防止泄露
- 🔐 **安全机制** - 安全的状态切换机制，防止误操作

## 🌍 国际化

应用支持中文和英文两种语言，可以通过界面右上角的语言切换器进行切换。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 此仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Radix UI](https://www.radix-ui.com/) - UI 组件库
- [Lucide](https://lucide.dev/) - 图标库
