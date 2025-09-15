# 📋 CV Tracker - Job Application Management System

A modern, responsive web application for tracking job applications, managing CVs, and monitoring your job search progress. Built with Next.js, Firebase, and Tailwind CSS.

![CV Tracker Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8)

## 🚀 Features

### ✅ Current Features

- **📊 Dashboard Overview**: Real-time statistics and progress tracking
- **📝 Application Management**: Add, edit, and delete job applications
- **📁 File Management**: Upload and manage CVs and cover letters
- **🔍 Search & Filter**: Find applications by company, role, or status
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile
- **🌙 Dark Mode**: Toggle between light and dark themes
- **🔐 Authentication**: Secure Google OAuth integration
- **☁️ Cloud Storage**: Firebase Firestore and Storage integration
- **📈 Analytics**: Track application success rates and trends
- **🎨 Modern UI**: Clean, professional interface with smooth animations

### 🔮 Upcoming Features (AI Integration)

- **🤖 AI-Powered CV Tailoring**: Automatically customize CVs for specific job descriptions
- **✍️ Smart Cover Letter Generation**: AI-generated cover letters based on job requirements
- **📊 Application Insights**: AI analysis of application patterns and success factors
- **💡 Job Match Scoring**: AI-powered job compatibility analysis
- **📝 Interview Preparation**: AI-generated interview questions and tips
- **🎯 Keyword Optimization**: AI suggestions for resume keyword optimization

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animate

### Backend & Database
- **Authentication**: Firebase Auth (Google OAuth)
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **Hosting**: Vercel

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier (via Kiro IDE)
- **Version Control**: Git
- **CI/CD**: GitHub Actions + Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Google OAuth credentials

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cv-tracker.git
cd cv-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Setup

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own job applications
    match /jobApplications/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/applications/{applicationId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**:
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set Environment Variables** in Vercel dashboard

3. **Automatic Deployment**: Push to main branch triggers auto-deployment via GitHub Actions

### Manual Deployment
```bash
npm run build
npm start
```

## 📱 Usage

### Getting Started
1. **Sign In**: Use Google OAuth to authenticate
2. **Add Application**: Click "Add New Application" to track your first job application
3. **Upload Documents**: Attach your CV and cover letter
4. **Track Progress**: Update application status as you progress
5. **Monitor Analytics**: View your application statistics and success rate

### Application Statuses
- **Applied**: Initial application submitted
- **Under Review**: Application being reviewed by employer
- **Interview Scheduled**: Interview arranged
- **Interviewed**: Interview completed
- **Offer Received**: Job offer received
- **Rejected**: Application unsuccessful
- **Withdrawn**: Application withdrawn by candidate

### File Management
- **Supported Formats**: PDF, DOC, DOCX
- **File Size Limit**: 10MB per file
- **Storage**: Secure Firebase Storage with user-specific access

## 🎨 UI/UX Features

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - `xs`: 475px (Extra small phones)
  - `sm`: 640px (Small tablets)
  - `md`: 768px (Medium tablets)
  - `lg`: 1024px (Laptops)
  - `xl`: 1280px (Desktops)

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG 2.1 AA compliant
- **Focus Management**: Clear focus indicators

### Animations
- **Smooth Transitions**: 300ms ease-out transitions
- **Micro-interactions**: Hover effects and loading states
- **Page Transitions**: Fade-in animations for better UX

## 🔧 Development

### Project Structure
```
cv-tracker/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Dashboard page
│   ├── applications/      # Application pages
│   └── analytics/         # Analytics page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── auth/             # Authentication components
│   └── applications/     # Application-specific components
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── firestore.ts      # Database operations
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Code formatting via Kiro IDE
- **Naming**: camelCase for variables, PascalCase for components

## 🔮 Future Roadmap

### Phase 1: AI Integration (Q2 2024)
- [ ] **AI CV Tailoring**: OpenAI GPT integration for CV customization
- [ ] **Cover Letter Generation**: Automated cover letter creation
- [ ] **Job Description Analysis**: AI-powered job requirement extraction

### Phase 2: Advanced Analytics (Q3 2024)
- [ ] **Success Prediction**: ML models for application success probability
- [ ] **Market Insights**: Industry trends and salary analysis
- [ ] **Performance Metrics**: Advanced tracking and reporting

### Phase 3: Collaboration Features (Q4 2024)
- [ ] **Team Sharing**: Share applications with career counselors
- [ ] **Feedback System**: Collaborative review and feedback
- [ ] **Template Library**: Shared CV and cover letter templates

### Phase 4: Mobile App (2025)
- [ ] **React Native App**: Native mobile application
- [ ] **Offline Support**: Offline-first architecture
- [ ] **Push Notifications**: Application status updates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code of Conduct
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)

### Getting Help
- 📧 Email: support@cvtracker.com
- 💬 Discord: [Join our community](https://discord.gg/cvtracker)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/cv-tracker/issues)

### FAQ
**Q: Can I use this for free?**
A: Yes! CV Tracker is open source and free to use.

**Q: How secure is my data?**
A: We use Firebase security rules and encryption to protect your data.

**Q: Can I export my data?**
A: Yes, data export functionality is available in Settings.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Lucide](https://lucide.dev/) - Icon library
- [Vercel](https://vercel.com/) - Hosting platform

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/cv-tracker)
![GitHub forks](https://img.shields.io/github/forks/yourusername/cv-tracker)
![GitHub issues](https://img.shields.io/github/issues/yourusername/cv-tracker)
![GitHub license](https://img.shields.io/github/license/yourusername/cv-tracker)

---

**Built with ❤️ by the CV Tracker Team**

*Empowering job seekers with modern tools for career success.*