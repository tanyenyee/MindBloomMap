import React, { useState } from 'react';
import sendArrow from '../assets/icons/send-arrow.png';
import HarassmentWarningModal from './HarassmentWarningModal';
import { analyzeToxicity } from '../utils/toxicityAnalysis';

export default function CommentSection({ postId, comments, onDeleteComment }) {
  const [commentsList, setCommentsList] = useState(comments || []);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [toxicityResult, setToxicityResult] = useState(null);

  const handleAddComment = () => {
    if (!newComment. trim()) return;

    // ⚠️ ANALYZE TOXICITY BEFORE POSTING
    const analysis = analyzeToxicity(newComment);
    
    if (analysis. isToxic) {
      // Show warning modal - DON'T post comment
      setToxicityResult({
        score: analysis.score,
        severity: analysis.severity,
        flaggedWords: analysis.flaggedWords
      });
      setShowWarning(true);
      return;
    }

    // ✅ No toxicity detected - post comment normally
    const comment = {
      id: Date.now(),
      username: 'CurrentUser',
      text: newComment,
      timeAgo: 'Just now',
    };
    setCommentsList([...commentsList, comment]);
    setNewComment('');
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
    setToxicityResult(null);
    // Keep text in input so user can edit
  };

  const handleDeleteComment = (commentId) => {
    setCommentsList(commentsList. filter(c => c.id !== commentId));
    if (onDeleteComment) {
      onDeleteComment(commentId);
    }
  };

  const handleLikeComment = (commentId) => {
    setLikedComments({
      ...likedComments,
      [commentId]: !likedComments[commentId]
    });
  };

  const handleReportComment = (comment) => {
    console.log('Report comment:', comment. id, comment.text);
    window.location.href = '/emergency-report';
  };

  return (
    <div className="comment-section-wrapper">
      <h3 className="comments-title">
        Comments ({commentsList.length})
      </h3>

      {/* Scrollable comments list ONLY */}
      <div className="comments-list-scrollable">
        {commentsList && commentsList.length > 0 ? (
          commentsList.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-user">
                  <span className="comment-avatar">👤</span>
                  <div>
                    <div className="comment-username">
                      {comment.username || comment.author || 'Anonymous'}
                    </div>
                    <span className="comment-time">
                      {comment.timeAgo || 'Recently'}
                    </span>
                  </div>
                </div>
                
                {/* Delete button - show only for user's own comments */}
                {comment.username === 'CurrentUser' && (
                  <button
                    onClick={() => handleDeleteComment(comment. id)}
                    className="delete-comment-btn"
                    title="Delete comment"
                  >
                    🗑️
                  </button>
                )}
              </div>
              
              <p className="comment-text">{comment.text}</p>

              {/* Like and Report buttons for each comment */}
              <div className="comment-actions-detail">
                <button 
                  className={`action-btn like-btn ${likedComments[comment.id] ? 'liked' : ''}`}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  {likedComments[comment.id] ? '❤️' : '🤍'} Like
                </button>
                
                <button 
                  className="action-btn report-btn" 
                  onClick={() => handleReportComment(comment)}
                >
                  🚨 Report
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      {/* Fixed input at bottom - ALWAYS visible */}
      <div className="comment-input-wrapper">
        <div className="comment-input-container">
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newComment.trim()) {
                handleAddComment();
              }
            }}
            style={{ fontFamily: "'Lato', sans-serif" }}
          />
          <button
            className="send-comment-btn"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            title="Send comment"
          >
            <img 
              src={sendArrow} 
              alt="send" 
              className="send-arrow-icon"
            />
          </button>
        </div>
      </div>

      {/* 🚨 HARASSMENT WARNING MODAL */}
      {showWarning && toxicityResult && (
        <HarassmentWarningModal
          analysis={toxicityResult}
          onClose={handleCloseWarning}
          type="comment"
        />
      )}
    </div>
  );
}