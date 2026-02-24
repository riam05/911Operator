import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        // Error occurred - check `error.message` for more details.
        console.error(error);
        return;
    }
    if (data) {
        const { locations } = data;
        const location = locations[0];
        if (location) {
            console.log('Background location update:', location.coords.latitude, location.coords.longitude);
            // In a full implementation, you'd save this to AsyncStorage or POST to a simulated AI API here
        }
    }
});

class BackgroundService {
    async startBackgroundLocation() {
        try {
            // Background location requires foreground permission first
            const fgStatus = await Location.requestForegroundPermissionsAsync();
            if (fgStatus.status !== 'granted') return;

            const bgStatus = await Location.requestBackgroundPermissionsAsync();
            if (bgStatus.status === 'granted') {
                await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 30000, // 30 seconds
                    deferredUpdatesInterval: 30000,
                    showsBackgroundLocationIndicator: true,
                });
                console.log('Background location tracking started.');
            }
        } catch (error) {
            console.error('Failed to start background tracking:', error);
        }
    }

    async stopBackgroundLocation() {
        try {
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
            if (hasStarted) {
                await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                console.log('Background location tracking stopped.');
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export default new BackgroundService();
