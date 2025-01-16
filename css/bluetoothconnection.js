let heartRateCharacteristic = null;

// Connect to a BLE Heart Rate Monitor
async function connectToDevice() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: false,
            filters: [{ services: ['heart_rate'] }]
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('heart_rate');
        heartRateCharacteristic = await service.getCharacteristic('heart_rate_measurement');

        console.log('Connected to Heart Rate Monitor!');
        heartRateCharacteristic.addEventListener('characteristicvaluechanged', handleHeartRateData);
        await heartRateCharacteristic.startNotifications();
    } catch (error) {
        console.error('Error connecting to device:', error);
    }
}

// Handle Heart Rate Data from the Device
function handleHeartRateData(event) {
    const value = event.target.value;
    const heartRate = extractHeartRate(value);
    updateUI(heartRate); // Update UI with the live heart rate
}

// Extract Heart Rate from Data
function extractHeartRate(value) {
    const data = new DataView(value.buffer);
    const flags = data.getUint8(0);
    const rate16Bits = flags & 0x1;
    if (rate16Bits) {
        return data.getUint16(1, true);
    } else {
        return data.getUint8(1);
    }
}

// Update the UI
function updateUI(heartRate) {
    document.getElementById('bpm-value').innerText = heartRate;
    console.log(`Live Heart Rate: ${heartRate}`);
}
