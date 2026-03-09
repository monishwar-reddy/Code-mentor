# Code Mentor - Design Specification

## System Architecture

### High-Level Architecture

```
[User Device] → [Next.js Frontend] → [AWS API Gateway] → [AWS Bedrock AI]
     ↓                                      ↓                    ↓
[Browser Cache]                    [API Endpoint]        [Foundation Models]
     ↓                                      ↓                    ↓
[Local Storage]                    [eu-north-1]          [Claude/Llama]
```

**Data Flow:**
1. User submits code via Next.js frontend
2. Request sent to AWS API Gateway endpoint
3. API Gateway routes to AWS Bedrock
4. Bedrock processes with AI foundation models
5. Formatted response returned to frontend
6. Response parsed and displayed to user

### Technology Stack

#### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18 with Inline CSS
- **State Management:** React Hooks (useState)
- **Code Editor:** HTML Textarea with monospace font
- **Icons:** SVG inline icons
- **Styling:** Modern inline CSS with gradients

#### Backend
- **API Gateway:** AWS API Gateway (REST API)
- **AI Service:** AWS Bedrock (Managed AI Service)
- **AI Models:** Foundation models (Claude by Anthropic, Llama by Meta, etc.)
- **Region:** AWS eu-north-1 (Stockholm, Sweden)
- **Authentication:** API endpoint with secure access
- **Protocol:** HTTPS REST API

#### Infrastructure
- **Hosting:** AWS Amplify
- **CDN:** AWS Amplify
- **Domain:** Custom domain or Vercel subdomain
- **SSL:** Automatic HTTPS via Vercel
- **Environment:** .env.local for secrets

---

## Detailed Component Design

### 1. AI Code Review Engine

#### Architecture

```
Code Input → Language Selection → Mode Selection → AWS API Gateway → AWS Bedrock AI → Formatted Response → User Display
                                                           ↓
                                                   Foundation Models
                                                   (Claude/Llama)
```

#### Components

- **Input Validator:** Check for empty code, validate input
- **Language Selector:** Support for Python, JavaScript, Java, C, C++
- **Mode Selector:** Beginner (detailed) vs Intermediate (concise)
- **API Client:** Fetch requests to AWS API Gateway endpoint
- **AWS Bedrock Integration:** AI-powered code analysis using foundation models
- **Response Parser:** Format AI output for readability
- **Error Handler:** User-friendly error messages

#### AI Request Strategy

```javascript
// API request structure for AWS Bedrock via API Gateway
const makeAIRequest = async (code, language, mode, action) => {
  const payload = {
    code: code,
    language: language,
    mode: mode,
    action: action, // review, debug, explain, tests, github
    errorMessage: errorMessage, // optional for debug
    githubUrl: githubUrl // optional for github review
  };
  
  // AWS API Gateway endpoint
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  // AWS Bedrock returns formatted response
  return await response.json();
};
```

---

### 2. Multi-Action System

#### Action Types

1. **Review Code** - Comprehensive code analysis
2. **Debug Error** - Error-specific debugging help
3. **Explain Code** - Line-by-line explanations
4. **Generate Tests** - Automatic test case creation
5. **Review GitHub File** - Direct GitHub URL analysis

#### Data Structure

```typescript
interface CodeReviewRequest {
  code: string;
  language: 'python' | 'javascript' | 'java' | 'c' | 'cpp';
  mode: 'beginner' | 'intermediate';
  action: 'review' | 'debug' | 'explain' | 'tests' | 'github';
  errorMessage?: string; // for debug action
  githubUrl?: string; // for github action
}

interface CodeReviewResponse {
  feedback?: string;
  review?: string;
  error?: string;
}
```

---

### 3. Response Formatting System

#### Parsing Strategy

