import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as topology from 'topojson-server';
import type { Feature, FeatureCollection } from 'geojson';

interface Point {
  id: number;
  x: number;
  y: number;
  sharedWith?: number[]; // IDs of points that share this position
}

export default function TopoEditor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>([
    // Left rectangle
    { id: 0, x: 50, y: 50 },
    { id: 1, x: 150, y: 50 },
    { id: 2, x: 150, y: 250 },
    { id: 3, x: 50, y: 250 },
    // Right rectangle
    { id: 4, x: 150, y: 50 },  // Shared with point 1
    { id: 5, x: 250, y: 50 },
    { id: 6, x: 250, y: 250 },
    { id: 7, x: 150, y: 250 }  // Shared with point 2
  ]);

  // Find shared points and update their sharedWith property
  useEffect(() => {
    const pointMap = new Map<string, number[]>();
    points.forEach(point => {
      const key = `${point.x},${point.y}`;
      const existing = pointMap.get(key) || [];
      pointMap.set(key, [...existing, point.id]);
    });

    setPoints(prev => prev.map(point => {
      const key = `${point.x},${point.y}`;
      const shared = pointMap.get(key) || [];
      return shared.length > 1 ? { ...point, sharedWith: shared.filter(id => id !== point.id) } : point;
    }));
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create tooltip
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

    // Create two polygons from points
    const leftPoints = points.slice(0, 4);
    const rightPoints = [points[4], points[5], points[6], points[7]];

    // Create path generator
    const pathData = d3.line<Point>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveLinearClosed);

    // Draw the polygons
    svg.append('path')
      .datum(leftPoints)
      .attr('d', pathData)
      .attr('fill', '#f0f0f0')
      .attr('stroke', 'black');

    svg.append('path')
      .datum(rightPoints)
      .attr('d', pathData)
      .attr('fill', '#f0f0f0')
      .attr('stroke', 'black');

    // Draw nodes
    const nodeElements = svg.selectAll('circle')
      .data(points, (d: any) => d.id)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 4)
      .attr('fill', d => d.sharedWith ? 'red' : 'blue')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('cursor', 'move')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(
          `x: ${d.x}<br/>y: ${d.y}<br/>id: ${d.id}${d.sharedWith ? '<br/>shared with: ' + d.sharedWith.join(', ') : ''}`
        )
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add drag behavior
    const drag = d3.drag<SVGCircleElement, Point>()
      .on('drag', (event, d) => {
        const newX = event.x;
        const newY = event.y;

        // Update points array
        setPoints(prev => prev.map(p => {
          // If this is the dragged point or a point that shares position with it
          if (p.id === d.id || d.sharedWith?.includes(p.id)) {
            return { ...p, x: newX, y: newY };
          }
          return p;
        }));

        // Update visuals immediately
        svg.selectAll('path').remove();
        svg.append('path')
          .datum(leftPoints)
          .attr('d', pathData)
          .attr('fill', '#f0f0f0')
          .attr('stroke', 'black');

        svg.append('path')
          .datum(rightPoints)
          .attr('d', pathData)
          .attr('fill', '#f0f0f0')
          .attr('stroke', 'black');

        // Update dragged node and any shared nodes
        svg.selectAll('circle')
          .filter((p: any) => p.id === d.id || (d.sharedWith?.includes(p.id) ?? false))
          .attr('cx', newX)
          .attr('cy', newY);
      });

    nodeElements.call(drag);

    // Cleanup on unmount
    return () => {
      d3.select('.tooltip').remove();
    };
  }, [points]);

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