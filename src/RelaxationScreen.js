// src/RelaxationTimer.js

import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert 
} from 'react-native';

const INITIAL_TIME_SECONDS = 5 * 60; // 5 minutes

const RelaxationTimer = ({ onGoBack }) => { 
    const [secondsLeft, setSecondsLeft] = useState(INITIAL_TIME_SECONDS);
    const [isRunning, setIsRunning] = useState(false);

    // --- Timer Effect ---
    useEffect(() => {
        let interval = null;

        if (isRunning && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(prevSeconds => prevSeconds - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isRunning) {
            clearInterval(interval);
            setIsRunning(false);
            Alert.alert("Time's Up!", "Your 5-minute meditation is complete!");
        } else if (!isRunning && interval) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning, secondsLeft]); 

    // --- Handlers ---
    const handleStart = () => {
        if (secondsLeft === 0) { setSecondsLeft(INITIAL_TIME_SECONDS); }
        setIsRunning(true);
    };
    
    const handleCancel = () => {
        setIsRunning(false);
        setSecondsLeft(INITIAL_TIME_SECONDS); 
    };
    
    // --- Time Calculation for Display ---
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Button Logic
    const buttonText = isRunning ? "PAUSE" : "START";
    const startHandler = isRunning ? () => setIsRunning(false) : handleStart;


    return (
        <View style={styles.container}>
            
            {/* Background: Using the confirmed background image */}
            <ImageBackground 
                source={require('./assets/images/main_background.png')} 
                style={styles.backgroundImage}
            >
                
                {/* 🛑 Forest Icon to go back to the main Self-Care/Forest view 🛑 */}
                <TouchableOpacity 
                    style={styles.forestIcon} 
                    onPress={onGoBack} // <--- Uses the prop to switch back
                >
                    <Text style={styles.iconText}>Forest</Text> 
                </TouchableOpacity>

                {/* Clock Display */}
                <View style={styles.clockContainer}>
                    <Text style={styles.clockText}>{formattedMinutes}</Text> 
                    <Text style={styles.clockSeparator}>:</Text>
                    <Text style={styles.clockText}>{formattedSeconds}</Text> 
                </View>

                {/* Cancel Button */}
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>cancel</Text>
                </TouchableOpacity>

                {/* Start/Pause Button */}
                <TouchableOpacity style={styles.startButton} onPress={startHandler}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>

            </ImageBackground>
        </View>
    );
};

// ... (styles remain the same)
const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, resizeMode: 'cover' },
    
    // Icon style to go back
    forestIcon: {
        position: 'absolute', top: 40, right: 20, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, borderRadius: 5, zIndex: 10,
    },
    iconText: { color: 'white', fontWeight: 'bold' },

    // Clock and Button positioning styles (ADJUST THESE VALUES!)
    clockContainer: { position: 'absolute', top: 350, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' },
    clockText: { fontSize: 80, fontWeight: 'bold', color: 'black', marginHorizontal: 10 },
    clockSeparator: { fontSize: 80, color: 'black' },
    cancelButton: { position: 'absolute', bottom: 100, left: 80, width: 120, height: 50, justifyContent: 'center', alignItems: 'center' },
    startButton: { position: 'absolute', bottom: 100, right: 80, width: 120, height: 50, justifyContent: 'center', alignItems: 'center' },
    buttonText: { fontSize: 20, color: 'black', fontWeight: 'bold' }
});


export default RelaxationTimer;