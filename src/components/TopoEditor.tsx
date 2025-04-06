import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as topology from 'topojson-server';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { Topology } from 'topojson-specification';
import type { Path } from './types';
import DraggableNode from './DraggableNode';
import { convertArcs, extractArcIndices, pathToGeoJSON, arcsToPath, topoToGeoJSON, arcsToTopoArcs } from './utils';
import type { MyPoint, MyArc } from './utils';

interface TopoNode extends MyPoint {
  arcIndices: number[]; // Indices of arcs this node belongs to
}

interface IProps {
  paths: Path[];
}

export function TopoEditor({ paths: inputPaths }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(500);
  const [currentPaths, setCurrentPaths] = useState<Path[]>(inputPaths);

  // Calculate bounding box of all paths
  const bbox = useMemo(() => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    inputPaths.forEach(path => {
      path.coordinates.forEach(([x, y]) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    });

    return { minX, minY, maxX, maxY };
  }, [inputPaths]);

  // Calculate dimensions and transformations
  const dimensions = useMemo(() => {
    const padding = 70; // Padding around the content
    const bboxWidth = bbox.maxX - bbox.minX;
    const bboxHeight = bbox.maxY - bbox.minY;
    const scale = Math.min(
      (500 - padding * 2) / bboxWidth,
      (500 - padding * 2) / bboxHeight
    );

    // Center the content
    const translateX = (500 - bboxWidth * scale) / 2 - bbox.minX * scale;
    const translateY = (500 - bboxHeight * scale) / 2 - bbox.minY * scale;

    return { scale, translateX, translateY };
  }, [bbox]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.min(
          Math.max(containerWidth, 320),
          800
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
  }, []);

  // Convert input paths to topology
  const geojson = useMemo(() => pathToGeoJSON(inputPaths), [inputPaths]); 

  const topo = useMemo(() => topology.topology({
    rectangles: geojson
  }), [geojson]);

  // console.log(topo);
  const [nodes, setNodes] = useState<TopoNode[]>([]);
  const [arcs, setArcs] = useState<MyArc[]>([]);

  // Initialize nodes and arcs
  useMemo(() => {
    const [initialNodes, initialArcs] = convertArcs(topo.arcs);
    // Convert MyPoint[] to TopoNode[] by adding arcIndices
    const topoNodes: TopoNode[] = initialNodes.map(node => ({
      ...node,
      arcIndices: [] // Initialize with empty array, will be populated later
    }));
    setNodes(topoNodes);
    setArcs(initialArcs);
  }, [topo]);

  useEffect(() => {
    // When nodes change, update the topology and convert back to paths
    if (nodes.length === 0 || arcs.length === 0) return;

    // Convert current arcs and nodes back to TopoJSON arcs
    const newTopoArcs = arcsToTopoArcs(arcs, nodes);

    // Create new topology with updated arcs
    const newTopo = {
      ...topo,
      arcs: newTopoArcs
    };

    // Convert back to paths and update state
    const newPaths = topoToGeoJSON(newTopo);
    setCurrentPaths(newPaths);
    // console.log('Current paths updated:', newPaths);
  }, [nodes, arcs, topo]);



  // Create path generator
  const line = useMemo(() => {
    return d3.line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveLinearClosed);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg 
        ref={svgRef} 
        width={width} 
        height={width} 
        viewBox="0 0 500 500"
        style={{ border: '1px solid #ccc', maxWidth: '100%' }}
      >
        <g transform={`translate(${dimensions.translateX},${dimensions.translateY}) scale(${dimensions.scale})`}>
      {/* Render paths */}
      <g>
        {currentPaths.map((path, i) => (
          <path
            key={path.id}
            d={line(path.coordinates) || ''}
            fill="none"
            stroke="black"
            strokeWidth={2}
          />
        ))}
      </g>

      {/* Render nodes */}
      <g>
        {nodes.map(node => (
          <DraggableNode
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            onDrag={(id, newX, newY) => {
              setNodes(prevNodes => {
                return prevNodes.map(node => 
                  node.id === id ? { ...node, x: newX, y: newY } : node
                );
              });
            }}
          />
        ))}
      </g>
        </g>
      </svg>
    </div>
  );
}