import * as Location from 'expo-location';

class LocationService {
    async requestPermissions() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Permission to access location was denied');
            return false;
        }
        return true;
    }

    async getCurrentLocationLink() {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) return 'Location not available';

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = location.coords;
            return `https://maps.google.com/?q=${latitude},${longitude}`;
        } catch (e) {
            console.error('Error fetching location', e);
            return 'Location not available';
        }
    }

    // Background location tracking would typically be set up here using expo-task-manager
    // Due to OS restrictions, we'll focus on foreground polling during an active emergency for the prototype.
    startActiveTracking(interval, callback) {
        return setInterval(async () => {
            const link = await this.getCurrentLocationLink();
            callback(link);
        }, interval);
    }
}

export default new LocationService();
