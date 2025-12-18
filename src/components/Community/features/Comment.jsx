import React, { useState } from 'react';
import PostPreviewModal from './PostPreviewModal';
import { postsData } from '../data/dummyPosts';

export default function CommunityMap({ onViewMore, onGoToWritePost }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts] = useState(postsData);

  const handleIslandClick = (post) => {
    console.log('Island clicked:', post.title); // DEBUG
    setSelectedPost(post);
  };

  const handleClosePreview = () => {
    console.log('Closing preview'); // DEBUG
    setSelectedPost(null);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const islandPositions = [
    { top: '8%', left: '10%' },
    { top: '12%', left: '68%' },
    { top:  '22%', left: '42%' },
    { top:  '32%', left: '15%' },
    { top:  '35%', left: '70%' },
    { top:  '48%', left: '40%' },
    { top:  '60%', left: '72%' },
  ];

  return (
    <div className="ocean-map-mobile-temp">
      <div className="ocean-background-temp"></div>

      <div className="islands-layer">
        {posts && posts.slice(0, 7).map((post, index) => (
          <button
            key={post.id}
            className="island-button-temp"
            style={{
              top: islandPositions[index].top,
              left: islandPositions[index].left,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleIslandClick(post);
            }}
            type="button"
            aria-label={`View post:  ${post.title}`}
          >
            🏝️
          </button>
        ))}
      </div>

      <div className="ocean-controls-mobile">
        <button 
          className="ocean-btn-temp write-btn"
          onClick={onGoToWritePost}
          type="button"
        >
          ✍️
        </button>
        
        <button 
          className="ocean-btn-temp refresh-btn"
          onClick={handleRefresh}
          type="button"
        >
          🔄
        </button>
      </div>

      {selectedPost && (
        <PostPreviewModal
          post={selectedPost}
          onClose={handleClosePreview}
          onViewMore={() => {
            onViewMore(selectedPost.id);
            handleClosePreview();
          }}
        />
      )}
    </div>
  );
}

