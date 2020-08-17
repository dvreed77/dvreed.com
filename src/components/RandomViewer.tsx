import React from "react"

export function RandomViewer({ data, height = 100 }) {
  const svgRef = React.useRef(null)
  return (
    <svg ref={svgRef} width={"100%"} height={height}>
      {data.map((d, idx) => (
        <line
          key={idx}
          x1={d}
          x2={d}
          y1={0}
          y2={100}
          stroke="black"
          opacity={0.1}
          strokeWidth="4"
        ></line>
      ))}
    </svg>
  )
}
