import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationButtons from '../components/NavigationButtons'; // Now lives inside the page
import '../styles/PageContainer.css';
import '../pages/ProfilePage.css'; 

// Placeholder icons (Keep your existing imports)
import penIcon from '../assets/images/pen.png';
import emergencyIcon from '../assets/images/emergency.png';
import logoutIcon from '../assets/images/logout.png';
import bgImg from '../assets/images/profile_background.png';
import profilePic from '../assets/images/profilepic.png';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- Main User State ---
  const [user, setUser] = useState({
    name: "Chia Jing Yuen",
    phone: "012-345 6789",
    email: "chiajy@gmail.com",
    avatar: profilePic
  });

  // --- Modal States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempAvatar, setTempAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); 

  // --- Handlers ---

  // 1. Open Edit Window
  const openEditModal = () => {
    setTempName(user.name);
    setTempAvatar(user.avatar);
    setSelectedFile(null); 
    setIsEditModalOpen(true);
  };

  // 2. Handle File Selection (Updates Preview Immediately)
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Create a temporary URL for the preview
      const imageUrl = URL.createObjectURL(file);
      setTempAvatar(imageUrl);
      setSelectedFile(file); 
    }
  };

  // 3. Save Final Changes (The "Done" Action)
  const handleDone = () => {
    setUser({ ...user, name: tempName, avatar: tempAvatar });
    setIsEditModalOpen(false);
    
    // TODO: Upload 'selectedFile' to Firebase Storage here if it exists
    // TODO: Update Name in Firebase Database here
  };

  return (
    <div className="page-container profile-page">
      {/* Navigation is now safely INSIDE the container */}
      <NavigationButtons />
      
      {<img src={bgImg} alt="Profile Background" className="profile-bg" /> }

      <div className="page-content">
        <div className="profile-wrapper">
          
          {/* --- Main Profile Display --- */}
          <div className="avatar-section">
            <div className="avatar-container">
              <img src={user.avatar} alt="Profile" className="profile-pic" />
            </div>
          </div>

          <div className="name-section">
            <div className="name-display">
              <h2>{user.name}</h2>
              <button className="edit-icon-btn" onClick={openEditModal}>
                 <img src={penIcon} alt="Edit" className="edit-icon" />
              </button>
            </div>
          </div>

          <div className="info-section">
            <div className="info-row">
              <span className="label">Phone</span>
              <span className="value">{user.phone}</span>
            </div>
            <div className="info-row">
              <span className="label">Email</span>
              <span className="value">{user.email}</span>
            </div>
          </div>

          <hr className="divider" />

          <div className="action-button emergency-btn" onClick={() => navigate('/emergency-report')}>
            <div className="icon-wrapper">
                <img src={emergencyIcon} alt="Emergency" className="emergency-icon" /></div>
            <div className="text-wrapper"><h3>Emergency & Safety Centre</h3></div>
          </div>

          <hr className="divider" />

          <div className="action-button logout-btn" onClick={() => navigate('/login')}>
            <div className="icon-wrapper">
                <img src={logoutIcon} alt="Logout" className="logout-icon" />
            </div>
            <div className="text-wrapper"><h3>Logout</h3></div>
          </div>

        </div>
      </div>

      {/* --- EDIT PROFILE POP-UP WINDOW --- */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              
              {/* Avatar Preview Section */}
              <div className="avatar-edit-wrapper">
                <div className="preview-container">
                    <img src={tempAvatar} alt="Preview" className="profile-pic-preview" />
                </div>
                <button className="change-photo-btn" onClick={handleImageClick}>Change Photo</button>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                />
              </div>

              {/* Name Edit Section */}
              <div className="input-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="modal-input"
                />
              </div>
            </div>

            {/* DONE BUTTON */}
            <div className="modal-footer">
              <button className="save-btn full-width" onClick={handleDone}>Done</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;