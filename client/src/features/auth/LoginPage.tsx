import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { LogIn, TrendingUp, Shield, Zap, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('demo@spendwise.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Left panel — branding */}
      <div style={{
        display: 'none',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }} className="auth-left-panel">
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(34,197,94,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 400, height: 400, borderRadius: '50%', background: 'rgba(34,197,94,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>SpendWise AI</div>
              <div style={{ fontSize: '0.6875rem', color: '#22c55e', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Personal Finance</div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Take control of<br />
            <span style={{ color: '#22c55e' }}>your finances</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '360px' }}>
            Track spending, set budgets, and achieve your savings goals with AI-powered insights.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: <TrendingUp size={18} color="#22c55e" />, label: 'Real-time spending analytics' },
              { icon: <Shield size={18} color="#22c55e" />, label: 'Bank-grade security' },
              { icon: <Zap size={18} color="#22c55e" />, label: 'AI-powered insights' },
            ].map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ color: '#cbd5e1', fontSize: '0.9375rem', fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        minHeight: '100vh',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          animation: 'authCardIn 0.4s ease',
        }}>
          {/* Logo (shown on mobile / single-column) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(34,197,94,0.4)' }}>
              <TrendingUp size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>SpendWise AI</div>
              <div style={{ fontSize: '0.6875rem', color: '#22c55e', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Personal Finance</div>
            </div>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '2rem',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
                Welcome back
              </h2>
              <p style={{ fontSize: '0.9375rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Sign in to your SpendWise AI account
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px',
                padding: '0.875rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.875rem',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              {/* Email field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '2.75rem',
                    padding: '0 0.875rem',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    fontSize: '0.9375rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22c55e';
                    e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password field */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1' }}>
                    Password
                  </label>
                  <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: '#22c55e', textDecoration: 'none', fontWeight: 500 }}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '2.75rem',
                      padding: '0 2.75rem 0 0.875rem',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      fontSize: '0.9375rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#22c55e';
                      e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      padding: 0,
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  height: '2.875rem',
                  borderRadius: '10px',
                  background: isLoading ? '#15803d' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.8 : 1,
                  boxShadow: '0 4px 16px rgba(34,197,94,0.4)',
                  transition: 'all 0.15s',
                  marginTop: '0.25rem',
                }}
              >
                {isLoading ? (
                  <>
                    <svg style={{ animation: 'spin 0.8s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1rem',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: '10px',
              fontSize: '0.8125rem',
              color: '#86efac',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: '#4ade80' }}>Demo account pre-filled.</strong> Just click Sign In.
            </div>

            {/* Register link */}
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9375rem', color: '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>
                Create account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8125rem', color: '#334155' }}>
            Built by{' '}
            <a href="mailto:inamdarujair@gmail.com" style={{ color: '#22c55e', textDecoration: 'none' }}>
              Ujair Faizahmed Inamdar
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes authCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px rgba(30, 41, 59, 0.9) inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        @media (min-width: 900px) {
          .auth-left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
