import { describe, it, expect } from 'vitest';
import * as topojson from 'topojson-client';
import * as topology from 'topojson-server';
import type { Feature, FeatureCollection } from 'geojson';
import { rectanglesGeoJson, expectedTopo } from './fixtures/rectangles';

describe('GeoJSON to TopoJSON conversion', () => {
  it('should convert two rectangles to TopoJSON with shared edges', () => {
    const geoJson = rectanglesGeoJson as FeatureCollection;

    // Convert GeoJSON to TopoJSON
    const topo = topology.topology({
      rectangles: geoJson
    });

    // Verify the structure
    expect(topo.type).toBe('Topology');
    expect(topo.objects).toBeDefined();
    expect(topo.objects.rectangles).toBeDefined();
    expect(topo.arcs).toBeDefined();

    // Convert back to GeoJSON to verify data integrity
    const backToGeo = topojson.feature(topo, topo.objects.rectangles) as FeatureCollection;
    expect(backToGeo.type).toBe('FeatureCollection');
    expect(backToGeo.features).toHaveLength(2);

    expect(topo).toEqual(expectedTopo);
  });
});
