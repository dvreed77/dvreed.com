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

export default function TopoEditor({ paths: inputPaths }: IProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentPaths, setCurrentPaths] = useState<Path[]>(inputPaths);

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
    <svg 
      ref={svgRef} 
      width={500} 
      height={500} 
      viewBox="0 0 500 500"
      style={{ border: '1px solid #ccc' }}
    >
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
    </svg>
  );
}