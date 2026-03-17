import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RegisterPage = ({ onSwitch }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', rollNumber: '' });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.rollNumber);
      toast.success('Account created! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">✨</span>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Start tracking your attendance today</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handle}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Roll Number <span style={{color:'var(--text3)',fontWeight:400,textTransform:'none'}}>(optional)</span></label>
            <input
              className="form-input"
              name="rollNumber"
              placeholder="e.g. CS2401"
              value={form.rollNumber}
              onChange={handle}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handle}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? '⏳ Creating...' : '🎓 Create Account'}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account?
          <button onClick={onSwitch}>Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
