import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { MyPoint } from './utils';

interface Props extends MyPoint {
  onDrag: (id: number, x: number, y: number) => void;
}

export default function DraggableNode({ id, x, y, onDrag }: Props) {
  const nodeRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!nodeRef.current) return;

    const drag = d3.drag<SVGCircleElement, unknown>()
      .on('drag', (event) => {
        onDrag(id, event.x, event.y);
      });

    d3.select(nodeRef.current).call(drag);
  }, [id, onDrag]);

  return (
    <circle
      ref={nodeRef}
      cx={x}
      cy={y}
      r={4}
      style={{ cursor: 'move' }}
    />
  );
}
