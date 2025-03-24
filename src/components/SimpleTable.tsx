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
            <th></th>
            <th>City</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ city, state, count }, i) => (
            <tr key={i}>
              <th>{i + 1}</th>
              <td>
                {city}, {state}
              </td>
              <td>{count}</td>
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
    height: 500,
    projection: {
      type: "albersUsa",
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
          fill: "lightgray",
          stroke: "white",
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
              opacity: 1
            },

            encoding: {
              stroke: {
                field: "count",
                type: "quantitative",
                scale: {
                  scheme: "oranges"
                }
              },
              color: {
                field: "count",
                type: "quantitative",
                scale: {
                  scheme: "oranges"
                },
                legend: {
                  title: "Number of Breweries"
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
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full h-[500px] overflow-hidden rounded-lg border border-gray-200">
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
