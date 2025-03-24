import data from "../data/top_breweries.json";
import states from "../data/us-10m.json";
import type { TopLevelSpec } from "vega-lite";
import { VegaLite } from "react-vega";

export const SimpleTable = () => {
  return (
    <div className="overflow-x-auto not-prose">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="text-left"></th>
            <th className="text-left">City</th>
            <th className="text-right">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ city, state, count }, i) => (
            <tr key={i}>
              <th className="text-left">{i + 1}</th>
              <td className="text-left">
                {city}, {state}
              </td>
              <td className="text-right">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const MapViewer = () => {
  const spec: TopLevelSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 400,
    autosize: {
      type: "fit",
      contains: "padding"
    },
    config: {
      legend: { disable: true },
      view: { stroke: null, fill: "rgba(255, 255, 255, 0.5)" },
      background: ""
    },
    projection: {
      type: "albersUsa"
    },
    layer: [
      {
        data: {
          values: states,
          format: {
            type: "topojson",
            feature: "states",
          },
        },
        mark: {
          type: "geoshape",
          fill: "#d1d5db",
          stroke: "#f3f4f6",
        },
      },
      {
        data: { name: "breweries" },
        encoding: {
          longitude: {
            field: "lon",
            type: "quantitative",
          },
          latitude: {
            field: "lat",
            type: "quantitative",
          },
        },
        layer: [
          {
            mark: { 
              type: "circle", 
              tooltip: true,
              strokeWidth: 1,
              opacity: 1,
              size: 150
            },

            encoding: {
              color: {
                field: "count",
                type: "quantitative",
                scale: {
                  scheme: "oranges"
                },
                legend: {
                  orient: "top-right",
                  direction: "horizontal",
                  values: [30, 90],
                  title: null,
                  labelExpr: "datum.value + ' breweries'"
                }
              },
              size: {
                field: "count",
                type: "quantitative",
              },
              tooltip: [
                { field: "city", type: "nominal", title: "City" },
                { field: "count", type: "quantitative", title: "# Breweries" },
              ],
            },
          },
          {
            mark: {
              type: "text",
              dy: -10,
            },
            encoding: {
              text: { field: "city", type: "nominal" },
              size: { value: 10 }
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full max-h-[500px] overflow-hidden rounded-lg border border-gray-200">
      <VegaLite
        spec={spec}
        data={{
          breweries: data.map(d => {
            const coords = {
              ...d,
              lon: parseFloat(d.lon),
              lat: parseFloat(d.lat)
            };
            return coords;
          }),
        }}
        className="w-full"
        actions={false}
      />
    </div>
  );
};
