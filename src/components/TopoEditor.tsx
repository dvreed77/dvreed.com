import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const getTopoJson = (rects: Rectangle[]) => ({
  type: 'Topology',
  objects: {
    regions: {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Polygon',
          arcs: [[0, 1, 2, 3]],
          properties: { id: 1 }
        },
        {
          type: 'Polygon',
          arcs: [[~0, 4, 5, 6]],
          properties: { id: 2 }
        }
      ]
    }
  },
  arcs: [
    // Shared edge
    [[rects[0].x + rects[0].width, rects[0].y], 
     [rects[0].x + rects[0].width, rects[0].y + rects[0].height]],
    // Rest of rectangle 1
    [[rects[0].x + rects[0].width, rects[0].y + rects[0].height],
     [rects[0].x, rects[0].y + rects[0].height]],
    [[rects[0].x, rects[0].y + rects[0].height],
     [rects[0].x, rects[0].y]],
    [[rects[0].x, rects[0].y],
     [rects[0].x + rects[0].width, rects[0].y]],
    // Rest of rectangle 2
    [[rects[1].x, rects[1].y + rects[1].height],
     [rects[1].x + rects[1].width, rects[1].y + rects[1].height]],
    [[rects[1].x + rects[1].width, rects[1].y + rects[1].height],
     [rects[1].x + rects[1].width, rects[1].y]],
    [[rects[1].x + rects[1].width, rects[1].y],
     [rects[1].x, rects[1].y]]
  ]
});

// Simple deep diff function
function deepDiff(obj1: any, obj2: any, path: string = ''): any {
  if (obj1 === obj2) return;
  
  if (typeof obj1 !== typeof obj2) {
    return { path, old: obj1, new: obj2 };
  }
  
  if (typeof obj1 !== 'object') {
    if (obj1 !== obj2) {
      return { path, old: obj1, new: obj2 };
    }
    return;
  }
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return { path, old: obj1, new: obj2 };
  }
  
  const diffs: any = {};
  
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const diff = deepDiff(obj1[key], obj2[key], currentPath);
    if (diff) {
      diffs[currentPath] = diff;
    }
  }
  
  return Object.keys(diffs).length ? diffs : undefined;
}

export default function TopoEditor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const prevTopoJsonRef = useRef<any>(null);
  const [rectangles, setRectangles] = useState<Rectangle[]>([
    { id: 1, x: 50, y: 50, width: 100, height: 200 },
    { id: 2, x: 150, y: 50, width: 100, height: 200 }
  ]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create tooltip div
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '3px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Draw rectangles
    svg.selectAll('rect')
      .data(rectangles)
      .enter()
      .append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('fill', '#f0f0f0')
      .attr('stroke', 'black');

    // Draw shared edge
    const sharedX = rectangles[0].x + rectangles[0].width; // This is also rectangles[1].x
    const sharedEdge = svg.append('line')
      .attr('x1', sharedX)
      .attr('y1', rectangles[0].y)
      .attr('x2', sharedX)
      .attr('y2', rectangles[0].y + rectangles[0].height)
      .attr('stroke', 'blue')
      .attr('stroke-width', 4)
      .attr('cursor', 'ew-resize')
      .attr('class', 'shared-edge');

    // Get all unique vertices from the TopoJSON
    const topoJson = getTopoJson(rectangles);
    const vertices = new Set<string>();
    topoJson.arcs.forEach(arc => {
      arc.forEach(point => vertices.add(JSON.stringify(point)));
    });

    // Draw vertices
    Array.from(vertices).map(v => JSON.parse(v)).forEach(point => {
      svg.append('circle')
        .attr('cx', point[0])
        .attr('cy', point[1])
        .attr('r', 4)
        .attr('fill', 'red')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .on('mouseover', (event) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(`x: ${point[0]}<br/>y: ${point[1]}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
        });
    });

    // Add drag behavior to shared edge
    const drag = d3.drag<SVGLineElement, unknown>()
      .on('drag', (event) => {
        const newX = Math.max(rectangles[0].x, Math.min(event.x, rectangles[1].x + rectangles[1].width));
        setRectangles(prev => [
          { ...prev[0], width: newX - prev[0].x },
          { ...prev[1], x: newX, width: (prev[1].x + prev[1].width) - newX }
        ]);
      })
      .on('end', () => {
        // Log the diff on drag end
        const newTopoJson = getTopoJson(rectangles);
        const prevTopoJson = prevTopoJsonRef.current;
        if (prevTopoJson) {
          const diff = deepDiff(prevTopoJson, newTopoJson);
          console.log(prevTopoJson, newTopoJson);
          console.log('TopoJSON Diff:', diff);
        }
        prevTopoJsonRef.current = newTopoJson;
      });

    sharedEdge.call(drag);
    // Cleanup tooltip on unmount
    return () => {
      d3.select('.tooltip').remove();
    };
  }, [rectangles]);



  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <svg
        ref={svgRef}
        width="400"
        height="300"
        className="bg-white"
      />
    </div>
  );
}
