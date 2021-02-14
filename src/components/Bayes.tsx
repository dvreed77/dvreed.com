import React, { useEffect, useState, useRef, useContext } from "react";
import { DataContext } from "./posts-page-layout";
import Color from "color";

export function Bayes() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [h, setH] = useState(0.2);
  const [evidenceGivenH, setEvidenceGivenH] = useState(0.4);
  const [evidenceGivenNotH, setEvidenceGivenNotH] = useState(0.2);
  const [active, setActive] = useState<string>();
  const [size, setSize] = useState(500);

  useEffect(() => {}, [h]);

  const [sharedData, setSharedData] = useContext(DataContext);

  React.useEffect(() => {
    setSharedData((sharedData) => ({
      ...sharedData,
      h,
      evidenceGivenH,
      evidenceGivenNotH,
    }));
  }, [h, evidenceGivenH, evidenceGivenNotH]);
  const hWidth = size * h;
  const evidenceGivenHHeight = size * evidenceGivenH;
  const evidenceGivenNotHHeight = size * evidenceGivenNotH;

  function onMouseMove(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const { clientX, clientY } = event;

    const svgElement = svgRef.current;

    if (!svgElement) return;

    const bb = svgElement.getBoundingClientRect();

    if (active === "H") {
      setH((clientX - bb.x) / size);
    } else if (active === "L1") {
      setEvidenceGivenH(1 - (clientY - bb.y) / size);
    } else if (active === "L2") {
      setEvidenceGivenNotH(1 - (clientY - bb.y) / size);
    }
  }
  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      onMouseMove={onMouseMove}
      onMouseUp={() => setActive(undefined)}
    >
      <rect
        x={0}
        y={0}
        width={hWidth}
        height={size}
        fill={Color("#264653").lighten(0.3).toString()}
      />
      <rect
        x={hWidth}
        y={0}
        width={size - hWidth}
        height={size}
        fill={Color("#2A9D8F").lighten(0.3).toString()}
      />
      <rect
        x={0}
        y={size - evidenceGivenHHeight}
        width={hWidth}
        height={evidenceGivenHHeight}
        fill="264653"
      />
      <rect
        x={hWidth}
        y={size - evidenceGivenNotHHeight}
        width={size - hWidth}
        height={evidenceGivenNotHHeight}
        fill="#2A9D8F"
      />

      {/* Hypothesis */}
      <line
        onMouseDown={() => setActive("H")}
        onMouseUp={() => setActive(undefined)}
        style={{ cursor: "ew-resize" }}
        x1={hWidth}
        x2={hWidth}
        y1={0}
        y2={size}
        strokeOpacity={0}
        stroke={"teal"}
        strokeWidth={20}
      />

      <line
        style={{ cursor: "ew-resize", pointerEvents: "none" }}
        x1={hWidth}
        x2={hWidth}
        y1={0}
        y2={size}
        stroke={"white"}
        strokeWidth={3}
      />

      {/* L1 */}
      <line
        onMouseDown={() => setActive("L1")}
        onMouseUp={() => setActive(undefined)}
        style={{ cursor: "ns-resize" }}
        x1={0}
        x2={hWidth}
        y1={size - evidenceGivenHHeight}
        y2={size - evidenceGivenHHeight}
        strokeOpacity={0}
        stroke={"teal"}
        strokeWidth={20}
      />

      <line
        style={{ cursor: "ns-resize" }}
        x1={0}
        x2={hWidth}
        y1={size - evidenceGivenHHeight}
        y2={size - evidenceGivenHHeight}
        stroke={"white"}
        strokeWidth={3}
      />

      {/* L2 */}
      <line
        onMouseDown={() => setActive("L2")}
        onMouseUp={() => setActive(undefined)}
        style={{ cursor: "ns-resize" }}
        x1={hWidth}
        x2={size}
        y1={size - evidenceGivenNotHHeight}
        y2={size - evidenceGivenNotHHeight}
        strokeOpacity={0}
        stroke={"teal"}
        strokeWidth={20}
      />
      <line
        style={{ cursor: "ns-resize" }}
        x1={hWidth}
        x2={size}
        y1={size - evidenceGivenNotHHeight}
        y2={size - evidenceGivenNotHHeight}
        stroke={"white"}
        strokeWidth={3}
      />
    </svg>
  );
}
