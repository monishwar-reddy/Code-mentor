'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MentorPage() {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('python');
  const [mode, setMode] = useState('beginner');
  const [errorMessage, setErrorMessage] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [activeAction, setActiveAction] = useState('review');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://npuyixuzf8.execute-api.eu-north-1.amazonaws.com/review';

  const runAction = async (action) => {
    if (action !== 'github' && !code.trim()) {
      setError('Please enter some code');
      return;
    }

    if (action === 'debug' && !errorMessage.trim()) {
      setError('Please enter an error message for debugging');
      return;
    }

    if (action === 'github' && !githubUrl.trim()) {
      setError('Please enter a GitHub file URL');
      return;
    }

    setLoading(true);
    setError('');
    setFeedback('');
    setActiveAction(action);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          mode,
          action,
          errorMessage,
          githubUrl,
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }

      if (!response.ok) {
        setError(data.error || `HTTP ${response.status}: Request failed`);
      } else if (data.feedback) {
        setFeedback(data.feedback);
      } else if (data.review) {
        setFeedback(data.review);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('No feedback received');
      }
    } catch (err) {
      setError('Failed to connect to the API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const actionButtonStyle = (action) => ({
    flex: 1,
    minWidth: '160px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: activeAction === action ? '#5568d3' : '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <nav
        style={{
          backgroundColor: 'white',
          padding: '20px 40px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#667eea',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Code Mentor
        </Link>
        <div
          style={{
            fontSize: '14px',
            color: '#999',
          }}
        >
          AI Code Review
        </div>
      </nav>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 40px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '12px',
            }}
          >
            Community Code Mentor
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: '#666',
            }}
          >
            Review, debug, explain, test, and analyze GitHub files with AI
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: feedback ? '1fr 1fr' : '1fr',
            gap: '30px',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#333',
                  margin: 0,
                }}
              >
                Your Code
              </h2>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#333',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                </select>

                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#333',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                </select>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Paste your code here..."
              style={{
                width: '100%',
                minHeight: '300px',
                padding: '16px',
                fontSize: '14px',
                fontFamily: "'Consolas', 'Monaco', monospace",
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '16px',
                resize: 'vertical',
                backgroundColor: '#fafafa',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#667eea')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />

            <textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Optional: Paste error message here for Debug Error mode"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '16px',
                fontSize: '14px',
                fontFamily: "'Consolas', 'Monaco', monospace",
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '16px',
                resize: 'vertical',
                backgroundColor: '#fafafa',
                outline: 'none',
              }}
            />

            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="Optional: Paste GitHub file URL here for GitHub Review mode"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: '#fafafa',
                outline: 'none',
              }}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
              }}
            >
              <button
                onClick={() => runAction('review')}
                disabled={loading}
                style={actionButtonStyle('review')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {loading && activeAction === 'review' ? 'Reviewing...' : 'Review Code'}
              </button>

              <button
                onClick={() => runAction('debug')}
                disabled={loading}
                style={actionButtonStyle('debug')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="m8 2 1.88 1.88"></path>
                  <path d="M14.12 3.88 16 2"></path>
                  <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path>
                  <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path>
                  <path d="M12 20v-9"></path>
                  <path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path>
                  <path d="M6 13H2"></path>
                  <path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path>
                  <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path>
                  <path d="M22 13h-4"></path>
                  <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path>
                </svg>
                {loading && activeAction === 'debug' ? 'Debugging...' : 'Debug Error'}
              </button>

              <button
                onClick={() => runAction('explain')}
                disabled={loading}
                style={actionButtonStyle('explain')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                {loading && activeAction === 'explain' ? 'Explaining...' : 'Explain Code'}
              </button>

              <button
                onClick={() => runAction('tests')}
                disabled={loading}
                style={actionButtonStyle('tests')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M7 2h10"></path>
                  <path d="M5 6h14"></path>
                  <rect x="4" y="10" width="16" height="10" rx="1"></rect>
                  <path d="M8 14v4"></path>
                  <path d="M12 14v4"></path>
                  <path d="M16 14v4"></path>
                </svg>
                {loading && activeAction === 'tests' ? 'Generating...' : 'Generate Tests'}
              </button>

              <button
                onClick={() => runAction('github')}
                disabled={loading}
                style={actionButtonStyle('github')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                {loading && activeAction === 'github' ? 'Reviewing...' : 'Review GitHub File'}
              </button>
            </div>

            {error && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  backgroundColor: '#fff5f5',
                  border: '1px solid #feb2b2',
                  borderRadius: '8px',
                  color: '#c53030',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {feedback && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                animation: 'slideIn 0.3s ease',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                AI Feedback
              </h2>

              <div
                style={{
                  lineHeight: '1.8',
                  fontSize: '15px',
                  color: '#444',
                  maxHeight: '700px',
                  overflowY: 'auto',
                }}
              >
                {feedback.split('\n').map((line, index) => {
                  if (/^\d+\)\s*[A-Z\s]+:/.test(line)) {
                    return (
                      <div
                        key={index}
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#667eea',
                          marginTop: index === 0 ? '0' : '24px',
                          marginBottom: '12px',
                        }}
                      >
                        {line.replace(/^\d+\)\s*/, '')}
                      </div>
                    );
                  }

                  if (/^SCORE:/i.test(line.trim())) {
                    return (
                      <div
                        key={index}
                        style={{
                          backgroundColor: '#eef2ff',
                          color: '#4c51bf',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          marginBottom: '16px',
                          display: 'inline-block',
                        }}
                      >
                        {line}
                      </div>
                    );
                  }

                  if (line.trim() === '---') {
                    return <div key={index} style={{ height: '8px' }} />;
                  }

                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        {parts.map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i} style={{ color: '#333', fontWeight: '600' }}>
                              {part}
                            </strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </div>
                    );
                  }

                  if (line.trim().startsWith('```')) {
                    return null;
                  }

                  if (
                    line.match(/^(\s{2,}|\t)/) ||
                    line.match(/^(def|class|import|for|if|while|print|return|function|const|let|var)/)
                  ) {
                    return (
                      <div
                        key={index}
                        style={{
                          backgroundColor: '#f5f5f5',
                          padding: '6px 10px',
                          fontFamily: "'Consolas', 'Monaco', monospace",
                          fontSize: '14px',
                          color: '#d63384',
                          borderLeft: '3px solid #667eea',
                          marginLeft: '12px',
                          marginBottom: '4px',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {line}
                      </div>
                    );
                  }

                  if (line.trim()) {
                    return (
                      <div key={index} style={{ marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                        {line}
                      </div>
                    );
                  }

                  return <div key={index} style={{ height: '8px' }} />;
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}