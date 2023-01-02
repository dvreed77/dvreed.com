import data from "../data/top_breweries.json";
import states from "../data/us-10m.json";
import capitals from "../data/us-state-capitals.json";
import { VegaLite, VisualizationSpec } from "react-vega";

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
  const spec: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 500,
    projection: {
      type: "albersUsa",
    },
    layer: [
      {
        data: {
          url: "https://raw.githubusercontent.com/vega/vega/main/docs/data/us-10m.json",
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
            mark: { type: "circle", tooltip: true },

            encoding: {
              color: { value: "red" },
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
    <VegaLite
      spec={spec}
      data={{
        // states,
        breweries: data,
      }}
      className="w-full"
      actions={false}
    />
  );
};
