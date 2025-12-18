import React from 'react';

function Island({ post, onClick }) {
  const style = {
    animationDelay: `${Math.random() * 2}s`
  };

  return (
    <div className="island" onClick={onClick} style={style}>
      <div className="island-emoji">🏝️</div>
      <div className="island-preview">
        <div className="island-username">{post.username}</div>
        <div className="island-title">{post.title}</div>
      </div>
    </div>
  );
}

export default Island; // ← CHECK THIS LINE! 