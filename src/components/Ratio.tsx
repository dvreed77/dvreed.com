import { useEffect, useRef, useState } from "react";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import * as katex from "react-katex";
import { path } from "d3";
const { BlockMath } = katex;

const myState = atom({ a: 0, b: 0, pH: 0.5 });

const librarianColor = "#d97706";
const librarianColorLight = "#f59e0b";
const farmerColor = "#059669";
const farmerColorLight = "#10b981";

export const SliderH = () => {
  const $myState = useStore(myState);
  return (
    <div className="flex flex-row">
      <input
        className="flex-auto"
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => myState.set({ ...$myState, pH: +e.target.value })}
        value={$myState.pH}
      />
      {/* <div className="ml-2">
        <BlockMath math={`P(H) = ${$myState.pH.toFixed(1)}`} />
      </div> */}
    </div>
  );
};

export const SliderA = () => {
  const $myState = useStore(myState);
  return (
    <div className="flex flex-row">
      <input
        className="flex-auto"
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => myState.set({ ...$myState, a: +e.target.value })}
        value={$myState.a}
      />
      {/* <div className="ml-2">
        <BlockMath math={`P(B|A) = ${$myState.a.toFixed(1)}`} />
      </div> */}
    </div>
  );
};

export const SliderB = () => {
  const $myState = useStore(myState);
  return (
    <div className="flex flex-row">
      <input
        className="flex-auto"
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => myState.set({ ...$myState, b: +e.target.value })}
        value={$myState.b}
      />
      {/* <div className="ml-2">
        <BlockMath math={`P(B|\\bar{A}) = ${$myState.b.toFixed(1)}`} />
      </div> */}
    </div>
  );
};

export const Square1 = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState(0);
  const $myState = useStore(myState);

  const { pH, a, b } = $myState;

  useEffect(() => {
    const el = divRef.current;
    setSvgSize((el?.clientWidth ?? 0) / 3);
  }, []);

  return (
    <>
      <div ref={divRef}>
        <div className="flex flex-col justify-center">
          <svg width={svgSize} height={svgSize} className="mx-auto">
            <rect
              x={0}
              y={0}
              width={pH * svgSize}
              height={svgSize}
              fill={librarianColor}
            />
            <rect
              x={pH * svgSize}
              y={0}
              width={svgSize - pH * svgSize}
              height={svgSize}
              fill={farmerColor}
            />
            <rect
              x={0}
              y={svgSize * (1 - a)}
              width={pH * svgSize}
              height={a * svgSize}
              fill={librarianColorLight}
            />
            <rect
              x={pH * svgSize}
              y={svgSize * (1 - b)}
              width={svgSize - pH * svgSize}
              height={b * svgSize}
              fill={farmerColorLight}
            />
          </svg>
        </div>
      </div>

      {/* <div>
        <BlockMath math={`P(H) = ${pH}`} />
        <BlockMath math={`P(E|H) = ${b}`} />
        <BlockMath math={`P(H)P(E|H) = ${(b * pH).toFixed(2)}`} />
        <BlockMath math={`P(E|\\bar{H}) = ${a}`} />
        <BlockMath
          math={`P(\\bar{H})P(E|\\bar{H}) = ${(a * (1 - pH)).toFixed(2)}`}
        />
      </div> */}
    </>
  );
};

const Bracket = ({
  x1,
  x2,
  y1,
  y2,
}: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const mid = length / 2;
  const angle = Math.atan2(dy, dx);

  const w = 2;
  const p = path();
  p.moveTo(0, 0);
  p.lineTo(w, -w);
  p.lineTo(mid - w, -w);
  p.lineTo(mid, -w * 2);
  p.lineTo(mid + w, -w);
  p.lineTo(length - w, -w);
  p.lineTo(length, 0);

  const d = p.toString();

  return (
    <path
      d={d}
      stroke={"#ccc"}
      fill="none"
      transform={`translate(${x1}, ${y1}) rotate(${(angle * 180) / Math.PI})`}
    />
  );
};
export const Square2 = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState(0);
  const $myState = useStore(myState);

  const { pH, a } = $myState;

  useEffect(() => {
    const el = divRef.current;
    setSvgSize((el?.clientWidth ?? 0) / 5);
  }, []);

  const svgWidth = 800;
  const s = svgSize - 60;
  const width = pH * s;
  const height = Math.max(a * s, 5);

  return (
    <div ref={divRef}>
      <div className="flex flex-col justify-center">
        <svg width={svgWidth} height={svgSize} className="mx-auto">
          <g transform={`translate(${svgWidth / 2}, ${svgSize / 2})`}>
            <rect
              x={-width / 2}
              y={-height / 2}
              width={width}
              height={height}
              fill={librarianColorLight}
            />
            <Bracket
              x1={-width / 2 - 4}
              x2={-width / 2 - 4}
              y1={height / 2}
              y2={-height / 2}
            />

            <Bracket
              x1={-width / 2}
              x2={width / 2}
              y1={-height / 2 - 4}
              y2={-height / 2 - 4}
            />

            <text
              x={-width / 2 - 20}
              textAnchor="end"
              fontSize={15}
              alignmentBaseline="central"
            >
              P(B|A) = {a.toFixed(2)}
            </text>
            <text
              y={-height / 2 - 20}
              textAnchor="middle"
              fontSize={15}
              alignmentBaseline="central"
            >
              P(A) = {pH.toFixed(2)}
            </text>
            <text
              y={height / 2 + 20}
              textAnchor="middle"
              fontSize={15}
              alignmentBaseline="central"
            >
              P(A)P(B|A) = {(pH * a).toFixed(2)}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export const Square3 = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState(0);
  const $myState = useStore(myState);

  const { pH, b } = $myState;

  useEffect(() => {
    const el = divRef.current;
    setSvgSize((el?.clientWidth ?? 0) / 5);
  }, []);

  const svgWidth = 800;
  const s = svgSize - 60;

  // const width = svgSize - pH * svgSize;
  const width = (1 - pH) * s;
  // const height = b * svgSize;
  const height = Math.max(b * s, 5);

  return (
    <div ref={divRef}>
      <div className="flex flex-col justify-center">
        <svg width={svgWidth} height={svgSize} className="mx-auto">
          <g transform={`translate(${svgWidth / 2}, ${svgSize / 2})`}>
            <rect
              x={-width / 2}
              y={-height / 2}
              width={width}
              height={height}
              fill={farmerColorLight}
            />

            <Bracket
              x1={-width / 2 - 4}
              x2={-width / 2 - 4}
              y1={height / 2}
              y2={-height / 2}
            />

            <Bracket
              x1={-width / 2}
              x2={width / 2}
              y1={-height / 2 - 4}
              y2={-height / 2 - 4}
            />

            <text
              x={-width / 2 - 20}
              textAnchor="end"
              fontSize={15}
              alignmentBaseline="central"
            >
              P(B|Ā) = {b.toFixed(2)}
            </text>
            <text
              y={-height / 2 - 20}
              textAnchor="middle"
              fontSize={15}
              alignmentBaseline="central"
            >
              P(Ā) = {(1 - pH).toFixed(2)}
            </text>
            <text
              y={height / 2 + 20}
              textAnchor="middle"
              fontSize={15}
              alignmentBaseline="central"
            >
              P(Ā)P(B|Ā) = {((1 - pH) * b).toFixed(2)}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
