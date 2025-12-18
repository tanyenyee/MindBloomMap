import React, { useState } from 'react';

export default function PostPreviewModal({ post, onClose, onViewMore }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!  liked);
  };

  const handleReport = () => {
    console.log('Reporting post:', post.id, post.title);
    onClose();  // Close modal first
    window. location.href = '/emergency-report';  // Navigate to EmergencyReport page
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="post-preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="post-header">
          <div className="post-user">
            <div className="user-avatar">👤</div>
            <div>
              <div className="username">{post.username}</div>
              <div className="post-time">{post.timeAgo}</div>
            </div>
          </div>
        </div>

        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>

        <div className="post-actions">
          <button 
            className={`action-btn like-btn ${liked ? 'liked' :   ''}`}
            onClick={handleLike}
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            <span style={{ fontSize: '24px', marginRight: '6px' }}>
              {liked ? '❤️' :  '🤍'}
            </span>
            Like
          </button>
          
          <button 
            className="action-btn view-more-btn" 
            onClick={onViewMore}
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            <span style={{ fontSize: '24px', marginRight: '6px' }}>👁️</span>
            View More
          </button>
          
          <button 
            className="action-btn report-btn" 
            onClick={handleReport}
            style={{ fontSize:  '12px', padding: '8px 16px' }}
          >
            <span style={{ fontSize: '24px', marginRight:  '6px' }}>🚨</span>
            Report
          </button>
        </div>
      </div>
    </div>
  );
}


