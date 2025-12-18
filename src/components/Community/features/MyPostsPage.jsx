import React, { useState } from 'react';
import { postsData } from '../data/dummyPosts';
import { useAuth } from '../../../context/AuthContext';
import Dialog from '../../UI/Dialog';
import postDetailBg from '../assets/images/postdetails-bg.png';

export default function MyPostsPage({ onBack, onViewPost, onDeletePost }) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Filter posts by current user
  const myPosts = postsData.filter(post => 
    post.userId === user?.uid || post.username === "CurrentUser"
  );

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      onDeletePost(postToDelete.id);
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPostToDelete(null);
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
          borderRadius: '20px',
          padding: '20px',
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
          fontSize: '22px',
          color: '#2C5F77',
          marginBottom: '20px',
          textAlign: 'center',
          fontFamily: "'Old Standard TT', serif",
          fontWeight: '700',
          flexShrink: 0,
        }}>
          📝 My Posts
        </h2>

        {/* Scrollable Posts List */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          paddingRight: '5px',
        }}>
          {myPosts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999',
              fontFamily: "'Lato', sans-serif",
            }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>📭</p>
              <p style={{ fontSize: '16px' }}>You haven't created any posts yet.</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Start sharing your thoughts with the community!
              </p>
            </div>
          ) : (
            myPosts.map((post) => (
              <div 
                key={post.id}
                style={{
                  background: '#f9f9f9',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '15px',
                  border: '2px solid #E0E0E0',
                }}
              >
                {/* Post Header */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginBottom: '10px' 
                }}>
                  <div style={{ fontSize: '24px' }}>👤</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: '700', 
                      fontSize: '13px', 
                      color: '#333',
                      fontFamily: "'Lato', sans-serif",
                    }}>
                      {post.username}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#999',
                      fontFamily: "'Lato', sans-serif",
                    }}>
                      {post.timeAgo}
                    </div>
                  </div>
                </div>

                {/* Post Title */}
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  color: '#2C5F77', 
                  marginBottom: '8px',
                  fontFamily: "'Old Standard TT', serif",
                }}>
                  {post.title}
                </h3>

                {/* Post Content Preview */}
                <p style={{ 
                  fontSize: '13px', 
                  lineHeight: '1.5', 
                  color: '#555', 
                  marginBottom: '12px',
                  fontFamily: "'Lato', sans-serif",
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {post.content}
                </p>

                {/* Post Stats */}
                <div style={{ 
                  display: 'flex', 
                  gap: '15px', 
                  fontSize: '12px', 
                  color: '#666',
                  marginBottom: '12px',
                  fontFamily: "'Lato', sans-serif",
                }}>
                  <span>💬 {post.comments?.length || 0} comments</span>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  paddingTop: '12px',
                  borderTop: '1px solid #E0E0E0',
                }}>
                  <button
                    onClick={() => onViewPost(post.id)}
                    style={{
                      flex: 1,
                      background: '#2C5F77',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: "'Lato', sans-serif",
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1e4356'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#2C5F77'}
                  >
                    👁️ View More
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post)}
                    style={{
                      background: '#FF6B6B',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: "'Lato', sans-serif",
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#ff4444'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B6B'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Post?"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
