import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const API = 'http://localhost:5000/api/auth';
//const API = 'https://colive-backend-production.up.railway.app/api/auth';

const tokenKey = 'colive_token';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'tenant' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const toast = useToast();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      setLoading(true);
      const res = await axios.post(`${API}/login`, {
        email: form.email,
        password: form.password,
        role: form.role,
      });

      const { token, user } = res.data;
      localStorage.setItem(tokenKey, token);
      localStorage.setItem('colive_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChanged'));

      // After-login queued action (if any)
      const queued = localStorage.getItem('afterLogin');
      if (queued) {
        try {
          const q = JSON.parse(queued);
          localStorage.removeItem('afterLogin');
          if (q.action === 'rent' || q.action === 'buy') {
            toast({ title: 'Continue action', description: `Please continue to ${q.action} the property.`, status: 'info', duration: 5000 });
            nav('/properties');
            return;
          }
        } catch (e) {
          localStorage.removeItem('afterLogin');
        }
      }

      if (user.role === 'admin') nav('/admin/dashboard');
      else if (user.role === 'landlord') nav('/landlord/dashboard');
      else nav('/dashboard');
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 && error.response?.data?.user) {
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
        {/* Left Panel */}
        <div
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5"
          style={{ background: 'linear-gradient(135deg, #ff4d4d 0%, #ff6b6b 100%)' }}
        >
          <div className="text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏠</div>
            <h1 className="fw-bold mb-3 display-5">Welcome Back</h1>
            <p className="lead text-white-75 mb-5">
              Sign in to manage your housing experience seamlessly.
            </p>
            <div className="row mt-2">
              <div className="col-6 text-center">
                <h3 className="fw-bold">1000+</h3>
                <p className="mb-0" style={{ opacity: 0.85 }}>Happy Tenants</p>
              </div>
              <div className="col-6 text-center">
                <h3 className="fw-bold">500+</h3>
                <p className="mb-0" style={{ opacity: 0.85 }}>Properties Listed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-5">
          <div style={{ width: '100%', maxWidth: 420 }}>
            {/* Logo */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-start' }}>
              <Link to="/" className="text-decoration-none d-flex align-items-center" style={{ gap: 8 }}>
                <span style={{ fontSize: 22 }}>🏠</span>
                <span className="fw-bold text-brand" style={{ fontSize: '1.1rem' }}>Co‑Live</span>
              </Link>
            </div>

            {/* Form Card — same glass-card as Signup */}
            <div className="card border-0 glass-card w-100">
              <div className="card-body p-4">
                <h3 className="text-center mb-1 fw-bold">Sign In</h3>
                <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                  Enter your credentials to continue
                </p>

                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaEnvelope /></span>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handle}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaLock /></span>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handle}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Login as</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaUserTag /></span>
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
                  </div>

                  {err && <div className="alert alert-danger py-2">{err}</div>}

                  <button
                    type="submit"
                    className="btn brand-btn w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <p className="mt-3 text-center mb-0" style={{ fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" className="fw-semibold text-brand text-decoration-none">
                      Create account
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
