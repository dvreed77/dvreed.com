import * as d3 from 'd3';
import { demoShapes } from './demoShapes';

export default function StaticShapes() {
  const line = d3.line<[number, number]>()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveLinearClosed);

  // Calculate center of each shape using bounding box
  const shapeCenters = demoShapes.map(shape => {
    const xs = shape.coordinates.map(([x]) => x);
    const ys = shape.coordinates.map(([, y]) => y);
    return {
      x: (Math.min(...xs) + Math.max(...xs)) / 2,
      y: (Math.min(...ys) + Math.max(...ys)) / 2
    };
  });

  return (
    <svg 
      width="300" 
      height="250" 
      viewBox="25 25 250 250"
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
    >
      {demoShapes.map((path) => (
        <path
          key={path.id}
          d={line(path.coordinates) || ''}
          fill="none"
          stroke="black"
          strokeWidth={2}
        />
      ))}
      {shapeCenters.map((center, i) => (
        <text 
          key={i}
          x={center.x}
          y={center.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
        >
          {String.fromCharCode(65 + i)} {/* A, B, C */}
        </text>
      ))}
    </svg>
  );
}
