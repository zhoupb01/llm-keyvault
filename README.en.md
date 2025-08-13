# LLM KeyVault

A modern web application for securely managing and storing LLM API keys. Supports multiple LLM platforms with an intuitive interface for managing your API keys.

## ✨ Key Features

- 🔐 **Secure Management** - Safely store and manage your LLM API keys
- 🎨 **Beautiful Interface** - Modern user interface with theme switching support
- 🌐 **Multilingual Support** - Available in Chinese and English
- 🏷️ **Tag System** - Add tags to keys for better organization
- 🔍 **Search Functionality** - Quickly search and filter keys
- 📊 **Quick Statistics** - View key count and status overview
- 📤 **Import/Export** - Support for key backup and restoration
- 🎯 **Status Management** - Easily toggle key availability status
- 🎨 **Color Coding** - Set colors for different keys for easy identification
- 📱 **Responsive Design** - Perfectly adapted for desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) - React full-stack framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Database**: [Dexie](https://dexie.org/) - Browser-side IndexedDB wrapper
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - High-performance form handling
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Unstyled accessible components
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Modern toast notifications

## 📁 Project Structure

```
llm-keyvault/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── ui/                # Basic UI components
│   └── *.tsx              # Feature components
├── contexts/              # React Contexts
├── dictionaries/          # Multilingual dictionaries
├── lib/                   # Utility functions and configs
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🔧 Core Features

### Key Management
- Add, edit, and delete API keys
- Support for multiple LLM platforms (OpenAI, Anthropic, local models, etc.)
- Key status management (available/unavailable)
- One-click copy key or domain

### Organization & Classification
- Set nicknames and notes for keys
- Use tag system for categorization
- Color coding for visual identification
- Powerful search and filtering capabilities

### Data Security
- Local storage, data never leaves your device
- Import/export functionality for backup
- Key content can be hidden/shown
- Secure status toggle mechanism

## 🌍 Internationalization

The application supports both Chinese and English languages. You can switch languages using the language toggle in the top-right corner of the interface.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React full-stack framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI component library
- [Lucide](https://lucide.dev/) - Icon library