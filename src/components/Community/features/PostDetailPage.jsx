import React, { useState } from 'react';
import { dummyPosts } from '../data/dummyPosts';
import CommentSection from './CommentSection';
import postDetailBg from '../assets/images/postdetails-bg.png';

export default function PostDetailPage({ postId, onBack, onGoToReport }) {
  const [post, setPost] = useState(dummyPosts.find(p => p.id === postId));
  const [liked, setLiked] = useState(false);

  if (!post) {
    return (
      <div style={{ padding: '20px', textAlign:  'center' }}>
        <h2>Post not found</h2>
        <button onClick={onBack}>← Back to Community</button>
      </div>
    );
  }

  const handleReport = () => {
    console.log('Report post:', post.id, post.title);
    window.location.href = '/emergency-report';
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = post.comments.filter(c => c.id !== commentId);
    setPost({ ...post, comments: updatedComments });
    console.log('Comment deleted:', commentId);
  };

  return (
    <div 
      style={{
        backgroundImage: `url(${postDetailBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat:  'no-repeat',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        boxSizing:  'border-box',
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

      {/* White Container - FIXED SIZE */}
      <div 
        style={{
          maxWidth:  '340px',
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
        {/* Post content */}
        <div style={{ flexShrink: 0, marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems:  'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{ fontSize: '32px' }}>👤</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#333', fontFamily: "'Lato', sans-serif" }}>
                {post.username}
              </div>
              <div style={{ fontSize: '12px', color: '#999', fontFamily: "'Lato', sans-serif" }}>
                {post.timeAgo}
              </div>
            </div>
          </div>

          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#2C5F77', 
            marginBottom: '12px',
            fontFamily: "'Old Standard TT', serif",
          }}>
            {post.title}
          </h2>
          
          <p style={{ 
            fontSize: '14px', 
            lineHeight: '1.5', 
            color: '#555', 
            marginBottom: '15px',
            fontFamily: "'Lato', sans-serif",
          }}>
            {post.content}
          </p>

          <div style={{ 
            display:  'flex', 
            gap: '15px', 
            paddingBottom: '15px',
            borderBottom: '2px solid #f0f0f0',
          }}>
            <button 
              onClick={() => setLiked(!liked)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: liked ? '#FF6B6B' : '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {liked ? '❤️' : '🤍'} Like
            </button>
            
            <button 
              onClick={handleReport}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight:  '600',
                color: '#666',
                padding: '8px 12px',
                borderRadius: '8px',
                fontFamily: "'Lato', sans-serif",
              }}
            >
              🚨 Report
            </button>
          </div>
        </div>

        {/* Comments Section - Takes remaining space */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection:  'column', minHeight: 0 }}>
          <CommentSection 
            postId={post.id} 
            comments={post.comments}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
}