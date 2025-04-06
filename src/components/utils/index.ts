import type { Path } from "../types";
import type { FeatureCollection, Feature, GeoJsonProperties, GeometryObject, Polygon, GeometryCollection } from "geojson";
import type { Topology, GeometryObject as TopoGeometryObject, Polygon as TopoPolygon, ArcIndexes, Arc, Objects, GeometryCollection as TopoGeometryCollection } from "topojson-specification";
import * as topojson from "topojson-client";

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

function isTopoPolygon(geometry: TopoGeometryObject): geometry is TopoPolygon {
    return geometry.type === "Polygon";
}

export const extractArcIndices = (topo: Topology<Objects<GeoJsonProperties>>) => {
    const collection = topo.objects.rectangles as TopoGeometryCollection;
    return collection.geometries
        .filter(isTopoPolygon)
        .map(g => g.arcs);
}

export type MyPoint = {
    id: number,
    x: number,
    y: number
}

export type MyArc = {
    id: number,
    pointIds: number[]
}

type Dir = 1 | -1;

export function arcsToTopoArcs(arcs: MyArc[], nodes: MyPoint[]): Arc[] {
    return arcs.map(arc => {
        // Convert point IDs to coordinates
        return arc.pointIds.map(id => {
            const point = nodes.find(n => n.id === id);
            if (!point) throw new Error(`Point with id ${id} not found`);
            return [point.x, point.y] as [number, number];
        });
    });
}

export function topoToGeoJSON(topo: Topology<Objects<GeoJsonProperties>>): Path[] {
    // console.log('Converting TopoJSON to GeoJSON:');
    // console.log('Topo:', topo);
    // console.log('Nodes:', nodes);
    // Convert topology back to GeoJSON feature collection
    const featureCollection = topojson.feature(topo, topo.objects.rectangles) as FeatureCollection<Polygon>;
    
    // Convert features to our Path format
    // console.log('FeatureCollection:', featureCollection);
    
    return featureCollection.features.map((feature, id) => {
        // Get the coordinates from the feature
        const coordinates = feature.geometry.coordinates[0]; // First array contains outer ring
        
        // Convert coordinates to our format
        // Note: We use the nodes array to get the exact positions that may have been updated
        // console.log(`Feature ${id} coordinates:`, coordinates);
        
        return {
            id,
            coordinates: coordinates.map(coord => coord as [number, number])
        };
    });
}

export function convertArcs(arcs: Arc[]): [MyPoint[], MyArc[]] {
    
    const nodes = new Map<string, MyPoint>();

    const newArcs = arcs.map((arc, i) => ({
        id: i,
        pointIds: arc.map(p => {
            const key = `${p[0]},${p[1]}`;
            // console.log("PPP", p, nodes, nodes.get(key))
            const node = nodes.get(key);
            if (node) {
                return node.id;
            }
            const newNode = { id: nodes.size, x: p[0], y: p[1] };
            nodes.set(key, newNode);
            return newNode.id;
        })
    }));

    return [Array.from(nodes.values()), newArcs];
}

export function arcsToPath(arcIndex: number[], arcs: MyArc[], nodes: MyPoint[]): [number, number][] {
    const result: [number, number][] = [];
    
    for (let i = 0; i < arcIndex.length; i++) {
        const idx = arcIndex[i];
        const isReverse = idx < 0;
        const arcIdx = (idx < 0 ? arcs.length - idx -1 : idx) % arcs.length;

        const arc = arcs[arcIdx];
        
        // Get point IDs for current arc, reversing if needed
        let pIds = isReverse ? [...arc.pointIds].reverse() : [...arc.pointIds];
        
        // If not the first arc, validate connection with previous arc
        if (i > 0) {
            const prevArc = result[result.length - 1];
            if (!prevArc) throw new Error('Previous arc point not found');
            
            const [prevX, prevY] = prevArc;
            const [currentX, currentY] = [nodes[pIds[0]].x, nodes[pIds[0]].y];
            
            if (prevX !== currentX || prevY !== currentY) {
                throw new Error(`Arc ${i} does not connect with previous arc at point [${currentX}, ${currentY}]`);
            }
            
            // Skip the first point as it's the same as the last point of previous arc
            pIds = pIds.slice(1);
        }
        
        // Add points to result
        pIds.forEach(pid => {
            result.push([nodes[pid].x, nodes[pid].y] as [number, number]);
        });
    }
    
    return result;
}