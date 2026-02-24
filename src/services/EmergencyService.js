import { Linking, Alert } from 'react-native';
import * as SMS from 'expo-sms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationService from './LocationService';

class EmergencyService {
    async trigger911Call(testMode = false) {
        const number = testMode ? '000' : '911';
        const url = `tel:${number}`;

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', `Device cannot open the dialer for ${number}`);
            }
        } catch (e) {
            console.error('Error opening dialer', e);
        }
    }

    async sendSMSAlerts(locationLink) {
        try {
            const isAvailable = await SMS.isAvailableAsync();
            if (!isAvailable) {
                console.warn('SMS is not available on this device');
                return;
            }

            const userName = await AsyncStorage.getItem('userName') || 'User';
            const contact1 = await AsyncStorage.getItem('emergencyContact1');

            if (!contact1) {
                console.warn('No emergency contacts saved.');
                return;
            }

            const contacts = [contact1];
            const message = `EMERGENCY ALERT: ${userName} needs help. Last known location: ${locationLink}`;

            const { result } = await SMS.sendSMSAsync(contacts, message);
            console.log('SMS result:', result);
        } catch (e) {
            console.error('Error opening SMS composer', e);
        }
    }

    async executeEmergencyProtocol(testMode = false) {
        // 1. Get Location
        const locationLink = await LocationService.getCurrentLocationLink();

        // 2. Open Dialer
        await this.trigger911Call(testMode);

        // 3. Open SMS composer (this will happen after user returns from dialer or concurrently)
        // Note: React Native may pause execution while native dialer is open. 
        // Setting a timeout can help push it to the next tick.
        setTimeout(async () => {
            await this.sendSMSAlerts(locationLink);
        }, 1000);
    }
}

export default new EmergencyService();
