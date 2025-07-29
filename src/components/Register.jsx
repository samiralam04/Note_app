import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaArrowRight, FaCheck, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOtp = async () => {
    setError('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', { email });
      setStep('otp');
      setSuccessMessage(`OTP sent to ${email}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      onRegister(res.data.user);
      setSuccessMessage('Registration successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <FaUserPlus className="register-icon" />
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join us to get started</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {step === 'email' ? (
          <>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="register-input"
                autoFocus
              />
            </div>
            <button 
              onClick={handleSendOtp} 
              className="primary-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'} <FaArrowRight className="button-icon" />
            </button>
          </>
        ) : (
          <>
            <p className="otp-instruction">Check your email for the 6-digit code</p>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="register-input"
                maxLength="6"
                inputMode="numeric"
                autoFocus
              />
            </div>
            <button 
              onClick={handleVerifyOtp} 
              className="primary-button"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'} <FaCheck className="button-icon" />
            </button>

            <div className="resend-section">
              <p>Didn't receive code?</p>
              <button 
                onClick={handleSendOtp} 
                className="resend-button"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button className="back-to-login" onClick={onSwitchToLogin}>
            <FaSignInAlt className="back-to-login-icon" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

// CSS Styles
const styles = `
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }

  .register-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    padding: 40px;
    width: 100%;
    max-width: 420px;
    transition: all 0.3s ease;
    margin: 20px;
    overflow: hidden;
  }

  .register-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .register-icon {
    font-size: 32px;
    color: #4f46e5;
    margin-bottom: 10px;
  }

  .register-title {
    color: #1e293b;
    font-size: 24px;
    font-weight: 600;
    margin: 8px 0;
  }

  .register-subtitle {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }

  .input-group {
    position: relative;
    margin-bottom: 20px;
    width: 100%;
  }

  .input-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 16px;
  }

  .register-input {
    width: calc(100% - 58px);
    padding: 14px 15px 14px 42px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s;
  }

  .register-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  .primary-button {
    width: 100%;
    padding: 14px;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    margin-bottom: 20px;
  }

  .primary-button:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
  }

  .primary-button:disabled {
    background-color: #c7d2fe;
    cursor: not-allowed;
    transform: none;
  }

  .button-icon {
    margin-left: 8px;
    font-size: 14px;
  }

  .error-message {
    color: #dc2626;
    background-color: #fee2e2;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 20px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }

  .success-message {
    color: #059669;
    background-color: #d1fae5;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 20px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }

  .otp-instruction {
    color: #475569;
    font-size: 14px;
    text-align: center;
    margin-bottom: 20px;
    width: 100%;
  }

  .resend-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
    font-size: 14px;
    color: #64748b;
    width: 100%;
  }

  .resend-button {
    background: none;
    border: none;
    color: #4f46e5;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
  }

  .resend-button:hover {
    text-decoration: underline;
  }

  .resend-button:disabled {
    color: #c7d2fe;
    cursor: not-allowed;
    text-decoration: none;
  }

  .auth-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #edf2f7;
    color: #718096;
    font-size: 14px;
    width: 100%;
  }

  .back-to-login {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    margin-top: 8px;
    color: #4f46e5;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    padding: 5px;
    font-size: 14px;
  }

  .back-to-login:hover {
    color: #4338ca;
    transform: translateX(2px);
  }

  .back-to-login-icon {
    margin-right: 6px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    .register-card {
      padding: 30px 20px;
      border-radius: 12px;
      margin: 10px;
    }
    
    .register-title {
      font-size: 22px;
    }
    
    .register-input, .primary-button {
      padding: 12px 14px 12px 40px;
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);