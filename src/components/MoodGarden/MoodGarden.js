import React from 'react';
import NavigationButtons from '../NavigationButtons';
import '../../styles/PageContainer.css';

const MoodGarden = () => {
  return (
    <div className="page-container">
      <NavigationButtons />
      <div className="page-content">
        <h1>Mood Garden Page</h1>
        <p>This is the Mood Garden page. Replace with your content.</p>
      </div>
    </div>
  );
};

export default MoodGarden;

