import type { FeatureCollection } from "geojson";
import type { Topology } from "topojson-specification";

export const rectanglesGeoJson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "left-rectangle" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [50, 50],
            [150, 50],
            [150, 250],
            [50, 250],
            [50, 50],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "right-rectangle" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [150, 50],
            [250, 50],
            [250, 250],
            [150, 250],
            [150, 50],
          ],
        ],
      },
    },
  ],
};

export const expectedTopo: Topology = {
  type: "Topology",
  objects: {
    rectangles: {
      type: "GeometryCollection",
      geometries: [
        {
          type: "Polygon",
          arcs: [[0, 1]],
          properties: {
            id: "left-rectangle",
          },
        },
        {
          type: "Polygon",
          arcs: [[2, -1]],
          properties: {
            id: "right-rectangle",
          },
        },
      ],
    },
  },
  arcs: [
    [
      [150, 50],
      [150, 250],
    ],
    [
      [150, 250],
      [50, 250],
      [50, 50],
      [150, 50],
    ],
    [
      [150, 50],
      [250, 50],
      [250, 250],
      [150, 250],
    ],
  ],
  bbox: [50, 50, 250, 250],
};
