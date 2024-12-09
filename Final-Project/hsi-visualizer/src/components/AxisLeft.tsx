import React, { useEffect, useRef } from 'react';
import { select, axisLeft, ScaleLinear } from 'd3';

interface AxisLeftProps {
  yScale: ScaleLinear<number, number>;
  innerWidth: number;
}

const AxisLeft: React.FC<AxisLeftProps> = ({ yScale }) => {
  const ref = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const axis = axisLeft(yScale);
      // Explicitly cast ref to SVGGElement for TypeScript
      select<SVGGElement, unknown>(ref.current).call(axis);
    }
  }, [yScale]);

  return <g ref={ref} />;
};

export default AxisLeft;
