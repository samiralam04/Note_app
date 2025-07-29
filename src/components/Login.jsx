import React, { useState } from 'react';
import axios from 'axios';
import {
  FaEnvelope, FaLock, FaGoogle, FaArrowRight, FaCheck, 
} from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import { setTokenCookie,  } from '../utils/tokenUtils'; 

const Login = ({ onLogin, }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP to email
  const handleEmailSubmit = async () => {
    setError('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/request-otp', { email });
      setStep('otp'); // Move to OTP step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and login
  const handleOtpSubmit = async () => {
  setError('');

  if (!otp || otp.length !== 6) {
    setError('Enter the 6-digit OTP');
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post('/api/auth/verify-otp', { email, otp });

    console.log('Full response from server:', res.data); //  Debug log

    const token = res.data.token;

    if (token) {
      setTokenCookie(token);

      onLogin(res.data.user); // Callback to parent component
    } else {
      setError('No token received from server');
    }
  } catch (err) {
    console.error('OTP verify error:', err); // Log the error
    setError(err.response?.data?.message || 'Invalid or expired OTP');
  } finally {
    setLoading(false);
  }
};


  // Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const res = await axios.post('/api/auth/google', {
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
        });

        //  Save the token
        const token = res.data.token;
        if (token) {
          setTokenCookie(token);
          onLogin(res.data.user);
        } else {
          setError('No token received from Google login');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Google login failed');
      }
    },
    onError: () => setError('Google login failed'),
    scope: 'email profile',
    flow: 'implicit',
  });

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/request-otp', { email });
      setError('OTP has been re-sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 'email' ? (
          <>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="auth-input"
                disabled={loading}
                autoFocus
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              className="primary-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Continue'} <FaArrowRight className="button-icon" />
            </button>

            <div className="divider">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            <button
              onClick={() => googleLogin()}
              className="google-button"
              disabled={loading}
            >
              <FaGoogle className="google-icon" /> Continue with Google
            </button>
          </>
        ) : (
          <>
            <p className="otp-instruction">A 6-digit code was sent to {email}</p>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="auth-input"
                maxLength="6"
                inputMode="numeric"
                autoFocus
                disabled={loading}
              />
            </div>
            <button
              onClick={handleOtpSubmit}
              className="primary-button"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'} <FaCheck className="button-icon" />
            </button>

            <p className="resend-text">
              Didn't receive code?{' '}
              <button className="resend-button" onClick={handleResendOtp} disabled={loading}>
                Resend
              </button>
            </p>
          </>
        )}

        
      </div>
    </div>
  );
};

export default Login;


// CSS Styles
const styles = `
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }

  .auth-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    padding: 40px;
    width: 100%;
    max-width: 420px;
    transition: all 0.3s ease;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .auth-title {
    color: #1a202c;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .auth-subtitle {
    color: #718096;
    font-size: 14px;
    margin: 0;
  }

  .input-group {
    position: relative;
    margin-bottom: 20px;
  }

  .input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
    font-size: 16px;
  }

  .auth-input {
    width: 84%;
    padding: 14px 16px 14px 44px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s;
  }

  .auth-input:focus {
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
    border-radius: 10px;
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
    background-color: #a5b4fc;
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
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background-color: #e2e8f0;
  }

  .divider-text {
    padding: 0 12px;
    color: #a0aec0;
    font-size: 12px;
    text-transform: uppercase;
  }

  .google-button {
    width: 100%;
    padding: 14px;
    background-color: white;
    color: #2d3748;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    margin-bottom: 20px;
  }

  .google-button:hover {
    background-color: #f7fafc;
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }

  .google-icon {
    margin-right: 10px;
    color: #e53e3e;
    font-size: 16px;
  }

  .otp-instruction {
    color: #4a5568;
    font-size: 14px;
    margin-bottom: 20px;
    text-align: center;
  }

  .resend-text {
    color: #718096;
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
  }

  .resend-button {
    background: none;
    border: none;
    color: #4f46e5;
    cursor: pointer;
    font-weight: 500;
    padding: 0;
  }

  .resend-button:hover {
    text-decoration: underline;
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
  }

  @media (max-width: 480px) {
    .auth-card {
      padding: 30px 20px;
      border-radius: 12px;
    }
    
    .auth-title {
      font-size: 22px;
    }
    
    .auth-input, .primary-button, .google-button {
      padding: 12px 14px 12px 40px;
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);