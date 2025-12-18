import React, { useState } from 'react';
import CommunityMap from './features/CommunityMap';
import PostDetailPage from './features/PostDetailPage';
import WritePostPage from './features/WritePostPage';
import './styles/Community.css';

function Community() {
  const [currentScreen, setCurrentScreen] = useState('map'); // 'map', 'post-detail', 'write-post'
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Handle viewing post detail
  const handleViewMore = (postId) => {
    setSelectedPostId(postId);
    setCurrentScreen('post-detail');
  };

  // Handle going back to community map
  const handleBackToCommunity = () => {
    setCurrentScreen('map');
    setSelectedPostId(null);
  };

  // Handle going to write post page
  const handleGoToWritePost = () => {
    setCurrentScreen('write-post');
  };

  // Handle after post is created
  const handlePostCreated = () => {
    setCurrentScreen('map');
  };

  // Handle report (temporary - Shuxian will handle)
  const handleGoToReport = (data) => {
    alert(`Report ${data.type}: "${data.content || data.title}"\n\nThis will navigate to Shuxian's report page.`);
  };

  // Handle navigation (your team leader will handle these)
  const handleBackToMain = () => {
    alert('Navigate to Main Page - Your team leader handles this');
  };

  const handleGoToProfile = () => {
    alert('Navigate to Profile Page - Your team leader handles this');
  };

  return (
    <div className="Community">
      {/* Show Community Map (Ocean with Islands) */}
      {currentScreen === 'map' && (
        <CommunityMap 
          onViewMore={handleViewMore}
          onGoToWritePost={handleGoToWritePost}
          onBackToMain={handleBackToMain}
          onGoToProfile={handleGoToProfile}
        />
      )}

      {/* Show Post Detail Page */}
      {currentScreen === 'post-detail' && (
        <PostDetailPage 
          postId={selectedPostId}
          onBack={handleBackToCommunity}
          onGoToReport={handleGoToReport}
        />
      )}

      {/* Show Write Post Page */}
      {currentScreen === 'write-post' && (
        <WritePostPage 
          onBack={handleBackToCommunity}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}

export default Community;
