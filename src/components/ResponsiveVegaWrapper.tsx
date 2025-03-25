import React, { useEffect, useRef, useState } from 'react';
import { Vega, type VisualizationSpec } from 'react-vega';

interface ResponsiveVegaWrapperProps {
  spec: VisualizationSpec;
  aspectRatio?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const ResponsiveVegaWrapper: React.FC<ResponsiveVegaWrapperProps> = ({
  spec,
  aspectRatio = 1.6,
  minWidth = 320,
  maxWidth = 800
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(minWidth);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.min(
          Math.max(containerWidth, minWidth),
          maxWidth
        );
        setWidth(newWidth);
      }
    };

    // Initial width calculation
    updateWidth();

    // Add resize listener
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [minWidth, maxWidth]);

  const responsiveSpec: VisualizationSpec = {
    ...spec,
    width,
    height: width / aspectRatio,
    // Override any existing autosize config
    autosize: {
      type: "fit",
      contains: "padding"
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <Vega spec={responsiveSpec} actions={false} />
    </div>
  );
};
