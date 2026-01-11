import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import NavigationButtons from '../components/NavigationButtons';
import '../styles/PageContainer.css';
import '../pages/ProfilePage.css'; 

// Assets
import penIcon from '../assets/images/pen.png';
import emergencyIcon from '../assets/images/emergency.png';
import logoutIcon from '../assets/images/logout.png';
import bgImg from '../assets/images/profile_background.png';
import profilePic from '../assets/images/profilepic.png';

// Context & Service
import { useAuth } from '../context/AuthContext';
// FIX: Import updateUser
import { getUser, updateUser } from '../firebases/firebaseService'; 

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: profilePic
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempAvatar, setTempAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser || !currentUser.uid) {
           setIsLoading(false);
           return;
        }

        const dbUser = await getUser(currentUser.uid);

        if (dbUser) {
          setProfileData({
            name: dbUser.username || "",
            phone: dbUser.phone || "",
            email: dbUser.email || currentUser.email || "",
            avatar: dbUser.avatar || profilePic
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // --- Handlers ---

  const openEditModal = () => {
    setTempName(profileData.name);
    setTempAvatar(profileData.avatar);
    setSelectedFile(null); 
    setIsEditModalOpen(true);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setTempAvatar(imageUrl);
      setSelectedFile(file); 
    }
  };

  // --- FIX: HANDLE DONE (Update Username) ---
  const handleDone = async () => {
    if (!currentUser || !currentUser.uid) return;

    try {
      // 1. Update in Firebase
      await updateUser(currentUser.uid, {
        username: tempName,
        // TODO: Handle avatar upload to storage if selectedFile is present
        // avatar: newAvatarUrl 
      });

      // 2. Update Local State
      setProfileData(prev => ({
        ...prev,
        name: tempName,
        avatar: tempAvatar // For now, just update preview locally
      }));

      setIsEditModalOpen(false);
      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Logout failed: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container profile-page">
        <NavigationButtons />
        <div className="page-content" style={{ display:'flex', justifyContent:'center', paddingTop:'100px' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container profile-page">
      <NavigationButtons />
      <img src={bgImg} alt="Profile Background" className="profile-bg" />

      <div className="page-content">
        <div className="profile-wrapper">
          
          <div className="avatar-section">
            <div className="avatar-container">
              <img src={profileData.avatar} alt="Profile" className="profile-pic" />
            </div>
          </div>

          <div className="name-section">
            <div className="name-display">
              <h2>{profileData.name || "User Name"}</h2>
              <button className="edit-icon-btn" onClick={openEditModal}>
                 <img src={penIcon} alt="Edit" className="edit-icon" />
              </button>
            </div>
          </div>

          <div className="info-section">
            <div className="info-row">
              <span className="label">Phone</span>
              <span className="value">{profileData.phone || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="label">Email</span>
              <span className="value">{profileData.email || "Not provided"}</span>
            </div>
          </div>

          <hr className="divider" />

          <div className="action-button emergency-btn" onClick={() => navigate('/emergency-report')}>
            <div className="icon-wrapper">
                <img src={emergencyIcon} alt="Emergency" className="emergency-icon" /></div>
            <div className="text-wrapper"><h3>Emergency & Safety Centre</h3></div>
          </div>

          <hr className="divider" />

          <div className="action-button logout-btn" onClick={handleLogout}>
            <div className="icon-wrapper">
                <img src={logoutIcon} alt="Logout" className="logout-icon" />
            </div>
            <div className="text-wrapper"><h3>Logout</h3></div>
          </div>

        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="avatar-edit-wrapper">
                <div className="preview-container">
                    <img src={tempAvatar} alt="Preview" className="profile-pic-preview" />
                </div>
                <button className="change-photo-btn" onClick={handleImageClick}>Change Photo</button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                />
              </div>

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