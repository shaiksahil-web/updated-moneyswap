import React, { useState } from 'react';
import api from '../api';
import './LoginPage.css'; // We'll create this CSS file next

const LoginPage = ({ onLoginSuccess, onGoToRegister }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      await api.post('/api/auth/send-otp', { phone });
      setStep('otp');
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/api/auth/verify-otp', { phone, otp });
      const { userId, token, isNewUser } = res.data;
      const userInfo = { userId, phone, token, isNewUser };

      localStorage.setItem('cashswapUser', JSON.stringify(userInfo));
      onLoginSuccess(userInfo);
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    if (!phone) {
      setError('Enter phone number first.');
      return;
    }
    onGoToRegister({ phone });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="logo">💸 CashSwap</h1>
          <h2 className="login-title">Welcome Back</h2>
        </div>

        {step === 'phone' && (
          <div className="login-form">
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="input-field"
                autoFocus
              />
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!phone || loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Sending...
                </>
              ) : (
                'Send OTP'
              )}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button
              type="button"
              onClick={handleGoToRegister}
              className="btn btn-secondary"
            >
              Create New Account
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="login-form">
            <div className="otp-info">
              <p>Enter the OTP sent to <strong>{phone}</strong></p>
              <p className="demo-note">(Demo: 123456)</p>
            </div>

            <div className="input-group">
              <label htmlFor="otp">One-Time Password</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="input-field otp-input"
                maxLength="6"
                autoFocus
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!otp || loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
              className="btn btn-link"
            >
              ← Change Phone Number
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
