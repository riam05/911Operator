import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EmergencyScreen from '../screens/EmergencyScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ initialRouteName = "Onboarding" }) {
    return (
        <Stack.Navigator initialRouteName={initialRouteName}>
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name="Emergency"
                component={EmergencyScreen}
                options={{ headerShown: false, presentation: 'fullScreenModal' }}
            />
        </Stack.Navigator>
    );
}
