import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const [contact1, setContact1] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const storedName = await AsyncStorage.getItem('userName');
            const storedContact = await AsyncStorage.getItem('emergencyContact1');
            if (storedName) setName(storedName);
            if (storedContact) setContact1(storedContact);
        } catch (e) {
            console.error(e);
        }
    };

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('userName', name);
            await AsyncStorage.setItem('emergencyContact1', contact1);
            Alert.alert('Saved', 'Settings saved successfully.');
        } catch (e) {
            Alert.alert('Error', 'Failed to save settings.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Your Name:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Emergency Contact 1:</Text>
            <TextInput
                style={styles.input}
                value={contact1}
                keyboardType="phone-pad"
                onChangeText={setContact1}
            />

            <Button title="Save Settings" onPress={saveSettings} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
    },
});
