import type { Path } from "../types";
import type { FeatureCollection, Feature, GeoJsonProperties, GeometryObject, Polygon, GeometryCollection } from "geojson";
import type { Topology, GeometryObject as TopoGeometryObject, Polygon as TopoPolygon, ArcIndexes, Arc } from "topojson-specification";

function toFeature(path: Path): Feature<Polygon> {

    return {
        type: "Feature",
        properties: { id: path.id },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              ...path.coordinates
            ],
          ],
        },
      }
}

export const pathToGeoJSON = (paths: Path[]): FeatureCollection<Polygon> => {
  const features = paths.map(toFeature);
  return {
    type: "FeatureCollection",
    features,
  }
}

type MyPoint = {
    id: number,
    x: number,
    y: number
}

type MyArc = {
    id: number,
    points: MyPoint[]
}

type MyNode = {
    point: MyPoint,
    arcIds: number[]
}

type Dir = 1 | -1;

function convertArc(arc: Arc, idx: number, dir: Dir): MyArc[] {
    return arc.map((arc, i) => ({
        id: idx,

        points: arc.map(p => ({ id: i, x: p[0], y: p[1] }))
    }));
}

export const topoToNodes = (topo: Topology): any[] => {
  
    // const arcs = topo.arcs;

    // const topoPaths: any[] = [];

    const geometries = topo.objects.rectangles as TopoGeometryObject & { geometries?: TopoPolygon[] };

    const d = geometries.geometries?.map(g => {
        const arcIndices = g.arcs;

        if (arcIndices.length !== 1) {
            throw new Error("Arc indices must be of length 1. I'm not sure what do if they aren't");
        }

        const arcIndex: ArcIndexes = arcIndices[0];

        const arcs: [number, Dir][] = arcIndex.map((idx: number) => {
            const dir = idx < 0 ? -1 : 1;
            const arcIndex = idx < 0 ? topo.arcs.length + idx : idx;

            return [arcIndex, dir];
        }); 

        for (let i = 0; i < arcs.length; i++) {
            const [thisArcIndex, thisDir] = arcs[i];
            const [nextArcIndex, nextDir] = arcs[(i + 1) % arcs.length];
            
            const thisArcPoints = thisDir === 1 ? topo.arcs[thisArcIndex] : topo.arcs[thisArcIndex].reverse();
            const nextArcPoints = nextDir === 1 ? topo.arcs[nextArcIndex] : topo.arcs[nextArcIndex].reverse();

            if (thisArcPoints[thisArcPoints.length - 1] !== nextArcPoints[0]) {
                throw new Error("Arcs must be connected");
            }
        }
        






        console.log("BBBB", arcs);
        // const coordinates = arcs[arcIndex];
        // return coordinates;
    })


}
