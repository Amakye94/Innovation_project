let isMonitoring = false;
let intervalId;
let dataPoints = [];
let capturedData = [];

// Buttons
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const captureBtn = document.getElementById('capture-btn');
const bpmValue = document.getElementById('bpm-value');

// Start Monitoring
startBtn.addEventListener('click', () => {
    isMonitoring = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    captureBtn.disabled = false;
    startMonitoring();
});

// Stop Monitoring
stopBtn.addEventListener('click', () => {
    isMonitoring = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    captureBtn.disabled = true;
    stopMonitoring();
});

// Capture Splines
captureBtn.addEventListener('click', () => {
    capturedData = [...dataPoints];
    alert('Splines captured successfully!');
    analyzeData();
});

// Generate Realistic ECG-Like Data
function generateECGData() {
    const now = Date.now();
    const heartRate = Math.floor(Math.random() * (80 - 60 + 1)) + 60; // Random BPM between 60-80
    const rInterval = 60000 / heartRate; // R-R interval in ms (60,000 ms per minute)

    // Time within the current R-R interval
    const t = (now % rInterval) / rInterval;

    // Simulate P-wave, QRS complex, T-wave, and baseline wandering
    let ecgValue = 0;

    // Baseline wandering (slow sinusoidal drift)
    const baselineWandering = 0.1 * Math.sin((now / 10000) * Math.PI);

    // P-wave (small upward deflection before QRS)
    if (t >= 0.1 && t < 0.2) {
        ecgValue = 0.3 * Math.sin((t - 0.1) * Math.PI * 10); // Smooth P-wave
    }
    // QRS complex (sharp spike)
    else if (t >= 0.2 && t < 0.25) {
        ecgValue = -0.8; // Sharp downward Q
    } else if (t >= 0.25 && t < 0.3) {
        ecgValue = 1.5; // Sharp upward R
    } else if (t >= 0.3 && t < 0.35) {
        ecgValue = -0.5; // Sharp downward S
    }
    // T-wave (broader upward deflection)
    else if (t >= 0.4 && t < 0.6) {
        ecgValue = 0.4 * Math.sin((t - 0.4) * Math.PI * 5); // Smooth T-wave
    }

    // Add baseline wandering and noise
    ecgValue += baselineWandering;
    const noise = (Math.random() - 0.5) * 0.05; // Small Gaussian noise
    ecgValue += noise;

    // Add the generated point to the data array
    dataPoints.push({ time: now, amplitude: ecgValue, heartRate });

    // Keep only the last 500 points to maintain performance
    if (dataPoints.length > 500) dataPoints.shift();

    return heartRate;
}

// Start Monitoring Function
function startMonitoring() {
    intervalId = setInterval(() => {
        const heartRate = generateECGData();
        bpmValue.innerText = heartRate; // Update displayed BPM
        updateChart(); // Update chart with new data
    }, 50); // Generate new data every 10ms for smooth ECG waves
}

// Stop Monitoring Function
function stopMonitoring() {
    clearInterval(intervalId);
}

// Analyze Captured Data
function analyzeData() {
    if (capturedData.length === 0) {
        alert('No splines captured!');
        return;
    }

    const amplitudes = capturedData.map(d => d.amplitude);
    const avgAmplitude = (amplitudes.reduce((a, b) => a + b, 0) / amplitudes.length).toFixed(2);
    const maxAmplitude = Math.max(...amplitudes).toFixed(2);
    const minAmplitude = Math.min(...amplitudes).toFixed(2);

    document.getElementById('avg-amplitude').innerText = avgAmplitude;
    document.getElementById('max-amplitude').innerText = maxAmplitude;
    document.getElementById('min-amplitude').innerText = minAmplitude;
}

// Update Chart Using D3.js
function updateChart() {
    const svg = d3.select('#live-chart');
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll('*').remove(); // Clear previous chart

    const xScale = d3.scaleTime()
        .domain([d3.min(dataPoints, d => d.time), d3.max(dataPoints, d => d.time)])
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([-2, 2.5]) // Expanded range for baseline wandering
        .range([innerHeight, 0]);

    const line = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.amplitude))
        .curve(d3.curveBasis); // Smooth curves for ECG

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat('%H:%M:%S')));

    g.append('g')
        .call(d3.axisLeft(yScale));

    g.append('path')
        .datum(dataPoints)
        .attr('fill', 'none')
        .attr('stroke', 'black') // ECG waveform color
        .attr('stroke-width', 1.5)
        .attr('d', line);
}
