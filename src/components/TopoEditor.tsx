import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as topology from 'topojson-server';
import type { Feature, FeatureCollection } from 'geojson';

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Node {
  x: number;
  y: number;
  arcs: number[];
}

const getTopoJson = (rects: Rectangle[]) => {
  const features: Feature[] = rects.map(rect => ({
    type: 'Feature',
    properties: { id: rect.id },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [rect.x, rect.y],
          [rect.x + rect.width, rect.y],
          [rect.x + rect.width, rect.y + rect.height],
          [rect.x, rect.y + rect.height],
          [rect.x, rect.y]
        ]
      ]
    }
  }));

  const geoJson: FeatureCollection = {
    type: 'FeatureCollection',
    features
  };

  return topology.topology({
    regions: geoJson
  });
};

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

    // Get TopoJSON representation
    const topoJson = getTopoJson(rectangles);
    console.log('TopoJSON:', topoJson);

    // Convert back to GeoJSON for rendering
    const geoJson = topojson.feature(topoJson, topoJson.objects.regions) as FeatureCollection;

    // Draw regions
    const path = d3.geoPath();
    svg.selectAll('path')
      .data(geoJson.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#f0f0f0')
      .attr('stroke', 'black');

    // Find shared nodes by analyzing arcs
    const nodes: Node[] = [];
    const nodeMap = new Map<string, number>();

    topoJson.arcs.forEach((arc, arcIndex) => {
      arc.forEach(point => {
        const key = JSON.stringify(point);
        const existingIndex = nodeMap.get(key);
        if (existingIndex !== undefined) {
          nodes[existingIndex].arcs.push(arcIndex);
        } else {
          nodeMap.set(key, nodes.length);
          nodes.push({
            x: point[0],
            y: point[1],
            arcs: [arcIndex]
          });
        }
      });
    });

    // Draw nodes
    const nodeElements = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 4)
      .attr('fill', d => d.arcs.length > 1 ? 'red' : 'blue')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('cursor', 'move')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`x: ${d.x}<br/>y: ${d.y}<br/>shared: ${d.arcs.length > 1 ? 'yes' : 'no'}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add drag behavior to nodes
    const drag = d3.drag<SVGCircleElement, Node>()
      .on('drag', (event, d) => {
        const newX = event.x;
        const newY = event.y;

        // Update node position immediately
        d3.select(event.sourceEvent.target)
          .attr('cx', newX)
          .attr('cy', newY);

        // Update rectangles based on node movement
        setRectangles(prev => prev.map(rect => {
          const rectNodes = [
            [rect.x, rect.y],
            [rect.x + rect.width, rect.y],
            [rect.x + rect.width, rect.y + rect.height],
            [rect.x, rect.y + rect.height]
          ];

          // Check if this node belongs to the current rectangle
          const nodeIndex = rectNodes.findIndex(([x, y]) => 
            Math.abs(x - d.x) < 1 && Math.abs(y - d.y) < 1
          );

          if (nodeIndex === -1) return rect;

          // Update rectangle dimensions based on node movement
          const newRect = { ...rect };
          switch (nodeIndex) {
            case 0: // Top-left
              newRect.width += rect.x - newX;
              newRect.height += rect.y - newY;
              newRect.x = newX;
              newRect.y = newY;
              break;
            case 1: // Top-right
              newRect.width = newX - rect.x;
              newRect.height += rect.y - newY;
              newRect.y = newY;
              break;
            case 2: // Bottom-right
              newRect.width = newX - rect.x;
              newRect.height = newY - rect.y;
              break;
            case 3: // Bottom-left
              newRect.width += rect.x - newX;
              newRect.height = newY - rect.y;
              newRect.x = newX;
              break;
          }

          // Ensure width and height are positive
          if (newRect.width < 0) {
            newRect.x += newRect.width;
            newRect.width = Math.abs(newRect.width);
          }
          if (newRect.height < 0) {
            newRect.y += newRect.height;
            newRect.height = Math.abs(newRect.height);
          }

          return newRect;
        }));

        // Update the node's stored position
        d.x = newX;
        d.y = newY;
      })
      .on('end', () => {
        // Log the diff on drag end
        const newTopoJson = getTopoJson(rectangles);
        const prevTopoJson = prevTopoJsonRef.current;
        if (prevTopoJson) {
          const diff = deepDiff(prevTopoJson, newTopoJson);
          console.log('TopoJSON Diff:', diff);
        }
        prevTopoJsonRef.current = newTopoJson;
      });

    nodeElements.call(drag);

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
