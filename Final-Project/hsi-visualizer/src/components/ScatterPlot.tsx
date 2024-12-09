import React from 'react';
import { scaleLinear, extent } from 'd3';
import AxisBottom from './AxisBottom';
import AxisLeft from './AxisLeft';

interface ScatterPlotProps {
  data: { frequency: number; intensity: number }[];
  width: number;
  height: number;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, width, height }) => {
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain(extent(data, (d) => d.frequency) as [number, number])
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain(extent(data, (d) => d.intensity) as [number, number])
    .range([innerHeight, 0]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <AxisBottom xScale={xScale} innerHeight={innerHeight} />
        <AxisLeft yScale={yScale} innerWidth={innerWidth} />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(d.frequency)}
            cy={yScale(d.intensity)}
            r={4}
            fill="#2563EB"
          />
        ))}
      </g>
    </svg>
  );
};

export default ScatterPlot;
