// BarPlotPage.js
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import '../styles/BarPlotPage.css';

function BarPlotPage({ selectedMarkers }) {
    const [samplesData, setSamplesData] = useState([]);
    const [predictionsData, setPredictionsData] = useState([]);

    const containerRef = useRef(null);

    const sampleNums = useMemo(() => selectedMarkers.map((m) => m.sample_num), [selectedMarkers]);

    useEffect(() => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;

        // Fetch predictions
        fetch(`${backendUrl}/api/predictions`)
            .then((res) => res.json())
            .then((preds) => setPredictionsData(preds))
            .catch((err) => console.error('Error fetching predictions:', err));

        // Fetch samples
        const url =
            sampleNums.length > 0
                ? `${backendUrl}/api/samples?sample_nums=${sampleNums.join(',')}`
                : `${backendUrl}/api/samples`;

        fetch(url)
            .then((res) => res.json())
            .then((docs) => setSamplesData(docs))
            .catch((err) => console.error('Error fetching samples:', err));
    }, [sampleNums]);

    const frequencyFields = useMemo(() => {
        if (samplesData.length > 0) {
            return Object.keys(samplesData[0]).filter((key) => key.startsWith('frq'));
        }
        return [];
    }, [samplesData]);

    const aggregatedData = useMemo(() => {
        if (samplesData.length === 0 || predictionsData.length === 0) return [];

        const predMap = new Map();
        predictionsData.forEach((p) => {
            predMap.set(p.sample_num, {
                groundTruth: p.ground_truth_label,
            });
        });

        // Group frequencies by category (ground truth label)
        const categoryGroups = d3.group(
            samplesData.map((sample) => ({
                ...sample,
                groundTruth: predMap.get(sample.Sample_num)?.groundTruth || 'Unknown',
            })),
            (d) => d.groundTruth
        );

        const result = [];
        for (const [category, samples] of categoryGroups) {
            const bins = Array(10).fill(0); // 10 bins
            samples.forEach((sample) => {
                frequencyFields.forEach((field) => {
                    const freq = sample[field];
                    if (typeof freq === 'number') {
                        const binIndex = Math.floor((freq + 0.5) * 10);
                        if (binIndex >= 0 && binIndex < bins.length) {
                            bins[binIndex]++;
                        }
                    }
                });
            });
            result.push({ category, bins });
        }

        return result;
    }, [samplesData, predictionsData, frequencyFields]);

    useEffect(() => {
        // Ensure the containerRef is available
        if (!containerRef.current) return;

        // Clear only the elements that D3 created last time
        const container = d3.select(containerRef.current);
        container.selectAll('.chart-container').remove(); // Removes old charts

        if (aggregatedData.length === 0) return;

        const width = 600; // Increased width
        const height = 400; // Increased height
        const margin = { top: 50, right: 30, bottom: 70, left: 90 }; // Adjusted margins for better spacing

        aggregatedData.forEach((data) => {
            const chartContainer = container
                .append('div')
                .attr('class', 'chart-container')
                .style('margin-bottom', '30px');

            const svg = chartContainer
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const binsData = data.bins.map((count, i) => ({
                class: `${(i / 10 - 0.5).toFixed(1)} to ${(i / 10 - 0.4).toFixed(1)}`,
                value: count,
            }));

            // Define scales
            const x = d3.scaleBand()
                .domain(binsData.map((d) => d.class))
                .range([0, width])
                .padding(0.2); // Add padding between bars

            const y = d3.scaleLinear()
                .domain([0, d3.max(binsData, (d) => d.value) * 1.1]) // Add padding on top
                .range([height, 0]);

            // Add X axis
            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickSize(0))
                .selectAll('text')
                .attr('transform', 'translate(0,10) rotate(-45)') // Rotate labels for readability
                .style('text-anchor', 'end');

            // Add Y axis
            svg.append('g')
                .call(d3.axisLeft(y).ticks(10));

            // Add Bars
            svg.selectAll('bar')
                .data(binsData)
                .enter()
                .append('rect')
                .attr('x', (d) => x(d.class))
                .attr('y', (d) => y(d.value))
                .attr('width', x.bandwidth())
                .attr('height', (d) => height - y(d.value))
                .attr('fill', '#69b3a2');

            // Add Title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', -margin.top / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('font-weight', 'bold')
                .text(`Category: ${data.category}`);

            // Add X axis label
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .text('Frequency Ranges');

            // Add Y axis label
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${-margin.left + 20}, ${height / 2}) rotate(-90)`)
                .style('font-size', '12px')
                .text('Count');
        });
    }, [aggregatedData]);

    return (
        <div className="bar-plot-page" style={{ overflowY: 'scroll', height: '90vh' }}>
            <div ref={containerRef} />
            {aggregatedData.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    No data available. Please select some markers or ensure data is loaded.
                </p>
            )}
        </div>
    );
}

export default BarPlotPage;
