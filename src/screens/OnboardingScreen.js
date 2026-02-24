import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }) {
    const [name, setName] = useState('');
    const [contact1, setContact1] = useState('');

    const handleSave = async () => {
        if (!name.trim() || !contact1.trim()) {
            Alert.alert('Required Fields', 'Please enter your name and at least one emergency contact.');
            return;
        }

        try {
            await AsyncStorage.setItem('userName', name);
            await AsyncStorage.setItem('emergencyContact1', contact1);
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            navigation.replace('Home');
        } catch (e) {
            Alert.alert('Error', 'Failed to save data.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to SafeTap</Text>
                <Text style={styles.subtitle}>Let's set up your emergency info.</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Your Full Name"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Emergency Contact Phone"
                    keyboardType="phone-pad"
                    value={contact1}
                    onChangeText={setContact1}
                />

                <Button title="Save and Continue" onPress={handleSave} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        marginTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
});
