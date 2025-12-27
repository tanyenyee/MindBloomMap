import React, { useState } from 'react';
import { analyzeToxicity } from '../utils/toxicityAnalysis';
import HarassmentWarningModal from './HarassmentWarningModal';
import { addNewPost } from '../data/dummyPosts';
import postDetailBg from '../assets/images/postdetails-bg.png';

export default function WritePostPage({ onBack, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [toxicityResult, setToxicityResult] = useState(null);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    // Check for harassment
    const fullText = `${title} ${content}`;
    const analysis = analyzeToxicity(fullText);

    if (analysis.isToxic) {
      setToxicityResult(analysis);
      setShowWarning(true);
      return;
    }

    // Create post
    addNewPost({
      username: "CurrentUser",
      title: title.trim(),
      content: content.trim()
    });

    alert('Post created successfully! 🌸');
    
    // Navigate back to community
    onPostCreated();
  };

return (
  <div 
    style={{
      backgroundImage: `url(${postDetailBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: '15px',
      boxSizing: 'border-box',
    }}
  >
    {/* Back Button */}
    <button 
      className="back-btn-detail" 
      onClick={onBack}
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        background: 'white',
        border: '2px solid #2C5F77',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        color: '#2C5F77',
        cursor: 'pointer',
        fontWeight: '600',
        zIndex: 10,
        fontFamily: "'Lato', sans-serif",
      }}
    >
      ← Back to Community
    </button>

    {/* White Container */}
    <div 
      style={{
        maxWidth: '340px',
        width: '100%',
        height: 'calc(100% - 60px)',
        maxHeight: '720px',
        background: 'white',
        borderRadius:  '20px',
        padding:  '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        margin: '50px auto 10px auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Title */}
      <h2 style={{
        fontSize:  '22px',
        color:  '#2C5F77',
        marginBottom: '20px',
        textAlign: 'center',
        fontFamily: "'Old Standard TT', serif",
        fontWeight: '700',
        flexShrink: 0,
      }}>
        ✍️ Write Post
      </h2>

      {/* Scrollable Content Area */}
      <div style={{ 
        flex: 1, 
        overflowY:  'auto', 
        overflowX: 'hidden',
        paddingRight: '5px',
        marginBottom: '15px',
      }}>
        {/* Title Input */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <label 
            htmlFor="post-title"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#555',
              marginBottom: '8px',
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Title
          </label>
          <input
            id="post-title"
            type="text"
            placeholder="Share your thoughts..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid #E0E0E0',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: "'Lato', sans-serif",
              boxSizing: 'border-box',
            }}
            onFocus={(e) => e.target.style.borderColor = '#AAE3E2'}
            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
          />
          <span style={{
            position: 'absolute',
            bottom: '-18px',
            right: '0',
            fontSize:  '11px',
            color:  '#999',
            fontFamily:  "'Lato', sans-serif",
          }}>
            {title.length}/100
          </span>
        </div>

        {/* Content Textarea */}
        <div style={{ marginBottom: '25px', position: 'relative' }}>
          <label 
            htmlFor="post-content"
            style={{
              display:  'block',
              fontSize:  '14px',
              fontWeight: '600',
              color:  '#555',
              marginBottom:  '8px',
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Post Content
          </label>
          <textarea
            id="post-content"
            placeholder="What's on your mind?  Share your feelings, experiences, or thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            rows={10}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid #E0E0E0',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: "'Lato', sans-serif",
              resize: 'none',
              boxSizing: 'border-box',
              lineHeight: '1.5',
            }}
            onFocus={(e) => e.target.style.borderColor = '#AAE3E2'}
            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
          />
          <span style={{
            position: 'absolute',
            bottom: '-18px',
            right: '0',
            fontSize: '11px',
            color: '#999',
            fontFamily: "'Lato', sans-serif",
          }}>
            {content.length}/500
          </span>
        </div>
      </div>

      {/* Fixed Submit Button at Bottom */}
      <div style={{
        flexShrink: 0,
        paddingTop: '15px',
        borderTop: '2px solid #f0f0f0',
      }}>
        <button 
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim()}
          style={{
            width: '100%',
            padding: '14px',
            background: (!title.trim() || !content.trim()) ? '#ccc' : '#AAE3E2',
            color: '#2C5F77',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: (!title.trim() || !content.trim()) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            fontFamily: "'Old Standard TT', serif",
            opacity: (!title.trim() || !content.trim()) ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (title.trim() && content.trim()) {
              e.target.style.background = '#8FD3D2';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(170, 227, 226, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (title.trim() && content.trim()) {
              e.target.style.background = '#AAE3E2';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          Submit Post
        </button>
      </div>
    </div>

    {/* Harassment Warning Modal */}
    {showWarning && toxicityResult && (
      <HarassmentWarningModal
        analysis={toxicityResult}
        type="post"
        onClose={() => setShowWarning(false)}
      />
    )}
  </div>
);
}