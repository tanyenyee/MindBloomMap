import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoCloudUploadOutline, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import './EmergencyReport.css';

import backgroundImageFile from '../../assets/images/EmergencyBackground.png'; 

const EmergencyReport = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State for Anonymous Mode
  const [isAnonymous, setIsAnonymous] = useState(true);
  
  // State for Popups (Toast notifications)
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  
  // State for Report Text
  const [reportText, setReportText] = useState("");
  
  // State for uploaded image
  const [selectedImage, setSelectedImage] = useState(null);
  
  // State for the "Add Hotline" Modal
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // Initial Hotline List
  const [hotlines, setHotlines] = useState([
    { name: 'Befrienders KL', number: '03-7956 8145' },
    { name: 'Talian Kasih', number: '15999' }
  ]);

  // Back button handler
  const handleBackClick = () => {
    navigate(-1);
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file.name);
      setPopupMessage("Image uploaded: " + file.name);
      setShowPopup(true);
    }
  };

  // Toggle Anonymous Mode
  const handleToggle = () => {
    const newStatus = !isAnonymous;
    setIsAnonymous(newStatus);
    setPopupMessage(newStatus ? "Anonymous mode on" : "Anonymous mode off");
    setShowPopup(true);
  };

  // Submit Report
  const handleSubmit = () => {
    if (reportText.trim() === "") {
      setPopupMessage("Please enter a description");
    } else {
      setPopupMessage("Submit successfully");
      setReportText(""); 
    }
    setShowPopup(true);
  };

  // Add New Hotline Logic
  const handleAddHotline = (e) => {
    e.preventDefault();
    if (newName.trim() && newNumber.trim()) {
      // Add new hotline to the array
      setHotlines([...hotlines, { name: newName, number: newNumber }]);
      // Reset fields and close modal
      setNewName("");
      setNewNumber("");
      setShowAddForm(false);
      setPopupMessage("Hotline added successfully");
      setShowPopup(true);
    } else {
      alert("Please fill in both fields");
    }
  };

  // Auto-hide popups
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <>
      <div className="main-page-container page-container" style={{backgroundImage: `url(${backgroundImageFile})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        {/* Feedback Popup (Toast) */}
        {showPopup && <div style={styles.popup}>{popupMessage}</div>}

        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
          <IoChevronBackOutline style={styles.backIcon} onClick={handleBackClick} />
          <div style={styles.titleContainer}>
            <h2 style={styles.headerTitle}>Emergency & Safety Centre</h2>
          </div>
        </div>

        {/* --- QUICK REPORT SECTION --- */}
        <div style={{...styles.card, backgroundColor: 'rgba(179, 229, 252, 0.92)', border: '2px solid #b2ebf2'}}>
          <div style={styles.cardHeader}>
            <h3 style={{...styles.cardTitle, color: '#0277bd'}}>Quick Report</h3>
            <div style={styles.toggleContainer} onClick={handleToggle}>
              <div style={{...styles.toggleTrack, backgroundColor: isAnonymous ? '#9e9e9e' : '#e0e0e0'}}>
                <div style={{...styles.toggleThumb, right: isAnonymous ? '2px' : '20px', backgroundColor: 'white'}}></div>
              </div>
            </div>
          </div>
          
          <select style={styles.dropdown}>
            <option>Bullying</option>
            <option>Harassment</option>
            <option>Cyberbullying</option>
            <option>Physical Abuse</option>
            <option>Other</option>
          </select>

          <div style={styles.textAreaContainer}>
            <textarea 
              style={styles.textArea} 
              placeholder="Describe here..." 
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
            <div style={styles.textFooter}>
              <div style={styles.uploadIcon} onClick={() => fileInputRef.current?.click()}>
                <IoCloudUploadOutline size={18} /> 
                <span style={{fontSize: '10px', marginLeft: '4px', fontFamily: customFont}}>
                  {selectedImage || 'Upload Image'}
                </span>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  style={{display: 'none'}} 
                  onChange={handleImageUpload}
                />
              </div>
              <button style={styles.submitBtn} onClick={handleSubmit}>Submit</button>
            </div>
          </div>
          <p style={styles.reminder}>* Reminder: Anonymous mode is {isAnonymous ? "on" : "off"}.</p>
        </div>

        {/* --- SAFETY LIBRARY SECTION --- */}
        <div style={{...styles.card, backgroundColor: 'rgba(232, 245, 233, 0.92)', border: '2px solid #c8e6c9'}}>
          <h3 style={{...styles.cardTitle, color: '#689f38', marginBottom: '12px'}}>Safety Library</h3>
          <div style={styles.scrollWrapper}>
            
            <div style={{...styles.libraryCard, borderTop: '6px solid #bbdefb'}}>
              <h4 style={styles.libTitleMax}>Stay Safe Online</h4>
              <div style={styles.dividerLong}></div>
              <div style={styles.scrollContent}>
                <p style={styles.libTextLarge}>Be cautious with personal information at all times, especially in the digital world. Avoid sharing sensitive details such as your full name, home address, phone number, passwords, identification numbers, or financial information...</p>
              </div>
            </div>

            <div style={{...styles.libraryCard, borderTop: '6px solid #ffe0b2'}}>
              <h4 style={styles.libTitleMax}>Report Bullying</h4>
              <div style={styles.dividerLong}></div>
              <div style={styles.scrollContent}>
                <p style={styles.libTextLarge}>There are many ways to report a bully, and it is important to choose the method that makes you feel safest and most supported. Bullying can be reported to specific organizations such as school authorities...</p>
              </div>
            </div>

            <div style={{...styles.libraryCard, borderTop: '6px solid #f8bbd0'}}>
              <h4 style={styles.libTitleMax}>Support Friend</h4>
              <div style={styles.dividerLong}></div>
              <div style={styles.scrollContent}>
                <p style={styles.libTextLarge}>As a bystander, you should not ignore a bullying situation when you notice it happening around you. If it is safe to do so, step in calmly to stop the behavior or distract the bully without conflict...</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- HOTLINES SECTION --- */}
        <div style={{...styles.card, backgroundColor: 'rgba(255, 241, 241, 0.92)', border: '2px solid #ffcdd2'}}>
          <h3 style={{...styles.cardTitle, color: '#d32f2f', marginBottom: '12px'}}>Hotlines</h3>
          <div style={styles.hotlineGrid}>
            {hotlines.map((item, index) => (
              <div key={index} style={styles.hotlineRow}>
                <div style={styles.hotlineBox}>
                  <strong style={{color: '#333'}}>{item.name}</strong> 
                  <span style={styles.hotlineNumber}>{item.number}</span>
                </div>
              </div>
            ))}
            
            {/* The "Add More" Button */}
            <div style={styles.hotlineRow} onClick={() => setShowAddForm(true)}>
               <div style={{...styles.hotlineBox, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.6)'}}>
                 <span style={{fontFamily: customFont, fontWeight: 'bold', color: '#666'}}>Add more</span>
                 <IoAddOutline size={20} color="#666" />
               </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* --- ADD MORE HOTLINE MODAL (Outside main page container, fixed to viewport) --- */}
      {showAddForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{margin: 0, fontSize: '18px', fontFamily: customFont, color: '#333'}}>Add New Hotline</h3>
              <IoCloseOutline size={24} onClick={() => setShowAddForm(false)} style={{cursor: 'pointer', color: '#333'}} />
            </div>
            <input 
              type="text" 
              style={styles.modalInput} 
              placeholder="Agency Name" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              autoFocus 
            />
            <input 
              type="text" 
              style={styles.modalInput} 
              placeholder="Phone Number" 
              value={newNumber} 
              onChange={(e) => setNewNumber(e.target.value)} 
            />
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              <button style={{...styles.modalBtn, backgroundColor: '#eee', color: '#444'}} onClick={() => setShowAddForm(false)}>Cancel</button>
              <button style={styles.modalBtn} onClick={handleAddHotline}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const customFont = "'Comic Sans MS', 'Chalkboard SE', sans-serif";

const styles = {
  container: { width: '100%', maxWidth: '320px', paddingRight: '20px', marginRight: 'auto', marginLeft: 'auto', overflowY: 'auto', maxHeight: 'calc(780px - 40px)', boxSizing: 'border-box', paddingBottom: '20px' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '25px' },
  backIcon: { fontSize: '24px', color: '#4e342e', cursor: 'pointer' },
  titleContainer: { marginLeft: '10px' },
  headerTitle: { fontSize: '18px', color: '#4e342e', margin: 0, fontWeight: '600', fontFamily: customFont },
  card: { borderRadius: '20px', padding: '18px', marginBottom: '25px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cardTitle: { fontSize: '18px', margin: 0, fontWeight: 'bold', fontFamily: customFont },
  dropdown: { width: '160px', padding: '6px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '12px', fontSize: '13px', fontFamily: customFont, backgroundColor: 'white' },
  textAreaContainer: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '15px', padding: '12px' },
  textArea: { width: '100%', border: 'none', height: '140px', outline: 'none', fontSize: '13px', resize: 'none', background: 'transparent', fontFamily: customFont, lineHeight: '1.5' },
  textFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ddd', paddingTop: '8px' },
  submitBtn: { backgroundColor: '#b2ebf2', border: 'none', padding: '6px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', fontFamily: customFont },
  
  libraryCard: { minWidth: '150px', height: '190px', backgroundColor: 'white', padding: '12px', borderRadius: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflow: 'hidden' },
  libTitleMax: { fontSize: '22px', margin: '4px 0 8px 0', textAlign: 'center', fontWeight: '900', color: '#000', fontFamily: customFont, lineHeight: '1' },
  libTextLarge: { fontSize: '14px', color: '#555', margin: 0, lineHeight: '1.4', fontFamily: customFont, fontWeight: '600' },
  dividerLong: { width: '85%', height: '2px', backgroundColor: '#eee', margin: '4px auto 10px auto', borderRadius: '2px' },
  
  hotlineGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  hotlineRow: {},
  hotlineBox: { flex: 1, backgroundColor: 'white', padding: '12px', borderRadius: '12px', fontSize: '13px', border: '1px solid rgba(0,0,0,0.05)', fontFamily: customFont, display: 'flex', justifyContent: 'space-between' },
  hotlineNumber: { color: '#d32f2f', fontWeight: '900', marginLeft: '10px', fontFamily: customFont },
  
  // MODAL STYLES
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
  modalContent: { backgroundColor: 'white', padding: '25px', borderRadius: '25px', width: '80%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: customFont },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  modalInput: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', fontFamily: customFont },
  modalBtn: { flex: 1, border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#b2ebf2', fontFamily: customFont, color: '#007b8b' },

  popup: { position: 'fixed', top: '40px', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: 'white', padding: '10px 20px', borderRadius: '30px', fontSize: '13px', zIndex: 10000, fontWeight: 'bold', fontFamily: customFont },
  reminder: { fontSize: '10px', color: '#444', marginTop: '8px', fontFamily: customFont, fontWeight: 'bold' },
  scrollWrapper: { display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '10px' },
  scrollContent: { overflowY: 'auto', flex: 1, paddingRight: '4px', marginTop: '4px' },
  toggleContainer: { cursor: 'pointer' },
  toggleTrack: { width: '38px', height: '20px', borderRadius: '20px', position: 'relative', border: '1px solid #ccc', transition: '0.3s' },
  toggleThumb: { width: '16px', height: '16px', borderRadius: '50%', position: 'absolute', top: '1px', transition: '0.3s' },
  uploadIcon: { color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center' }
};

export default EmergencyReport;

