import { describe, it, expect } from "vitest";

// Epsilon for geometric comparisons (1e-10 is a good value for coordinates in the 0-1000 range)
const GEOMETRIC_EPSILON = 1e-10;

// Helper function to check if two paths are cyclically equivalent
function arePathsEquivalent(path1: [number, number][], path2: [number, number][]): boolean {
    if (path1.length !== path2.length) return false;

    // Remove the last point if it's the same as the first (closing point)
    const p1 = path1[path1.length - 1][0] === path1[0][0] && path1[path1.length - 1][1] === path1[0][1] 
        ? path1.slice(0, -1) : path1;
    const p2 = path2[path2.length - 1][0] === path2[0][0] && path2[path2.length - 1][1] === path2[0][1]
        ? path2.slice(0, -1) : path2;

    if (p1.length !== p2.length) return false;

    // Try all possible rotations of p2
    for (let i = 0; i < p2.length; i++) {
        const rotated = [...p2.slice(i), ...p2.slice(0, i)];
        if (p1.every((point, j) => 
            Math.abs(point[0] - rotated[j][0]) < GEOMETRIC_EPSILON && 
            Math.abs(point[1] - rotated[j][1]) < GEOMETRIC_EPSILON
        )) {
            return true;
        }
    }

    return false;
}
import { arcsToPath, convertArcs, pathToGeoJSON, topoToGeoJSON } from "./index";
import * as topology from "topojson-server";

const inputArcs = [
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
];

const expectedNodes = [
  {
    id: 0,
    x: 150,
    y: 50,
  },
  {
    id: 1,
    x: 150,
    y: 250,
  },
  {
    id: 2,
    x: 50,
    y: 250,
  },
  {
    id: 3,
    x: 50,
    y: 50,
  },
  {
    id: 4,
    x: 250,
    y: 50,
  },
  {
    id: 5,
    x: 250,
    y: 250,
  },
];

const expectedArcs = [
  {
    id: 0,
    pointIds: [0, 1],
  },
  {
    id: 1,
    pointIds: [1, 2, 3, 0],
  },
  {
    id: 2,
    pointIds: [0, 4, 5, 1],
  },
];

describe("convertArcs", () => {
  it("should convert arcs to nodes and arcs", () => {
    const [nodes, arcs] = convertArcs(inputArcs);

    expect(nodes).toEqual(expectedNodes);
    expect(arcs).toEqual(expectedArcs);
  });


});

describe("arcsToPath", () => {
    it("should convert arcs to paths", () => {
        const [nodes, arcs] = convertArcs(inputArcs);

        const arcIndices = [0, 1];
        const path = arcsToPath(arcIndices, arcs, nodes);
        expect(path).toEqual([[150, 50], [150, 250], [50, 250], [50, 50], [150, 50]]);

        const arcIndices2 = [2, -1];
        const path2 = arcsToPath(arcIndices2, arcs, nodes);
        expect(path2).toEqual([[150, 50], [250, 50], [250, 250], [150, 250], [150, 50]]);
    });
});

describe("roundtrip conversion", () => {
    it("should correctly convert from GeoJSON to TopoJSON and back", () => {
        // Initial paths
        const initialPaths = [
            {
                id: 0,
                coordinates: [
                    [50, 50] as [number, number],
                    [150, 50] as [number, number],
                    [150, 250] as [number, number],
                    [50, 250] as [number, number],
                    [50, 50] as [number, number]
                ] as [number, number][]
            },
            {
                id: 1,
                coordinates: [
                    [150, 50] as [number, number],
                    [250, 50] as [number, number],
                    [250, 250] as [number, number],
                    [150, 250] as [number, number],
                    [150, 50] as [number, number]
                ] as [number, number][]
            }
        ];

        // Convert to GeoJSON
        const geojson = pathToGeoJSON(initialPaths);

        // Convert to TopoJSON
        const topo = topology.topology({
            rectangles: geojson
        });

        // Extract nodes from topology
        const [nodes] = convertArcs(topo.arcs);

        // Convert back to GeoJSON/Paths
        const finalPaths = topoToGeoJSON(topo);

        // Verify the roundtrip
        expect(finalPaths.length).toBe(initialPaths.length);
        
        // Compare each path, accounting for cyclic equivalence
        finalPaths.forEach((finalPath, i) => {
            const initialPath = initialPaths[i];
            expect(finalPath.id).toBe(initialPath.id);
            expect(arePathsEquivalent(finalPath.coordinates, initialPath.coordinates)).toBe(true);
        });
    });
});
