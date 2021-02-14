import React, { useContext } from "react";
import { DataContext } from "./posts-page-layout";
import { cx, css } from "emotion";

function Rectangle({ svgDims, rectDims, color }) {
  const { width: svgWidth, height: svgHeight } = svgDims;
  const { width, height } = rectDims;
  return (
    <svg width={svgWidth} height={svgHeight}>
      <g
        transform={`translate(${svgWidth / 2}, ${
          svgHeight / 2
        }) scale(${svgWidth})`}
      >
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          fill={color}
        />
      </g>
    </svg>
  );
}
export function SharedState() {
  const [sharedData, setSharedData] = useContext(DataContext);

  const { h, evidenceGivenH, evidenceGivenNotH } = sharedData;

  return (
    <div>
      <div>P(H): {h}</div>
      <div>P(E | H): {evidenceGivenH}</div>
      <div>P(E | not H): {evidenceGivenNotH}</div>

      <div
        className={cx(
          "flex flex-row italic items-center text-5xl",
          css`
            font-family: "Times New Roman", Times, serif;
          `
        )}
      >
        <span>P</span>
        <span>(</span>
        <span className="text-yellow-500">H</span> <span>|</span>{" "}
        <span className="text-blue-500">E</span> <span>)</span>
        <span>=</span>
        <span className="flex flex-col text-center">
          <span className="flex flex-row items-center justify-center">
            <Rectangle
              svgDims={{ width: 100, height: 100 }}
              rectDims={{ width: h, height: evidenceGivenH }}
              color="red"
            />
          </span>
          <span className="border-b-2 border-black"></span>
          <span className="flex flex-row items-center">
            <Rectangle
              svgDims={{ width: 100, height: 100 }}
              rectDims={{ width: h, height: evidenceGivenH }}
              color="red"
            />
            <span className="m-2">+</span>

            <Rectangle
              svgDims={{ width: 100, height: 100 }}
              rectDims={{ width: 1 - h, height: evidenceGivenNotH }}
              color="green"
            />
          </span>
        </span>
      </div>
    </div>
  );
}
