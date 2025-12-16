// src/SelfCare.js (This manages the Forest, Relaxation, and Music views)

import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { useNavigate } from 'react-router-dom'; 

// --- Import the Sub-Components ---
import RelaxationTimer from './RelaxationTimer'; 
import MusicPlayer from './MusicPlayer';       

// Constants for managing which view is currently active
const VIEWS = {
    FOREST: 'forest',
    RELAXATION: 'relaxation',
    MUSIC: 'music',
};

const SelfCare = () => {
    const navigate = useNavigate();
    // State to track which component is showing (Forest map, Timer, or Music)
    const [currentView, setCurrentView] = useState(VIEWS.FOREST);



    // Function to render the main Forest area with clickable icons
    const renderForestView = () => (
        <ImageBackground 
            source={require('./assets/images/forest_page_background.png')} 
            style={styles.backgroundImage}
        >
            

            {/* --- Clickable Area for Relaxation (Stones) --- */}
            <TouchableOpacity 
                style={styles.relaxationArea} 
                onPress={() => setCurrentView(VIEWS.RELAXATION)} // <--- SWITCHES TO TIMER
            >
                <Text style={styles.areaText}>Relaxation</Text>
            </TouchableOpacity>

            {/* --- Clickable Area for Music (Bird) --- */}
            <TouchableOpacity 
                style={styles.musicArea} 
                onPress={() => setCurrentView(VIEWS.MUSIC)} // <--- SWITCHES TO MUSIC
            >
                <Text style={styles.areaText}>Music</Text>
            </TouchableOpacity>

            {/* AI Friend area omitted for now */}

        </ImageBackground>
    );

    // Function to render the specific component based on state
    const renderActiveComponent = () => {
        switch (currentView) {
            case VIEWS.FOREST:
                return renderForestView();
            case VIEWS.RELAXATION:
                // Pass the function to go back to the forest view
                return <RelaxationTimer onGoBack={() => setCurrentView(VIEWS.FOREST)} />;
            case VIEWS.MUSIC:
                // Pass the function to go back to the forest view
                return <MusicPlayer onGoBack={() => setCurrentView(VIEWS.FOREST)} />;
            default:
                return renderForestView();
        }
    };

    return (
        <View style={styles.container}>
            {renderActiveComponent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, resizeMode: 'cover' },
    
    // Icon to go back to the main map
    mapIcon: {
        position: 'absolute', top: 40, right: 20, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, borderRadius: 5, zIndex: 10,
    },
    iconText: { color: 'white', fontWeight: 'bold' },

    // Positioning styles for clickable areas (ADJUST THESE VALUES!)
    relaxationArea: {
        position: 'absolute', top: 400, right: 40, width: 120, height: 150,
        justifyContent: 'center', alignItems: 'center',
    },
    musicArea: {
        position: 'absolute', bottom: 50, left: 80, width: 150, height: 150,
        justifyContent: 'center', alignItems: 'center',
    },
    areaText: { fontSize: 16, fontWeight: 'bold', color: 'black' }
});

export default SelfCare;