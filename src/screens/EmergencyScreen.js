import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import EmergencyService from '../services/EmergencyService';
import BackgroundService from '../services/BackgroundService';

export default function EmergencyScreen({ navigation }) {
    const [countdown, setCountdown] = useState(5);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (countdown > 0 && !isActive) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !isActive) {
            triggerEmergencyActions();
        }
    }, [countdown, isActive]);

    const triggerEmergencyActions = async () => {
        setIsActive(true);
        console.log('Emergency Triggered!');
        // Passing true to enable safe/test mode
        await BackgroundService.startBackgroundLocation();
        await EmergencyService.executeEmergencyProtocol(true);
    };

    const cancelEmergency = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            {!isActive ? (
                <View style={styles.content}>
                    <Text style={styles.warningText}>EMERGENCY TRIGGERED</Text>
                    <Text style={styles.countdownText}>{countdown}</Text>
                    <Text style={styles.subText}>Seconds until actions begin</Text>

                    <TouchableOpacity style={styles.cancelButton} onPress={cancelEmergency}>
                        <Text style={styles.cancelButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.activeContent}>
                    {/* Extremely dark/discreet active mode */}
                    <Text style={styles.activeText}>Active</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    warningText: {
        color: 'red',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    countdownText: {
        color: '#fff',
        fontSize: 72,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subText: {
        color: '#aaa',
        fontSize: 16,
        marginBottom: 50,
    },
    cancelButton: {
        backgroundColor: '#333',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    activeContent: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeText: {
        color: '#111', // Almost invisible
        fontSize: 12,
    },
});
