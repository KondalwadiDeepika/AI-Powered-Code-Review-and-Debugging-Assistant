import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { reviewAPI } from '../api/api';

const PLACEHOLDER = `// Paste your code here for AI-powered analysis
// Supports: Java, Python, JavaScript, C++, SQL, and more

public class Main {
    public static void main(String[] args) {
        int num = "10";
        System.out.println("Number is: " + num);
        for(int i = 0; i <= 5; i--)
            System.out.println(i);
        String name = null;
        System.out.println(name.length());
        int result = 10 / 0;
    }
}`;

const LANGUAGES = ['javascript','typescript','java','python','cpp','csharp','go','rust','sql','php','ruby','swift','kotlin'];

const SEV_COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#dc2626' };

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 19, color: 'var(--muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700, color, fontSize: 13 }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: 3, transition: 'width 1s ease', boxShadow: `0 0 8px ${color}60` }} />
      </div>
    </div>
  );
}

function LoadingAnimation() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#818cf8', animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#22d3ee', animation: 'spin 1.5s linear infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#a855f7', animation: 'spin 2s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 25, color: 'var(--text)', marginBottom: 6 }}>AI Analyzing Code...</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>Scanning for bugs, vulnerabilities & issues</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Parsing','Analyzing','Scoring'].map((s, i) => (
          <div key={s} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 18, color: '#818cf8', animation: `pulse ${1 + i * 0.3}s infinite` }}>{s}</div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const [code, setCode] = useState(PLACEHOLDER);
  const [lang, setLang] = useState('java');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await reviewAPI.submit(code);
      setResult(data);
    } catch (err) {
      setError('Review failed. Is the backend running?');
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => { setCode(''); setResult(null); setError(''); };

  return (
    <div className="animate-in" style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">⚡ AI Code Review</h1>
        <p className="page-sub">Paste your code for instant AI-powered analysis — bugs, security, performance & more</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        {/* Editor panel */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Toolbar */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,13,26,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 22 }}>Code Editor</span>
              <select value={lang} onChange={e => setLang(e.target.value)}
                style={{ width: 'auto', padding: '4px 10px', fontSize: 12, borderRadius: 8, background: 'var(--surface3)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 18 }}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button onClick={handleClear} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 18 }}>🗑 Clear</button>
              <button onClick={handleReview} disabled={loading} className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 20 }}>
                {loading ? '⟳ Analyzing…' : '⚡ Analyze Code'}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              language={lang}
              theme="vs-dark"
              value={code}
              onChange={val => setCode(val || '')}
              options={{
                fontSize: 13, minimap: { enabled: true },
                lineNumbers: 'on', scrollBeyondLastLine: false,
                padding: { top: 12 }, fontFamily: 'JetBrains Mono, monospace',
                renderLineHighlight: 'all',
                smoothScrolling: true,
                cursorBlinking: 'phase',
              }}
            />
          </div>
        </div>

        {/* Results panel */}
        <div className="card" style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', padding: 0 }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(10,13,26,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 22 }}>Analysis Results</span>
            {result && <span className={`badge badge-${result.severityLevel?.toLowerCase()}`}>{result.severityLevel}</span>}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
            {!result && !loading && !error && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.6 }}>🔍</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Ready to analyze</div>
                <div style={{ fontSize: 13 }}>Click "Analyze Code" to get a full AI-powered report</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['Bug Detection','Security Scan','Performance','Code Quality'].map(f => (
                    <span key={f} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 18, color: '#818cf8' }}>{f}</span>
                  ))}
                </div>
              </div>
            )}

            {loading && <LoadingAnimation />}

            {error && <div className="error" style={{ margin: 0 }}>⚠ {error}</div>}

            {result && (
              <div className="animate-in">
                {/* Info chips */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                  <div style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 20 }}>
                    <span style={{ color: 'var(--muted)', fontSize: 11 }}>Language </span>
                    <span style={{ fontWeight: 700, color: '#818cf8' }}>{result.languageDetected}</span>
                  </div>
                  <div style={{ padding: '6px 14px', borderRadius: 20, background: `${SEV_COLORS[result.severityLevel] || '#818cf8'}15`, border: `1px solid ${SEV_COLORS[result.severityLevel] || '#818cf8'}30`, fontSize: 20 }}>
                    <span style={{ color: 'var(--muted)', fontSize: 11 }}>Severity </span>
                    <span style={{ fontWeight: 700, color: SEV_COLORS[result.severityLevel] }}>{result.severityLevel}</span>
                  </div>
                </div>

                {/* Score bars */}
                <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '16px', marginBottom: 20, border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14, color: 'var(--muted2)' }}>📊 SCORES</div>
                  <ScoreBar label="Quality Score" score={result.qualityScore} color="#818cf8" />
                  <ScoreBar label="Security Score" score={result.securityScore} color="#22d3ee" />
                  <ScoreBar label="Performance Score" score={result.performanceScore} color="#f59e0b" />
                </div>

                {/* Markdown report */}
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.reviewResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
