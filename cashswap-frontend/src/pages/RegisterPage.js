import React, { useState } from 'react';
import api from '../api';
import './RegisterPage.css';

const RegisterPage = ({ user, onRegistered }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isValid = 
    name.trim() && 
    phone.trim() && 
    password.length >= 6 && 
    password === confirmPassword;

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Too short' };
    if (password.length < 8) return { strength: 2, label: 'Weak' };
    if (password.length < 12) return { strength: 3, label: 'Good' };
    return { strength: 4, label: 'Strong' };
  };

  const passwordStrength = getPasswordStrength();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await api.post('/api/users', {
        name: name.trim(),
        phone: phone.trim(),
        password
      });
      const registeredUser = res.data.user;
      const merged = {
        ...(user || {}),
        userId: registeredUser.userId,
        phone: registeredUser.phone
      };
      localStorage.setItem('cashswapUser', JSON.stringify(merged));
      onRegistered(merged);
    } catch (e) {
      setError('Failed to register user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValid) {
      handleRegister();
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="logo">💸 CashSwap</h1>
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join thousands of users swapping cash securely</p>
        </div>

        <div className="register-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your full name"
              className="input-field"
              autoFocus
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your phone number"
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Minimum 6 characters"
                className="input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                tabIndex="-1"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {password.length > 0 && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className={`strength-fill strength-${passwordStrength.strength}`}
                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                  ></div>
                </div>
                <span className={`strength-label strength-${passwordStrength.strength}`}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Re-enter your password"
              className="input-field"
            />
            {confirmPassword && password !== confirmPassword && (
              <span className="field-error">Passwords don't match</span>
            )}
            {confirmPassword && password === confirmPassword && (
              <span className="field-success">✓ Passwords match</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={!isValid || loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="spinner"></span> Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="terms-text">
            By registering, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
