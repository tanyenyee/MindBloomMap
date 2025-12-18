import React, { useState } from 'react';
import PostPreviewModal from './PostPreviewModal';
import { postsData } from '../data/dummyPosts';

// Import your images
import oceanBg from '../assets/images/ocean-background.png';
import islandPost from '../assets/images/island-post.png';
import btnRefresh from '../assets/images/btn-refresh.png';
import btnWrite from '../assets/images/btn-write.png';

// Import Navigation Component
import NavigationButtons from './NavigationButtons';

export default function CommunityMap({ onViewMore, onGoToWritePost }) {
  const [selectedPost, setSelectedPost] = useState(null);
  // Shuffle function to randomize posts
const shuffleArray = (array) => {
  const shuffled = [... array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Shuffle posts on component mount (every refresh)
const [posts] = useState(() => shuffleArray(postsData));
  console.log('Total posts:', posts.length); 

  const handleIslandClick = (post) => {
    console.log('Island clicked:', post. title);
    setSelectedPost(post);
  };

  const handleClosePreview = () => {
    setSelectedPost(null);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

const islandPositions = [
  { top: '5%', left: '15%' },     // Island 1 - Top-left
  { top: '8%', left: '65%' },     // Island 2 - Top-right
  { top: '20%', left: '40%' },    // Island 3 - Upper-center
  { top: '28%', left: '8%' },    // Island 4 - Middle-left
  { top: '35%', left: '55%' },    // Island 5 - Middle-right
  { top: '53%', left: '68%' },    // Island 6 - Lower-center
  { top: '68%', left: '53%' },    // Island 7 - Bottom-right
];

  return (
    <div className="ocean-map-mobile-temp">
      {/* Navigation buttons (bottom-right) */}
      <NavigationButtons />

      {/* Background image */}
      <img 
        src={oceanBg} 
        alt="ocean background" 
        className="ocean-background-img"
        style={{ pointerEvents: 'none' }}
      />

      {/* Clickable islands */}
      <div className="islands-layer">
{posts && posts.slice(0, 7).map((post, index) => {
  console.log(`Island ${index + 1}: `, islandPositions[index]);  // ← ADD THIS
  return (
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
      aria-label={`View post: ${post.title}`}
    >
<img 
  src={islandPost} 
  alt={`island ${index + 1}`}
  className="island-img-temp"
  style={{ 
    pointerEvents: 'none',
    width: '120px',      /* ← ADD YOUR SIZE HERE */
    height: '120px',     /* ← ADD YOUR SIZE HERE */
  }}
/>
    </button>
  );
})}
      </div>


{/* Bottom left buttons - PERFECTLY ALIGNED */}
<div style={{
  position: 'absolute',
  bottom: '-10px',
  left: '-5px',
  display: 'inline-flex',
  flexDirection:  'row',
  alignItems: 'center',     // ← THIS FIXES ALIGNMENT! 
  gap: '0',
  margin: 0,
  padding: 0,
  lineHeight: 0,
  fontSize: 0,
  zIndex: 100,
}}>
  {/* Refresh Button - LEFT SIDE */}
  <button 
    onClick={handleRefresh}
    type="button"
    title="Refresh"
    style={{
      width: '120px',
      height: '120px',
      marginRight: '-40px',     // ← Only ONE marginRight
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      display: 'inline-block',
      lineHeight: 0,
      fontSize: 0,
      verticalAlign: 'middle',  // ← Changed from 'top' to 'middle'
      outline: 'none',
      zIndex: 1,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.zIndex = '10';
    }}
    onMouseLeave={(e) => {
      e.currentTarget. style.transform = 'scale(1)';
      e.currentTarget.style.zIndex = '1';
    }}
  >
    <img 
      src={btnRefresh} 
      alt="refresh" 
      draggable="false"
      style={{ 
        width: '100%', 
        height: '100%', 
        display:  'block',
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none',
        margin: 0,
        padding: 0,
        border: 'none',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
      }}
    />
  </button><button 
    onClick={onGoToWritePost}
    type="button"
    title="Write Post"
    style={{
      width: '135px',
      height: '135px',
      background: 'transparent',
      border: 'none',
      padding: 0,
      margin: 0,
      cursor:  'pointer',
      transition:  'transform 0.2s ease',
      display: 'inline-block',
      lineHeight: 0,
      fontSize:  0,
      verticalAlign: 'middle',  // ← Changed from 'top' to 'middle'
      outline: 'none',
      zIndex: 0,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.zIndex = '10';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style. zIndex = '0';
    }}
  >
    <img 
      src={btnWrite} 
      alt="write post" 
      draggable="false"
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'block',
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none',
        margin: 0,
        padding: 0,
        border: 'none',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
      }}
    />
  </button>
</div>

      {/* Post preview modal */}
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