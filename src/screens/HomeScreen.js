import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, PanResponder } from 'react-native';
import SensorTriggerService from '../services/SensorTriggerService';

export default function HomeScreen({ navigation }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    const triggerEmergency = () => {
        navigation.navigate('Emergency');
    };

    const tapCount = useRef(0);
    const tapTimer = useRef(null);
    const holdTimer = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        // Start Shake Listener
        SensorTriggerService.startShakeListener(() => {
            console.log('Shake detected!');
            triggerEmergency();
        });

        return () => {
            clearInterval(timer);
            SensorTriggerService.stopShakeListener();
            if (tapTimer.current) clearTimeout(tapTimer.current);
            if (holdTimer.current) clearTimeout(holdTimer.current);
        };
    }, []);

    const handlePressIn = () => {
        // Detect 5-second hold
        holdTimer.current = setTimeout(() => {
            console.log('5-second hold detected!');
            triggerEmergency();
        }, 5000);
    };

    const handlePressOut = () => {
        // Clear hold timer if released early
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
    };

    const handlePress = () => {
        // Detect 3 rapid taps
        tapCount.current += 1;

        if (tapCount.current === 1) {
            tapTimer.current = setTimeout(() => {
                // Reset tap count after 1 second if not enough taps
                tapCount.current = 0;
            }, 1000);
        } else if (tapCount.current >= 3) {
            console.log('3 rapid taps detected!');
            clearTimeout(tapTimer.current);
            tapCount.current = 0;
            triggerEmergency();
        }
    };

    const goToSettings = () => {
        navigation.navigate('Settings');
    };

    const testEmergency = () => {
        triggerEmergency();
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.clockContainer}
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
            >
                <Text style={styles.timeText}>
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.dateText}>
                    {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
            </TouchableOpacity>

            <View style={styles.debugPanel}>
                <Text style={styles.debugTitle}>Debug Options(Hidden in Prod)</Text>
                <TouchableOpacity style={styles.debugButton} onPress={goToSettings}>
                    <Text style={styles.debugButtonText}>Open Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.debugButton, styles.emergencyButton]} onPress={testEmergency}>
                    <Text style={[styles.debugButtonText, { color: 'white' }]}>TEST EMERGENCY</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background for the disguised clock
    },
    clockContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 72,
        fontWeight: '200',
        color: '#fff',
    },
    dateText: {
        fontSize: 20,
        color: '#aaa',
        marginTop: 10,
    },
    debugPanel: {
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    debugTitle: {
        color: '#fff',
        marginBottom: 10,
        fontSize: 12,
    },
    debugButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    emergencyButton: {
        backgroundColor: 'red',
    },
    debugButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
