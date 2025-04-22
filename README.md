# OatMeal - AI-Powered Resume Builder

![OatMeal Banner](public/banner.png)

OatMeal is a modern, AI-powered resume builder that helps you create professional resumes with ease. It features real-time previews, customizable themes, and AI-powered project description generation from GitHub repositories.

## 🚀 Features

- **AI-Powered Project Descriptions**: Automatically generate project descriptions and technologies from GitHub repositories
- **Real-time Preview**: See your resume changes instantly as you edit
- **Customizable Themes**: Choose from 17 professional colors
- **Font Selection**: Select from 4 professional fonts (Helvetica, Arial, Calibri, Times New Roman)
- **Modern UI**: Clean, intuitive interface with responsive design
- **PDF Export**: Download your resume as a PDF
- **Auto-save**: Your changes are automatically saved
- **Form Validation**: Ensures all required fields are properly filled

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
  - React Hook Form
  - Zod
  - Lucide React

- **Backend:**
  - MongoDB
  - Next.js API Routes
  - Google Gemini API

- **Development Tools:**
  - ESLint
  - TypeScript
  - npm

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- MongoDB
- Google Gemini API key

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/udai7/OatMeal.git
   cd OatMeal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000`

## 🎨 Project Structure

```
OatMeal/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI components
│   ├── lib/                # Utility functions and configurations
│   │   ├── actions/        # Server actions
│   │   ├── context/        # React context
│   │   └── models/         # Database models
│   └── styles/             # Global styles
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Google Gemini API](https://ai.google.dev/)

## 📞 Contact

Udai Das - [@udai7](https://github.com/udai7) - Udaid347@gmail.com

Project Link: [https://github.com/udai7/OatMeal](https://github.com/udai7/OatMeal)

**Website**: [portfolio-website-udai.vercel.app](https://portfolio-website-udai.vercel.app/)
