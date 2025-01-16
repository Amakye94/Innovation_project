async function drawChart() {
    const response = await fetch('data/heart_rate.json'); // Load mock data
    const data = await response.json();
    const heartRateData = data.heart_rate_data;

    const svg = d3.select('#heart-rate-chart');
    const width = svg.attr('width');
    const height = svg.attr('height');

    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear().domain([0, heartRateData.length - 1]).range([0, width]);
    const yScale = d3.scaleLinear().domain([40, 140]).range([height, 0]);

    const line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d))
        .curve(d3.curveMonotoneX);

    svg.append('path')
        .datum(heartRateData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);
}

drawChart();
