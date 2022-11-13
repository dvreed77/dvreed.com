function Rectangle({ svgDims, rectDims, color }: any) {
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

export const SideBar = () => {
  const librarianColor = "#d97706";
  const librarianColorLight = "#f59e0b";
  const farmerColor = "#059669";
  const farmerColorLight = "#10b981";

  const p1 = 0.5;

  const pH = 0.5;
  const pNotH = 0.5;
  return (
    <div className="flex flex-row italic items-center text-2xl justify-center">
      <span>P</span>
      <span>(</span>
      <span style={{ color: librarianColor }}>H</span> <span>|</span>{" "}
      <span>E</span> <span>)</span>
      <span className="mx-3">=</span>
      <span className="flex flex-col text-center">
        <span className="flex flex-row items-center justify-center">
          <Rectangle
            svgDims={{ width: 100, height: 100 }}
            rectDims={{ width: p1, height: pH }}
            color={librarianColor}
          />
        </span>
        <span className="border-b border-black"></span>
        <span className="flex flex-row items-center">
          <Rectangle
            svgDims={{ width: 100, height: 100 }}
            rectDims={{ width: p1, height: pH }}
            color={librarianColor}
          />
          <span className="m-2">+</span>
          <Rectangle
            svgDims={{ width: 100, height: 100 }}
            rectDims={{
              width: 1 - p1,
              height: pNotH,
            }}
            color={farmerColor}
          />
        </span>
      </span>
      <span className="mx-3">=</span>
      {((p1 * pH) / (p1 * pH + (1 - p1) * pNotH)).toFixed(3)}
    </div>
  );
};
