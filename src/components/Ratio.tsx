import { useEffect, useRef, useState } from "react";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import { path } from "d3";

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
    </div>
  );
};

export const Square1 = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(0);
  const $myState = useStore(myState);

  const { pH, a, b } = $myState;

  useEffect(() => {
    const el = divRef.current;
    const a = el?.clientWidth ?? 0;
    setSvgWidth(Math.min(a, 400));
  }, []);

  const squareSize = svgWidth / 3;
  const svgHeight = squareSize + 40;

  const pA = Math.max(a * squareSize, 10);
  const pB = Math.max(b * squareSize, 10);

  return (
    <>
      <div ref={divRef}>
        <div className="flex flex-col justify-center">
          <svg width={svgWidth} height={svgHeight} className="mx-auto">
            <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
              <rect
                x={-squareSize / 2}
                y={-squareSize / 2}
                width={pH * squareSize}
                height={squareSize}
                fill={librarianColor}
              />
              <rect
                x={pH * squareSize - squareSize / 2}
                y={-squareSize / 2}
                width={(1 - pH) * squareSize}
                height={squareSize}
                fill={farmerColor}
              />
              <rect
                x={-squareSize / 2}
                y={squareSize - pA - squareSize / 2}
                width={pH * squareSize}
                height={pA}
                fill={librarianColorLight}
              />
              <rect
                x={pH * squareSize - squareSize / 2}
                y={squareSize - pB - squareSize / 2}
                width={(1 - pH) * squareSize}
                height={pB}
                fill={farmerColorLight}
              />
              <Bracket
                x1={-squareSize / 2 - 4}
                x2={-squareSize / 2 - 4}
                y1={squareSize / 2}
                y2={squareSize / 2 - pA}
              />

              <Bracket
                x1={squareSize / 2 + 4}
                x2={squareSize / 2 + 4}
                y1={squareSize / 2 - pB}
                y2={squareSize / 2}
              />

              <text
                x={-squareSize / 2 - 20}
                y={squareSize / 2 - pA / 2}
                textAnchor="end"
                fontSize={15}
                alignmentBaseline="central"
              >
                P(B|A) = {a.toFixed(2)}
              </text>

              <text
                x={squareSize / 2 + 20}
                y={squareSize / 2 - pB / 2}
                textAnchor="start"
                fontSize={15}
                alignmentBaseline="central"
              >
                P(B|Ā) = {b.toFixed(2)}
              </text>
            </g>
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
  const [clientWidth, setClientWidth] = useState(0);
  const $myState = useStore(myState);

  const { pH, a } = $myState;

  useEffect(() => {
    const el = divRef.current;
    setClientWidth(el?.clientWidth ?? 0);
  }, []);

  const maxWidth = Math.min(clientWidth, 300);
  const s = maxWidth / 2;
  const width = pH * s;
  const height = Math.max(a * s, 5);

  return (
    <div ref={divRef}>
      <div className="flex flex-col justify-center">
        <svg width={clientWidth} height={maxWidth} className="mx-auto">
          <g transform={`translate(${clientWidth / 2}, ${maxWidth / 2})`}>
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
  const [clientWidth, setClientWidth] = useState(0);
  const $myState = useStore(myState);

  const { pH, b } = $myState;

  useEffect(() => {
    const el = divRef.current;
    setClientWidth(el?.clientWidth ?? 0);
  }, []);

  const maxWidth = Math.min(clientWidth, 300);
  const s = maxWidth / 2;

  const width = (1 - pH) * s;
  const height = Math.max(b * s, 5);

  return (
    <div ref={divRef}>
      <div className="flex flex-col justify-center">
        <svg width={clientWidth} height={maxWidth} className="mx-auto">
          <g transform={`translate(${clientWidth / 2}, ${maxWidth / 2})`}>
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

export const Divide = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [clientWidth, setClientWidth] = useState(0);
  const $myState = useStore(myState);

  const { pH, a, b } = $myState;

  useEffect(() => {
    const el = divRef.current;
    setClientWidth(el?.clientWidth ?? 0);
  }, []);

  const maxWidth = Math.min(clientWidth, 300);

  const rSize = maxWidth / 4;

  const width1 = pH * rSize;
  const height1 = Math.max(a * rSize, 5);

  const width2 = (1 - pH) * rSize;
  const height2 = Math.max(b * rSize, 5);

  let total = (a * pH) / (a * pH + b * (1 - pH));

  return (
    <div ref={divRef}>
      <div className="flex flex-col justify-center">
        <svg width={clientWidth} height={maxWidth} className="mx-auto">
          <g transform={`translate(${clientWidth / 2}, ${maxWidth / 2})`}>
            <text
              textAnchor="end"
              alignmentBaseline="central"
              fill="gray"
              x={-maxWidth / 2 - 10}
            >
              P(A|B) =
            </text>
            <text
              textAnchor="start"
              alignmentBaseline="central"
              fill="gray"
              x={maxWidth / 2 + 10}
            >
              = {total.toPrecision(2)}
            </text>
            <g id="top" transform={`translate(0,${-rSize})`}>
              <rect
                x={-width1 / 2}
                y={-height1 / 2}
                width={width1}
                height={height1}
                fill={librarianColorLight}
              />

              <text
                textAnchor="middle"
                alignmentBaseline="central"
                fill={librarianColorLight}
                style={{ mixBlendMode: "exclusion" }}
              >
                P(A)P(B|A)
              </text>
            </g>

            <line
              stroke="gray"
              x1={-maxWidth / 2}
              x2={maxWidth / 2}
              y1={0}
              y2={0}
            />

            <g id="bottom-left" transform={`translate(${-rSize},${rSize})`}>
              <rect
                x={-width1 / 2}
                y={-height1 / 2}
                width={width1}
                height={height1}
                fill={librarianColorLight}
              />
              <text
                textAnchor="middle"
                alignmentBaseline="central"
                fill={librarianColorLight}
                style={{ mixBlendMode: "exclusion" }}
              >
                P(A)P(B|A)
              </text>
            </g>
            <text x={0} y={rSize} fontSize={30} fill="gray">
              +
            </text>
            <g id="bottom-right" transform={`translate(${rSize},${rSize})`}>
              <rect
                x={-width2 / 2}
                y={-height2 / 2}
                width={width2}
                height={height2}
                fill={farmerColorLight}
              />
              <text
                textAnchor="middle"
                alignmentBaseline="central"
                fill={farmerColorLight}
                style={{ mixBlendMode: "exclusion" }}
              >
                P(Ā)P(B|Ā)
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export const Divide2 = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [clientWidth, setClientWidth] = useState(0);

  let pH = 0.01;
  let a = 0.9;
  let b = 0.096;

  useEffect(() => {
    const el = divRef.current;
    setClientWidth(el?.clientWidth ?? 0);
  }, []);

  const maxWidth = Math.min(clientWidth, 300);

  const rSize = maxWidth / 4;

  const width1 = pH * rSize;
  const height1 = Math.max(a * rSize, 5);

  const width2 = (1 - pH) * rSize;
  const height2 = Math.max(b * rSize, 5);

  let total = (a * pH) / (a * pH + b * (1 - pH));

  return (
    <div ref={divRef}>
      <div className="flex flex-col justify-center">
        <svg width={clientWidth} height={maxWidth} className="mx-auto">
          <g transform={`translate(${clientWidth / 2}, ${maxWidth / 2})`}>
            <text
              textAnchor="end"
              alignmentBaseline="central"
              fill="gray"
              x={-maxWidth / 2 - 10}
            >
              P(A|B) =
            </text>
            <text
              textAnchor="start"
              alignmentBaseline="central"
              fill="gray"
              x={maxWidth / 2 + 10}
            >
              = {total.toPrecision(2)}
            </text>
            <g id="top" transform={`translate(0,${-rSize})`}>
              <rect
                x={-width1 / 2}
                y={-height1 / 2}
                width={width1}
                height={height1}
                fill={librarianColorLight}
              />

              <text
                textAnchor="middle"
                alignmentBaseline="central"
                fill={librarianColorLight}
                style={{ mixBlendMode: "exclusion" }}
              >
                P(A)P(B|A)
              </text>
            </g>

            <line
              stroke="gray"
              x1={-maxWidth / 2}
              x2={maxWidth / 2}
              y1={0}
              y2={0}
            />

            <g id="bottom-left" transform={`translate(${-rSize},${rSize})`}>
              <rect
                x={-width1 / 2}
                y={-height1 / 2}
                width={width1}
                height={height1}
                fill={librarianColorLight}
              />
              <text
                textAnchor="middle"
                alignmentBaseline="central"
                fill={librarianColorLight}
                style={{ mixBlendMode: "exclusion" }}
              >
                P(A)P(B|A)
              </text>
            </g>
            <text x={0} y={rSize} fontSize={30} fill="gray">
              +
            </text>
            <g id="bottom-right" transform={`translate(${rSize},${rSize})`}>
              <rect
                x={-width2 / 2}
                y={-height2 / 2}
                width={width2}
                height={height2}
                fill={farmerColorLight}
              />
              <text
                textAnchor="middle"
                alignmentBaseline="central"
                fill={farmerColorLight}
                style={{ mixBlendMode: "exclusion" }}
              >
                P(Ā)P(B|Ā)
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
