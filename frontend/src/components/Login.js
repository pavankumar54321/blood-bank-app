import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { donorService } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await donorService.login(formData);
      setMessage(result.message);
      setIsError(!result.success);
      
      if (result.success) {
        localStorage.setItem('isLoggedIn', 'true');
        
        // Store actual donor data from backend in localStorage for profile page
        if (result.donorData) {
          localStorage.setItem('donorData', JSON.stringify(result.donorData));
        } else {
          // Fallback if backend doesn't return data yet
          const fallbackData = {
            id: null,
            email: formData.email,
            name: formData.email.split('@')[0], 
            bloodGroup: '', 
            city: '', 
            phoneNumber: '', 
            lastDonationDate: '',
            profilePhotoBase64: '',
            isAdmin: formData.email.toLowerCase() === 'admin@bloodbank.com'
          };
          localStorage.setItem('donorData', JSON.stringify(fallbackData));
        }
        
        onLoginSuccess();
      }
    } catch (error) {
      setMessage(error.message || 'Login failed');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Donor Login</h2>
        <p>Welcome back! Please login to your account.</p>
      </div>
      
      {message && (
        <div className={`message ${isError ? 'message-error' : 'message-success'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="form-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="link-button">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;