// src/components/FlowerHouse/WeeklyFlowerCard.js
import React, { useMemo } from 'react';
import { getWeeklyFlowerData } from './dataProcessor';

const styles = {
    // Reduced height to give more space for text below
    flowerContainer: {
        width: '100%',
        height: '90px', // Reduced from 110px to prevent squishing text
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: '12px', // Increased spacing between flower and text
        overflow: 'hidden'
    },
    flowerImage: {
        maxWidth: '100%', 
        maxHeight: '100%', 
        objectFit: 'contain', 
        filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.1))',
    },
    // Enhanced label styling for centered, larger text
    flowerLabel: {
        fontSize: '23 px', // Made slightly bigger as requested
        fontWeight: 'bold', 
        margin: '0', 
        color: '#000000', 
        textAlign: 'center', // Ensures text is centered
        width: '100%',
        whiteSpace: 'nowrap', // Prevents the date from breaking into multiple lines
        textShadow: '0 0 1px rgba(255, 255, 255, 0.7)',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
    },
    // Sub-label for the date range
    dateLabel: {
        fontSize: '0.85rem',
        color: '#4A4A4A',
        textAlign: 'center',
        marginTop: '4px',
        width: '100%',
        whiteSpace: 'nowrap'
    }
};

const WeeklyFlowerCard = ({ weekLogs, weekLabel, onClick, style }) => {
    const { flower } = useMemo(() => getWeeklyFlowerData(weekLogs), [weekLogs]);
    const [isHovered, setIsHovered] = React.useState(false);

    // Assuming weekLogs contains the date range or passed via props
    const dateRange = useMemo(() => {
        if (!weekLogs || weekLogs.length === 0) return "";
        // Simplified logic to show start/end dates if available in your data structure
        return ""; 
    }, [weekLogs]);

    return (
        <div 
            className="flower-card" 
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                ...style, 
                backgroundColor: flower.backgroundColor || '#f9f9f9',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)', 
                borderRadius: '20px', 
                padding: '15px 10px', // More padding for a balanced look
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHovered ? '0 6px 12px rgba(0,0,0,0.15)' : '0 4px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxSizing: 'border-box'
            }}
        >
            <div className="flower-container" style={styles.flowerContainer}>
                <img 
                    src={flower.imagePath} 
                    alt={flower.name} 
                    style={styles.flowerImage}
                    onError={(e) => { e.target.style.display = 'none'; }} 
                />
            </div>
            
            <p style={styles.flowerLabel}>{weekLabel}</p>
            {/* If you pass the date string, it will appear centered below the Week label */}
            {dateRange && <p style={styles.dateLabel}>{dateRange}</p>}
        </div>
    );
};

export default WeeklyFlowerCard;