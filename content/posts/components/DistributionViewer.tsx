import React from "react";
import * as d3 from "d3";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  VictoryScatter,
  VictoryArea,
  VictoryContainer,
} from "victory";
import { random2 } from "../utils/randomF";

function ScatterLine({ x, y, ...other }: { [key: string]: any }) {
  const yRange = other.scale.y.range();
  return (
    <line
      x1={x}
      x2={x}
      y1={yRange[0]}
      y2={yRange[1]}
      stroke={other.style.fill}
      opacity={other.style.opacity}
    />
  );
}

export function DistributionViewer({ f = (x) => 1, className }) {
  const [dimensions, setDimensions] = React.useState({
    width: 800,
    height: 200,
  });

  const [pdfData, setPdfData] = React.useState([]);
  const [cdfData, setCdfData] = React.useState([]);
  const [randomData, setRandomData] = React.useState([1, 2, 3]);

  const [scales, setScales] = React.useState({
    xScale: d3.scaleLinear(),
    yScale: d3.scaleLinear(),
  });

  const [params, setParams] = React.useState({
    start: 0.5,
    end: 0.5,
  });

  React.useEffect(() => {
    const rGen = new random2(f);
    // const nPts = 1000
    // const dx = 1 / (nPts - 1)

    // const pdfData: [number, number][] = Array.from({
    //   length: nPts,
    // }).map((_, idx) => [idx * dx, f(idx * dx)])

    // const cdfData: [number, number][] = pdfData
    //   .slice(1)
    //   .reduce((a, b) => [...a, [b[0], a[a.length - 1][1] + dx * b[1]]], [
    //     [0, 0],
    //   ])

    // const maxD = d3.max(cdfData, d => d[1])

    setPdfData(rGen.pdfData);
    setCdfData(rGen.cdfData);

    const r = [];
    for (let i = 0; i < 1000; i++) {
      r.push(rGen.sample());
    }

    setRandomData(r);
  }, []);

  React.useEffect(() => {
    setScales({
      xScale: d3.scaleLinear().domain([0, 1]).range([0, dimensions.width]),
      yScale: d3.scaleLinear().domain([0, 1]).range([dimensions.height, 0]),
    });
  }, [dimensions]);

  return (
    <div className={className}>
      <div className="flex flex-row flex-wrap justify-center">
        <div>
          <VictoryChart
            height={200}
            width={300}
            domainPadding={{ y: 5 }}
            containerComponent={<VictoryContainer responsive={false} />}
          >
            <VictoryLabel text="PDF" x={150} y={30} textAnchor="middle" />
            <VictoryArea
              style={{ data: { fill: "#bbb" } }}
              data={pdfData}
              x={(d) => d[0]}
              y={(d) => d[1]}
            />
            <VictoryLine
              x={(d) => d[0]}
              y={(d) => d[1]}
              data={pdfData}
              style={{
                data: {
                  strokeWidth: 1,
                },
              }}
            />
            <VictoryAxis
              tickLabelComponent={
                <VictoryLabel style={{ textAnchor: "end", fontSize: "10px" }} />
              }
              style={{
                axis: { stroke: "#756f6a" },
                axisLabel: { fontSize: 20, padding: 30 },
                ticks: { stroke: "grey", size: 5 },
                tickLabels: { fontSize: 15, padding: 5 },
              }}
            />
          </VictoryChart>
        </div>
        <div>
          <VictoryChart
            height={200}
            width={300}
            domainPadding={{ y: 5 }}
            containerComponent={<VictoryContainer responsive={false} />}
          >
            <VictoryLabel text="CDF" x={150} y={30} textAnchor="middle" />
            <VictoryArea
              style={{ data: { fill: "#bbb" } }}
              data={cdfData}
              x={(d) => d[0]}
              y={(d) => d[1]}
            />
            <VictoryLine
              x={(d) => d[0]}
              y={(d) => d[1]}
              data={cdfData}
              style={{
                data: {
                  strokeWidth: 1,
                },
              }}
            />
            <VictoryAxis
              tickLabelComponent={
                <VictoryLabel style={{ textAnchor: "end", fontSize: "10px" }} />
              }
              style={{
                axis: { stroke: "#756f6a" },
                axisLabel: { fontSize: 20, padding: 30 },
                ticks: { stroke: "grey", size: 5 },
                tickLabels: { fontSize: 15, padding: 5 },
              }}
            />
          </VictoryChart>
        </div>
        <div>
          <svg width={300} height={80}>
            <VictoryLabel text="Samples" x={150} y={60} textAnchor="middle" />
            <VictoryScatter
              standalone={false}
              x={(d) => d}
              y={(d) => 1}
              domain={{ y: [0, 2] }}
              size={3}
              style={{ data: { opacity: 0.1 } }}
              data={randomData}
              width={300}
              height={50}
              padding={10}
              dataComponent={<ScatterLine />}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
