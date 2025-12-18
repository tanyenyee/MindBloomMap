import React, { useState } from 'react';
import CommunityMap from './components/CommunityMap';
import PostDetailPage from './components/PostDetailPage';
import WritePostPage from './components/WritePostPage';
import './styles/Community.css';

function App() {
  // State to track which screen to show
  const [currentScreen, setCurrentScreen] = useState('community'); // 'community', 'post-detail', 'write-post', 'report'
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [reportData, setReportData] = useState(null);

  // Navigation handlers
  const handleViewMore = (postId) => {
    setSelectedPostId(postId);
    setCurrentScreen('post-detail');
  };

  const handleBackToCommunity = () => {
    setCurrentScreen('community');
    setSelectedPostId(null);
  };

  const handleGoToWritePost = () => {
    setCurrentScreen('write-post');
  };

  const handlePostCreated = () => {
    setCurrentScreen('community');
  };

  const handleGoToReport = (data) => {
    setReportData(data);
    setCurrentScreen('report');
    // TODO: Tell your team leader to handle report screen
    // For now, just show an alert
    alert(`Report feature:  Navigate to Shuxian's report page\nType: ${data.type}\nContent: ${data.content}`);
    setCurrentScreen('community'); // Go back after alert
  };

  const handleBackToMain = () => {
    // TODO: Tell your team leader to handle this
    alert('Navigate to Main Page - Team leader will handle this');
  };

  const handleGoToProfile = () => {
    // TODO: Tell your team leader to handle this
    alert('Navigate to Profile Page - Team leader will handle this');
  };

  return (
    <div className="App">
      {/* Show Community Map */}
      {currentScreen === 'community' && (
        <CommunityMap 
          onViewMore={handleViewMore}
          onGoToWritePost={handleGoToWritePost}
          onBackToMain={handleBackToMain}
          onGoToProfile={handleGoToProfile}
        />
      )}

      {/* Show Post Detail */}
      {currentScreen === 'post-detail' && (
        <PostDetailPage 
          postId={selectedPostId}
          onBack={handleBackToCommunity}
          onGoToReport={handleGoToReport}
          onBackToMain={handleBackToMain}
          onGoToProfile={handleGoToProfile}
        />
      )}

      {/* Show Write Post */}
      {currentScreen === 'write-post' && (
        <WritePostPage 
          onBack={handleBackToCommunity}
          onPostCreated={handlePostCreated}
          onBackToMain={handleBackToMain}
          onGoToProfile={handleGoToProfile}
        />
      )}

      {/* Report screen will be handled by Shuxian */}
    </div>
  );
}

export default App;