import React from "react";
import { random2 } from "./randomF";
import { VegaLite, type VisualizationSpec } from "react-vega";

interface IProps {
  f: string;
  className: string;
}

const funcs: { [k: string]: (x: number) => number } = {
  f1: (x: number) => 1,
  f2: (x) => x,
  fGaussian: (x) => Math.exp(-0.5 * ((x - 0.5) / 0.1) ** 2),
  f3: (x) => x ** 3,
  f4: (x) => x ** 3 + 0.2,
  f5: (x) => x ** 2 + (1 - x) ** 10,
  f6: (x) => (x > 0 ? x / x ** 2 : 0),
  f7: (x) => 1 + Math.cos(2 * Math.PI * x),
  f8: (x) => 1 + Math.cos(2 * Math.PI * x + Math.PI),
};
export function DistributionViewer({ f = "f1", className }: IProps) {
  const [pdfData, setPdfData] = React.useState<[number, number][]>([]);
  const [cdfData, setCdfData] = React.useState<[number, number][]>([]);
  const [randomData, setRandomData] = React.useState([1, 2, 3]);

  const f2 = funcs[f];

  React.useEffect(() => {
    // if (!f) return;
    const rGen = new random2(f2);
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

  const spec: VisualizationSpec = {
    width: "container",
    height: 30,
    mark: "rule",
    encoding: {
      x: { field: "x", type: "quantitative", scale: { domain: [0, 1] } },
      color: { value: "black" },
      opacity: { value: 0.4 },
      size: { value: 0.2 },
    },
    data: { name: "table" }, // note: vega-lite data attribute is a plain object instead of an array
    config: {
      axisLeft: { domain: false, grid: false, ticks: false, disable: true },
    },
  };

  const spec2: VisualizationSpec = {
    title: { text: "PDF", align: "left" },
    width: "container",
    height: 150,
    mark: "line",
    encoding: {
      x: { field: "x", type: "quantitative", scale: { domain: [0, 1] } },
      y: {
        field: "y",
        type: "quantitative",
        scale: { domain: [0, Math.max(...pdfData.map((d) => d[1])) + 0.1] },
      },
      color: { value: "black" },
      opacity: { value: 0.4 },
      size: { value: 1 },
    },
    data: { name: "table" }, // note: vega-lite data attribute is a plain object instead of an array
    config: {
      axis: { domain: false, grid: false, ticks: false, disable: true },
    },
  };

  const barData = {
    table: randomData.map((d) => ({ x: d })),
  };
  const barData2 = {
    table: pdfData.map((d) => ({ x: d[0], y: d[1] })),
  };

  return (
    <div>
      <VegaLite
        spec={spec2}
        data={barData2}
        actions={false}
        className="w-full"
      />
      <VegaLite spec={spec} data={barData} actions={false} className="w-full" />
    </div>
  );
}
