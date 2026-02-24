import { Accelerometer } from 'expo-sensors';

// Threshold for shake detection (g-force)
const SHAKE_THRESHOLD = 3.0;
// Minimum time between shakes to prevent multiple triggers (in ms)
const MIN_TIME_BETWEEN_SHAKES_MS = 1000;

class SensorTriggerService {
    constructor() {
        this.subscription = null;
        this.lastShakeTime = 0;
    }

    startShakeListener(onShakeCallback) {
        // Set update interval to 100ms
        Accelerometer.setUpdateInterval(100);

        this.subscription = Accelerometer.addListener(accelerometerData => {
            let { x, y, z } = accelerometerData;
            // Calculate total acceleration magnitude
            let acceleration = Math.sqrt(x * x + y * y + z * z);

            if (acceleration >= SHAKE_THRESHOLD) {
                const currentTime = new Date().getTime();
                if ((currentTime - this.lastShakeTime) > MIN_TIME_BETWEEN_SHAKES_MS) {
                    this.lastShakeTime = currentTime;
                    onShakeCallback();
                }
            }
        });
    }

    stopShakeListener() {
        if (this.subscription) {
            this.subscription.remove();
            this.subscription = null;
        }
    }
}

export default new SensorTriggerService();
