import React, { useEffect, useRef } from 'react';
import { select, axisBottom, ScaleLinear } from 'd3';

interface AxisBottomProps {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}

const AxisBottom: React.FC<AxisBottomProps> = ({ xScale, innerHeight }) => {
  const ref = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const axis = axisBottom(xScale);
      // Explicitly cast ref to SVGGElement for TypeScript
      select<SVGGElement, unknown>(ref.current).call(axis);
    }
  }, [xScale]);

  return <g ref={ref} transform={`translate(0, ${innerHeight})`} />;
};

export default AxisBottom;
