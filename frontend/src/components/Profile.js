import React, { useState, useEffect } from 'react';
import { donorService } from '../services/api';

const Profile = () => {
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    city: '',
    phoneNumber: '',
    lastDonationDate: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [medicalCertificate, setMedicalCertificate] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // In a real app, you would fetch donor data from API
    const userData = JSON.parse(localStorage.getItem('donorData') || '{}');
    setDonorData(userData);
  }, []);

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('Profile photo must be less than 5MB');
        setIsError(true);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setMessage('Please upload an image file');
        setIsError(true);
        return;
      }
      setProfilePhoto(file);
      setMessage('Profile photo selected successfully!');
      setIsError(false);
    }
  };

  const handleMedicalCertificateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setMessage('Medical certificate must be less than 10MB');
        setIsError(true);
        return;
      }
      if (file.type !== 'application/pdf') {
        setMessage('Please upload a PDF file');
        setIsError(true);
        return;
      }
      setMedicalCertificate(file);
      setMessage('Medical certificate selected successfully!');
      setIsError(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, you would send this to your backend
      const formData = new FormData();
      formData.append('profilePhoto', profilePhoto);
      formData.append('medicalCertificate', medicalCertificate);
      
      // Simulate API call
      setTimeout(() => {
        setMessage('Profile updated successfully!');
        setIsError(false);
        localStorage.setItem('donorData', JSON.stringify(donorData));
      }, 1000);
      
    } catch (error) {
      setMessage('Failed to update profile');
      setIsError(true);
    }
  };

  const handleInputChange = (e) => {
    setDonorData({
      ...donorData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Donor Profile</h2>
        <p>Manage your personal information and medical documents</p>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Personal Info
        </button>
        <button 
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </div>

      {message && (
        <div className={`message ${isError ? 'message-error' : 'message-success'}`}>
          {message}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="profile-content">
          <div className="profile-photo-section">
            <div className="photo-upload">
              <div className="photo-preview">
                {profilePhoto ? (
                  <img 
                    src={URL.createObjectURL(profilePhoto)} 
                    alt="Profile" 
                    className="profile-image"
                  />
                ) : (
                  <div className="photo-placeholder">
                    <i className="photo-icon">📷</i>
                    <span>No Photo</span>
                  </div>
                )}
              </div>
              <label className="upload-button">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  style={{ display: 'none' }}
                />
                Upload Profile Photo
              </label>
            </div>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={donorData.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={donorData.email}
                onChange={handleInputChange}
                className="form-input"
                disabled
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Blood Group</label>
                <select
                  name="bloodGroup"
                  value={donorData.bloodGroup}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label>Last Donation Date</label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={donorData.lastDonationDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={donorData.city}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={donorData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <button 
              className="save-button"
              onClick={handleSaveProfile}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="documents-content">
          <div className="document-upload-section">
            <h3>Medical Certificate</h3>
            <p>Upload your medical fitness certificate (PDF only, max 10MB)</p>
            
            <div className="document-upload">
              {medicalCertificate ? (
                <div className="document-preview">
                  <i className="document-icon">📄</i>
                  <span>{medicalCertificate.name}</span>
                  <button 
                    className="remove-button"
                    onClick={() => setMedicalCertificate(null)}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="upload-area">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleMedicalCertificateUpload}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-placeholder">
                    <i className="upload-icon">📤</i>
                    <p>Click to upload medical certificate</p>
                    <span>PDF files only (max 10MB)</span>
                  </div>
                </label>
              )}
            </div>

            <div className="document-notes">
              <h4>Why upload a medical certificate?</h4>
              <ul>
                <li>Verifies your fitness for blood donation</li>
                <li>Increases trust among recipients</li>
                <li>Required for certain types of donations</li>
                <li>Valid for 6 months from issue date</li>
              </ul>
            </div>

            <button 
              className="save-button"
              onClick={handleSaveProfile}
            >
              Save Documents
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;