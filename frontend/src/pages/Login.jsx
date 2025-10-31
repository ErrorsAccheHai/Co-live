import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const API = 'http://localhost:5000/api/auth';
const tokenKey = 'colive_token';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'', role:'tenant' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPreview, setUserPreview] = useState(null);
  const nav = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]:e.target.value });

  // helper to perform login request — returns response or throws
  const loginRequest = async (payload) => {
    return axios.post(`${API}/login`, payload);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setUserPreview(null);
    try {
      setLoading(true);
      // send role as well so server can validate
      const res = await loginRequest({ email: form.email, password: form.password, role: form.role });
      const { token, user } = res.data;

      // Server returns success only when role matches (see backend)
      localStorage.setItem(tokenKey, token);
      nav('/dashboard');
    } catch (error) {
      // If backend returns 403 with account preview, surface it
      const status = error.response?.status;
      if (status === 403 && error.response?.data?.user) {
        const acct = error.response.data.user;
        setUserPreview(acct);
        setErr(error.response.data.msg || 'Role mismatch');
      } else {
        setErr(error.response?.data?.msg || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-0">
      <div className="row m-0 min-vh-100">
        {/* Left Panel - Image and Welcome Text */}
        <div 
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5"
          style={{
            background: 'linear-gradient(45deg, #ff4d4d, #ff6b6b)',
          }}
        >
          <div 
            className="text-center p-5 rounded-3"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h1 className="display-4 fw-bold mb-4">Welcome Back!</h1>
            <p className="lead mb-4">Sign in to access your account and manage your properties</p>
            <div className="mt-5">
              <h4 className="mb-4">New to Co-Live?</h4>
              <Link to="/signup" className="btn btn-lg btn-outline-light px-4">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="col-md-6 d-flex align-items-center">
          <div className="w-100 p-4 p-md-5">
            <div className="card border-0 shadow-sm" style={{ maxWidth: 500, margin: '0 auto' }}>
              <div className="card-body p-4">
                <h3 className="text-center mb-4 fw-bold">Sign In to Co-Live</h3>

                {err && (
                  <div className="alert alert-danger">{err}</div>
                )}

                {userPreview && (
                  <div className="alert alert-warning">
                    <strong>Account preview:</strong>
                    <div className="mt-2 small">
                      <div><strong>Name:</strong> {userPreview.name || '—'}</div>
                      <div><strong>Email:</strong> {userPreview.email || '—'}</div>
                      <div><strong>Role:</strong> {userPreview.role || '—'}</div>
                    </div>
                    <div className="mt-2 small">
                      If this doesn't look like your account, double-check your credentials or contact support.
                    </div>
                  </div>
                )}
                {userPreview && (
                  <div className="d-flex justify-content-center mb-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={async () => {
                        // Auto-set the role to the account role and retry login
                        const acctRole = userPreview.role;
                        setForm(prev => ({ ...prev, role: acctRole }));
                        setErr('');
                        setLoading(true);
                        try {
                          const res = await loginRequest({ email: form.email, password: form.password, role: acctRole });
                          const { token } = res.data;
                          localStorage.setItem(tokenKey, token);
                          nav('/dashboard');
                        } catch (err) {
                          setErr(err.response?.data?.msg || 'Login failed');
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Use account role ({userPreview.role}) and sign in
                    </button>
                  </div>
                )}

                <form onSubmit={submit}>
                  <div className="mb-4">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaEnvelope /></span>
                      <input 
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handle}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaLock /></span>
                      <input 
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={handle}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="form-check">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          id="rememberMe" 
                        />
                        <label className="form-check-label small" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <Link to="/forgot-password" className="text-decoration-none small" style={{ color: '#ff4d4d' }}>
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Login As</label>
                    <select 
                      className="form-select" 
                      name="role" 
                      value={form.role} 
                      onChange={handle}
                    >
                      <option value="tenant">Tenant</option>
                      <option value="landlord">Landlord</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="btn w-100 text-white mb-4" 
                    style={{ background: '#ff4d4d' }}
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>

                  <p className="text-center mb-0">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-decoration-none" style={{ color: '#ff4d4d' }}>
                      Sign Up
                    </Link>
                  </p>
                </form>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link to="/" className="text-decoration-none" style={{ color: '#ff4d4d' }}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
