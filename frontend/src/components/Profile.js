import React, { useState, useEffect, useRef } from 'react';
import { donorService } from '../services/api';
import { autoCorrectCity } from '../utils/cityData';

const Profile = () => {
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    city: '',
    phoneNumber: '',
    lastDonationDate: '',
    profilePhotoBase64: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [medicalCertificate, setMedicalCertificate] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('donorData') || '{}');
    setDonorData({
      name: userData.name || '',
      email: userData.email || '',
      bloodGroup: userData.bloodGroup || '',
      city: userData.city || '',
      phoneNumber: userData.phoneNumber || '',
      lastDonationDate: userData.lastDonationDate || '',
      profilePhotoBase64: userData.profilePhotoBase64 || ''
    });
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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setDonorData(prev => ({
          ...prev,
          profilePhotoBase64: reader.result
        }));
        setMessage('Profile photo selected!');
        setIsError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setShowCamera(true);
      // Allow react to render video element before assigning stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      setMessage('Could not access camera. Please check permissions.');
      setIsError(true);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Make canvas a square (like profile photos)
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      // Crop center of video
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      
      context.drawImage(video, startX, startY, size, size, 0, 0, size, size);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      setDonorData(prev => ({
        ...prev,
        profilePhotoBase64: imageDataUrl
      }));
      setMessage('Profile photo updated from camera!');
      setIsError(false);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
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
    setIsLoading(true);
    
    // Auto-correct the city spelling before saving
    const correctedData = {
      ...donorData,
      city: autoCorrectCity(donorData.city) || donorData.city
    };
    
    try {
      const result = await donorService.updateProfile(correctedData);
      
      if (result.success) {
        setMessage('Profile updated successfully!');
        setIsError(false);
        if (result.donorData) {
          localStorage.setItem('donorData', JSON.stringify(result.donorData));
          setDonorData(result.donorData);
        }
      } else {
        setMessage(result.message || 'Failed to update profile');
        setIsError(true);
      }
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
      setIsError(true);
    } finally {
      setIsLoading(false);
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
                {donorData.profilePhotoBase64 ? (
                  <img 
                    src={donorData.profilePhotoBase64} 
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
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
                <label className="upload-button" style={{ cursor: 'pointer', padding: '10px 15px', background: '#6c757d', color: 'white', borderRadius: '8px', display: 'inline-block' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  📁 Upload File
                </label>
                <button 
                  onClick={startCamera}
                  type="button"
                  style={{ cursor: 'pointer', padding: '10px 15px', background: '#28a745', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600' }}
                >
                  📸 Use Camera
                </button>
              </div>

              {showCamera && (
                <div style={{ marginTop: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '15px', border: '2px solid #e9ecef' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    style={{ width: '100%', maxWidth: '250px', borderRadius: '50%', background: '#000', aspectRatio: '1', objectFit: 'cover' }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
                    <button 
                      type="button" 
                      onClick={takePhoto}
                      style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Capture Photo
                    </button>
                    <button 
                      type="button" 
                      onClick={stopCamera}
                      style={{ padding: '8px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
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