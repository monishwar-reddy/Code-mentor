# 🚀 Code Mentor

An AI-powered code review platform that provides instant, intelligent feedback on your code using AWS Bedrock.

![Code Mentor](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![AWS](https://img.shields.io/badge/AWS-Bedrock-orange?style=for-the-badge&logo=amazon-aws)

## ✨ Features

- **Instant Code Review** - Get AI-powered feedback in seconds
- **Multi-Language Support** - Python, JavaScript, Java, C, C++
- **Debug Assistance** - Paste error messages for targeted debugging help
- **Code Explanation** - Understand complex code with AI explanations
- **Test Generation** - Automatically generate unit tests for your code
- **GitHub Integration** - Review code directly from GitHub file URLs
- **Beginner & Intermediate Modes** - Tailored feedback for your skill level

## 🎯 Use Cases

- Code review and quality improvement
- Bug detection and debugging
- Learning best practices
- Understanding unfamiliar code
- Generating test cases
- Security vulnerability detection

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Styling**: Inline CSS with modern design patterns
- **AI Backend**: AWS Bedrock API
- **Deployment**: Vercel-ready

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/monishwar-reddy/Code-mentor.git
cd Code-mentor
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=your-aws-bedrock-api-url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Usage

### Review Code
1. Navigate to the Code Mentor page
2. Select your programming language
3. Choose your skill level (Beginner/Intermediate)
4. Paste your code
5. Click "Review Code"

### Debug Errors
1. Paste your code
2. Add the error message in the error field
3. Click "Debug Error"

### Explain Code
1. Paste the code you want to understand
2. Click "Explain Code"

### Generate Tests
1. Paste your function/class code
2. Click "Generate Tests"

### Review GitHub Files
1. Paste a GitHub file URL
2. Click "Review GitHub File"

## 📁 Project Structure

```
Code-mentor/
├── app/
│   ├── page.js           # Landing page
│   ├── layout.js         # Root layout
│   └── mentor/
│       └── page.js       # Main code review interface
├── .env.local            # Environment variables (not in git)
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies
└── README.md           # This file
```

## 🎨 Features Breakdown

### Landing Page
- Modern gradient hero section
- Feature showcase with icons
- "How It Works" section with visual steps
- Responsive design

### Code Review Interface
- Clean, professional UI
- Real-time feedback display
- Multiple action buttons
- Language and mode selection
- Error handling with helpful messages

## 🔒 Security

- API keys stored in environment variables
- `.env.local` excluded from version control
- CORS-enabled API requests
- Input validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Monishwar Reddy**

- GitHub: [@monishwar-reddy](https://github.com/monishwar-reddy)

## 🙏 Acknowledgments

- AWS Bedrock for AI capabilities
- Next.js team for the amazing framework
- Unsplash for images

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ by Monishwar Reddy
