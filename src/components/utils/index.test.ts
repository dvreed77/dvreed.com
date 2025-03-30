import { describe, it, expect } from 'vitest';
import * as topojson from 'topojson-client';
import * as topology from 'topojson-server';
import type { Feature, FeatureCollection } from 'geojson';
import { rectanglesGeoJson, expectedTopo } from '../__tests__/fixtures/rectangles';
import { topoToNodes } from './index';

describe('dave', () => {
    it('should convert two rectangles to TopoJSON with shared edges', () => {

        const d = topoToNodes(expectedTopo);
        console.log(d);
        
      });
})