import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Point {
  id: number;
  x: number;
  y: number;
}

export default function NodeEditor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>([
    { id: 0, x: 50, y: 50 },
    { id: 1, x: 150, y: 50 },
    { id: 2, x: 150, y: 250 },
    { id: 3, x: 50, y: 250 }
  ]);

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

    // Create path from points
    const pathData = d3.line<Point>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveLinearClosed);

    // Draw the polygon
    const path = svg.append('path')
      .datum(points)
      .attr('d', pathData)
      .attr('fill', '#f0f0f0')
      .attr('stroke', 'black');

    // Draw nodes
    const nodeElements = svg.selectAll('circle')
      .data(points, (d: any) => d.id) // Use id for stable updates
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 4)
      .attr('fill', 'blue')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('cursor', 'move')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`x: ${d.x}<br/>y: ${d.y}<br/>id: ${d.id}`)
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
        setPoints(prev => prev.map(p => 
          p.id === d.id ? { ...p, x: newX, y: newY } : p
        ));

        // Update visuals immediately
        path.attr('d', pathData);
        d3.select(event.sourceEvent.target)
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