```javascript
// Smart response parser
const parseResponse = (text) => {
  return text.split('\n').map((line, index) => {
    // Section headers (1) BUGS:, 2) IMPROVEMENTS:)
    if (/^\d+\)\s*[A-Z]+:/.test(line)) {
      return <SectionHeader key={index}>{line}</SectionHeader>;
    }
    
    // Code blocks (indented or starting with keywords)
    if (line.match(/^(\s{4,}|\t)/) || line.match(/^(def|class|import)/)) {
      return <CodeBlock key={index}>{line}</CodeBlock>;
    }
    
    // Bold text (**text**)
    if (line.includes('**')) {
      return <BoldText key={index}>{line}</BoldText>;
    }
    
    // Regular text
    return <Text key={index}>{line}</Text>;
  });
};
```

#### Formatting Rules

- **Section Headers:** Bold, colored (#667eea)
- **Code Snippets:** Gray background, monospace font, left border
- **Bold Text:** Parse ** markers
- **Lists:** Proper indentation
- **Separators:** Remove --- markers
- **Code Blocks:** Skip ``` markers

---

### 4. User Interface Design

#### Landing Page Components

```
Navigation Bar
    ├── Logo (Lightning icon + "Code Mentor")
    └── "Get Started" Button

Hero Section
    ├── Left Column
    │   ├── Tagline
    │   ├── Description
    │   └── CTA Button
    └── Right Column
        └── Hero Image (Code screenshot)

Features Section
    ├── Feature Card 1 (Instant Feedback)
    ├── Feature Card 2 (Smart Analysis)
    └── Feature Card 3 (Learn & Improve)

How It Works Section
    ├── Step 1 (Paste Code)
    ├── Step 2 (AI Analysis)
    └── Step 3 (Get Feedback)
```

#### Code Review Page Components

```
Navigation Bar
    ├── Logo (Back to home)
    └── "AI Code Review" Badge

Header Section
    ├── Title
    └── Subtitle

Main Content (Grid Layout)
    ├── Left Panel (Code Input)
    │   ├── Header with Language/Mode Selectors
    │   ├── Code Textarea
    │   ├── Error Message Textarea (optional)
    │   ├── GitHub URL Input (optional)
    │   ├── Action Buttons (5 buttons)
    │   └── Error Display
    └── Right Panel (Feedback - conditional)
        ├── Header with AI icon
        └── Formatted Feedback Content
```

---

### 5. Responsive Design System

#### Breakpoints

```css
/* Mobile First Approach */
.container {
  /* Mobile: 320px+ */
  padding: 20px;
  max-width: 100%;
}

@media (min-width: 768px) {
  /* Tablet */
  .container {
    padding: 40px;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

@media (min-width: 1400px) {
  /* Large Desktop */
  .container {
    max-width: 1600px;
  }
}
```

#### Grid System

```javascript
// Dynamic grid based on feedback presence
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: feedback ? '1fr 1fr' : '1fr',
  gap: '30px',
  transition: 'all 0.3s ease'
};
```

---

## Data Models

### User Session (Client-Side)

```typescript
interface UserSession {
  code: string;
  language: string;
  mode: string;
  errorMessage: string;
  githubUrl: string;
  activeAction: string;
  feedback: string;
  error: string;
  loading: boolean;
}
```

### API Request Model

```typescript
interface APIRequest {
  code: string;
  language: string;
  mode: string;
  action?: string;
  errorMessage?: string;
  githubUrl?: string;
}
```

### API Response Model

```typescript
interface APIResponse {
  feedback?: string;
  review?: string;
  error?: string;
  message?: string;
}
```

---

## API Design

### REST Endpoint

#### AWS Bedrock Code Review API

```
Endpoint: POST https://npuyixuzf8.execute-api.eu-north-1.amazonaws.com/review
Region: eu-north-1 (Stockholm, Sweden)
Service: AWS API Gateway → AWS Bedrock

Headers:
  Content-Type: application/json
  Accept: application/json

Body:
{
  "code": "def add(a, b):\n    return a + b",
  "language": "python",
  "mode": "beginner",
  "action": "review",
  "errorMessage": "optional error text",
  "githubUrl": "optional github url"
}

Response (Success):
{
  "feedback": "1) BUGS:\n---\nNo bugs found.\n\n2) IMPROVEMENTS:\n..."
}

Response (Error):
{
  "error": "Error message description"
}

AWS Bedrock Models Used:
- Claude (Anthropic) - For detailed code analysis
- Llama (Meta) - For code generation
- Other foundation models as available
```

---

## Security Design

### Data Protection

- **Environment Variables:** AWS API Gateway URL stored in .env.local
- **No PII Collection:** No user data stored
- **Input Validation:** Client-side validation before API call
- **Error Sanitization:** Generic error messages to users
- **HTTPS Only:** All API calls over secure connection to AWS
- **AWS Security:** Leverages AWS Bedrock's built-in security features

### API Security

```javascript
// Environment variable usage
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'fallback-url';

// Input validation
const validateInput = (code, action, errorMessage, githubUrl) => {
  if (action !== 'github' && !code.trim()) {
    throw new Error('Please enter some code');
  }
  
  if (action === 'debug' && !errorMessage.trim()) {
    throw new Error('Please enter an error message');
  }
  
  if (action === 'github' && !githubUrl.trim()) {
    throw new Error('Please enter a GitHub URL');
  }
};
```

### Git Security

```bash
# .gitignore configuration
.env*.local
.env
node_modules/
.next/
out/
```

---

## Performance Optimization

### Frontend Optimization

- **Code Splitting:** Next.js automatic code splitting
- **Image Optimization:** Next.js Image component with Unsplash CDN
- **Lazy Loading:** Images loaded on demand
- **Minimal JavaScript:** No external UI libraries
- **CSS Optimization:** Inline styles, no external CSS files

### API Optimization

- **Request Debouncing:** Prevent duplicate requests to AWS Bedrock
- **Loading States:** Clear feedback during AI processing
- **Error Retry:** Graceful error handling with retry option
- **Response Caching:** Browser cache for static assets
- **Token Optimization:** Efficient prompts to minimize AWS Bedrock costs

### Bundle Size

```javascript
// Keep bundle minimal
// No external dependencies except:
// - next
// - react
// - react-dom
```

---

## Deployment Strategy

### Development Workflow

```
Local Development → Git Commit → GitHub Push → Vercel Auto-Deploy → Production
```

### Environment Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

### Build Configuration

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Vercel Deployment

```bash
# Automatic deployment on push to main branch
# Environment variables set in Vercel dashboard:
# - NEXT_PUBLIC_API_URL
```

---

## Styling System

### Color Palette

```css
/* Primary Colors */
--primary-purple: #667eea;
--primary-dark: #5568d3;
--secondary-purple: #764ba2;

/* Neutral Colors */
--background: #f5f7fa;
--white: #ffffff;
--text-dark: #333333;
--text-medium: #666666;
--text-light: #999999;

/* Feedback Colors */
--error-bg: #fff5f5;
--error-border: #feb2b2;
--error-text: #c53030;
--success-bg: #f0fff4;
--code-bg: #f5f5f5;
```

### Typography

```css
/* Font Stack */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, sans-serif;

/* Code Font */
font-family: 'Consolas', 'Monaco', 'Courier New', monospace;

/* Font Sizes */
--text-xs: 12px;
--text-sm: 13px;
--text-base: 14px;
--text-md: 15px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 36px;
--text-4xl: 42px;
--text-5xl: 52px;
```

### Spacing System

```css
/* Spacing Scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

---

## Animation System

### Transitions

```css
/* Standard transitions */
transition: all 0.2s ease;
transition: border-color 0.2s ease;
transition: background-color 0.2s ease;
transition: transform 0.3s ease;
```

### Keyframe Animations

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Usage */
animation: slideIn 0.3s ease;
```

### Hover Effects

```javascript
// Button hover
onMouseOver={(e) => {
  if (!loading) e.target.style.backgroundColor = '#5568d3';
}}
onMouseOut={(e) => {
  if (!loading) e.target.style.backgroundColor = '#667eea';
}}
```

---

## Accessibility Considerations

### Semantic HTML

```html
<nav> for navigation
<main> for main content
<section> for content sections
<button> for interactive elements
<textarea> for code input
```

### Keyboard Navigation

- Tab order follows visual flow
- Enter key submits forms
- Escape key clears errors
- Focus indicators visible

### Screen Reader Support

```javascript
// ARIA labels
<button aria-label="Review code">Review Code</button>
<textarea aria-label="Code input" placeholder="Paste your code here...">
```

### Color Contrast

- Text: 4.5:1 minimum contrast ratio
- Interactive elements: 3:1 minimum
- Error messages: High contrast red

---

## Error Handling Strategy

### Client-Side Errors

```javascript
// Input validation errors
if (!code.trim()) {
  setError('Please enter some code to review');
  return;
}

// Network errors
catch (err) {
  setError('Failed to connect to the API: ' + err.message);
}

// API errors
if (data.error) {
  setError(data.error);
}
```

### User-Friendly Messages

```javascript
const errorMessages = {
  emptyCode: 'Please enter some code to review',
  emptyError: 'Please enter an error message for debugging',
  emptyGithub: 'Please enter a GitHub file URL',
  networkError: 'Failed to connect to the API. Please check your connection.',
  apiError: 'The AI service is temporarily unavailable. Please try again.',
  noFeedback: 'No feedback received from the AI. Please try again.'
};
```

---

## Testing Strategy

### Manual Testing Checklist

- [ ] All 5 action buttons work correctly
- [ ] Language selector changes language
- [ ] Mode selector changes mode
- [ ] Error messages display properly
- [ ] Feedback formatting is correct
- [ ] Loading states show correctly
- [ ] Responsive design works on mobile
- [ ] Icons display properly
- [ ] Navigation works
- [ ] Environment variables load

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Monitoring & Analytics

### Performance Metrics

```javascript
// Track key metrics
- Page load time
- API response time
- Error rate
- User engagement (button clicks)
```

### Error Tracking

```javascript
// Log errors for debugging
console.error('API Error:', error);
console.log('Request payload:', payload);
console.log('Response:', response);
```

---

## Future Enhancements

### Phase 2 Features

1. **User Accounts** - Save code history
2. **Code Comparison** - Before/after views
3. **Syntax Highlighting** - Monaco Editor integration
4. **Dark Mode** - Theme toggle
5. **More Languages** - Go, Rust, Swift, PHP
6. **Code Sharing** - Share review links
7. **Export Results** - Download as PDF/Markdown
8. **Real-time Collaboration** - Multiple users

### Phase 3 Features

1. **IDE Extensions** - VS Code, IntelliJ plugins
2. **Mobile Apps** - Native iOS/Android
3. **API Access** - Public API for developers
4. **Custom Models** - Fine-tuned for specific frameworks
5. **Team Features** - Organization accounts
6. **Analytics Dashboard** - Usage statistics
7. **Webhooks** - CI/CD integration
8. **Premium Tiers** - Advanced features

---

## Scalability Considerations

### Current Limits

- **Vercel Free Tier:** 100GB bandwidth/month
- **AWS Bedrock:** Pay-per-use pricing
- **Next.js:** Optimized for performance

### Scaling Strategy

1. **Optimize API calls:** Cache common patterns
2. **CDN usage:** Serve static assets efficiently
3. **Code splitting:** Load only necessary code
4. **Database (future):** Add caching layer
5. **Rate limiting:** Prevent abuse
6. **Load balancing:** Multiple API endpoints

---

## Documentation Standards

### Code Comments

```javascript
// Component description
// @param {string} code - User's code input
// @param {string} language - Programming language
// @returns {JSX.Element} Formatted feedback display
```

### README Updates

- Installation instructions
- Environment setup
- Usage examples
- API documentation
- Contributing guidelines

---

This design specification ensures Code Mentor is built with scalability, maintainability, and user experience as top priorities while leveraging modern web technologies and AWS AI services.

