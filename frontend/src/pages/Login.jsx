import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const API = 'http://localhost:5000/api/auth';
const tokenKey = 'colive_token';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'tenant' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPreview, setUserPreview] = useState(null);
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const loginRequest = async (payload) => {
    return axios.post(`${API}/login`, payload);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setUserPreview(null);

    try {
      setLoading(true);
      const res = await loginRequest({
        email: form.email,
        password: form.password,
        role: form.role,
      });

      const { token, user } = res.data;
      // Save token and user for ProtectedRoute / role checks
      localStorage.setItem(tokenKey, token);
      localStorage.setItem('colive_user', JSON.stringify(user));

      // 🔁 Role-based redirection (use routes defined in App.jsx)
      if (user.role === 'admin') {
        nav('/admin/dashboard');
      } else if (user.role === 'landlord') {
        nav('/landlord/dashboard');
      } else {
        nav('/dashboard');
      }
    } catch (error) {
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
        {/* Left Panel */}
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5 bg-primary"
        style={{
            background: 'linear-gradient(45deg, #ff4d4d, #ff6b6b)',
          }}
          >
          <h1 className="fw-bold mb-3">Welcome to Co-Live</h1>
          <p className="lead text-center">Login to manage your housing experience seamlessly.</p>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-5"
        >
          <h2 className="fw-bold mb-4">Login</h2>

          <form onSubmit={submit} style={{ maxWidth: 400, width: '100%' }}>
            <div className="mb-3">
              <label className="form-label">
                <FaEnvelope className="me-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handle}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaLock className="me-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handle}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
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

            {err && <div className="alert alert-danger">{err}</div>}

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
            background: 'linear-gradient(45deg, #ff4d4d, #ff6b6b)',
          }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="mt-3 text-center">
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
