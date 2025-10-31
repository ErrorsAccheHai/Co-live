import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaIdCard, FaPhone } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const API = 'http://localhost:5000/api/auth';

export default function Signup() {
  const nav = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP Verification, 3: Complete Profile
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'tenant', phone: '', panName: '', panNo: '', aadhar: '', idType: '', idNumber: '', otp: ''
  });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Start OTP timer
  const startTimer = () => {
    setTimer(300); // 5 minutes
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendOtp = async (e) => {
    e?.preventDefault();
    setErr(''); setMsg('');
    if (!form.email) return setErr('Enter your email first');
    try {
      setLoading(true);
      const res = await axios.post(`${API}/send-otp`, { email: form.email });
      setMsg(res.data.note || 'OTP sent successfully');
      startTimer();
      if (step === 1) setStep(2);
    } catch (error) {
      setErr(error.response?.data?.msg || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!form.otp) return setErr('Enter OTP');
    try {
      setLoading(true);
      await axios.post(`${API}/verify-otp`, { 
        email: form.email,
        otp: form.otp 
      });
      setMsg('OTP verified successfully');
      setStep(3);
    } catch (error) {
      setErr(error.response?.data?.msg || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (form.password !== form.confirmPassword) {
      return setErr('Passwords do not match');
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/signup`, form);
      localStorage.setItem('colive_token', res.data.token);
      nav('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.msg || 'Signup failed');
      if (error.response?.data?.msg?.includes('OTP')) {
        setStep(2); // Go back to OTP step if OTP is invalid
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
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
        <small className="text-muted mt-1">We'll never share your email with anyone else.</small>
      </div>
      <button 
        type="submit" 
        className="btn brand-btn w-100 py-2" 
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
      <p className="text-center mt-3">
        Already have an account? <Link to="/login" className="text-primary">Sign In</Link>
      </p>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={verifyOtp}>
      <div className="mb-4">
        <label className="form-label">Verification Code</label>
        <div className="input-group">
          <span className="input-group-text"><FaLock /></span>
          <input 
            type="text" 
            className="form-control form-control-lg text-center" 
            name="otp" 
            value={form.otp} 
            onChange={handle} 
            required 
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            style={{ letterSpacing: '0.5em' }}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">
            Check your email for the verification code
          </small>
          {timer > 0 && (
            <small className="text-primary">
              Expires in {formatTime(timer)}
            </small>
          )}
        </div>
      </div>
      <div className="d-grid gap-3">
        <button 
          type="submit" 
          className="btn brand-btn py-2" 
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
        {timer === 0 && (
          <button 
            type="button" 
            className="btn brand-outline"
            onClick={sendOtp} 
            disabled={loading}
          >
            Resend Code
          </button>
        )}
      </div>
      <p className="text-center mt-3">
        <small>
          Didn't receive the code? Check your spam folder or{' '}
          <a href="#" className="text-primary" onClick={(e) => { e.preventDefault(); setStep(1); }}>
            try a different email
          </a>
        </small>
      </p>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={submit}>
      <div className="mb-4">
        <label className="form-label">Full Name</label>
        <div className="input-group">
          <span className="input-group-text"><FaUser /></span>
          <input 
            className="form-control" 
            name="name" 
            value={form.name} 
            onChange={handle} 
            placeholder="Enter your full name"
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
            placeholder="Create a strong password"
            required 
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Confirm Password</label>
        <div className="input-group">
          <span className="input-group-text"><FaLock /></span>
          <input 
            type="password" 
            className="form-control" 
            name="confirmPassword" 
            value={form.confirmPassword} 
            onChange={handle} 
            placeholder="Confirm your password"
            required 
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Register as</label>
        <select className="form-select" name="role" value={form.role} onChange={handle}>
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
        </select>
      </div>

      {form.role === 'tenant' && (
        <>
          <div className="mb-4">
            <label className="form-label">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text"><FaPhone /></span>
              <input 
                className="form-control" 
                name="phone" 
                value={form.phone} 
                onChange={handle} 
                placeholder="Enter your phone number"
                required 
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label">ID Type</label>
              <select className="form-select" name="idType" value={form.idType} onChange={handle} required>
                <option value="">Select ID Type</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="passport">Passport</option>
                <option value="driving">Driving License</option>
              </select>
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label">ID Number</label>
              <div className="input-group">
                <span className="input-group-text"><FaIdCard /></span>
                <input 
                  className="form-control" 
                  name="idNumber" 
                  value={form.idNumber} 
                  onChange={handle} 
                  placeholder="Enter ID number"
                  required 
                />
              </div>
            </div>
          </div>
        </>
      )}

      {form.role === 'landlord' && (
        <>
          <div className="mb-4">
            <label className="form-label">Name (as per PAN)</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input 
                className="form-control" 
                name="panName" 
                value={form.panName} 
                onChange={handle} 
                placeholder="Enter name as per PAN"
                required 
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">PAN Number</label>
            <div className="input-group">
              <span className="input-group-text"><FaIdCard /></span>
              <input 
                className="form-control" 
                name="panNo" 
                value={form.panNo} 
                onChange={handle} 
                placeholder="Enter PAN number"
                required 
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Aadhaar Number</label>
            <div className="input-group">
              <span className="input-group-text"><FaIdCard /></span>
              <input 
                className="form-control" 
                name="aadhar" 
                value={form.aadhar} 
                onChange={handle} 
                placeholder="Enter Aadhaar number"
                required 
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text"><FaPhone /></span>
              <input 
                className="form-control" 
                name="phone" 
                value={form.phone} 
                onChange={handle} 
                placeholder="Enter phone number"
                required 
              />
            </div>
          </div>
        </>
      )}

      <button 
        type="submit" 
        className="btn brand-btn w-100 py-2" 
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Complete Sign Up'}
      </button>
      
      <p className="text-center mt-3">
        <small className="text-muted">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-primary">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary">Privacy Policy</Link>
        </small>
      </p>
    </form>
  );

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
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-4">Welcome to Co-Live</h1>
            <p className="lead mb-4">Find your perfect living space or list your property with us.</p>
            <div className="row mt-5">
              <div className="col-6">
                <div className="text-center mb-4">
                  <h3 className="fw-bold">1000+</h3>
                  <p className="mb-0">Happy Tenants</p>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center mb-4">
                  <h3 className="fw-bold">500+</h3>
                  <p className="mb-0">Properties Listed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className="col-md-6 d-flex center-panel">
          <div className="w-100 p-3 p-md-4" style={{ maxWidth: 680 }}>
            <div className="card border-0 glass-card" style={{ maxWidth: 600, margin: '0 auto' }}>
              <div className="card-body p-4">
                <h3 className="text-center mb-4 fw-bold">Create Your Account</h3>
                
                {/* Progress Steps */}
                <div className="position-relative mb-5">
                  <div className="progress" style={{ height: '2px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${((step-1)/2)*100}%` }}
                      aria-valuenow={((step-1)/2)*100} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="position-absolute w-100 d-flex justify-content-between" style={{ top: '-10px' }}>
                    <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`progress-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                  </div>
                </div>

                {/* Step Labels */}
                <div className="text-center mb-4">
                  <h5 className="text-primary mb-3 fw-bold">
                    {step === 1 && 'Enter Your Email'}
                    {step === 2 && 'Verify Your Email'}
                    {step === 3 && 'Complete Your Profile'}
                  </h5>
                  <p className="text-muted">
                    {step === 1 && "We'll send you a verification code to your email"}
                    {step === 2 && 'Enter the verification code sent to your email'}
                    {step === 3 && 'Fill in your details to complete registration'}
                  </p>
                </div>

                {err && <div className="alert alert-danger">{err}</div>}
                {msg && <div className="alert alert-success">{msg}</div>}

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
