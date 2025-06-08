#!/bin/bash

set -e

# Set output directory
OUTDIR="/Users/dreed/code/dvreed.com/public"
SIMPLIFY=0.0001

for gpx_file in "$@"; do
    base_name=$(basename "$gpx_file" .gpx)
    output_file="${OUTDIR}/${base_name}.geojson"

    echo "Converting $gpx_file to $output_file..."
    ogr2ogr -f GeoJSON -simplify "$SIMPLIFY" "$output_file" "$gpx_file" tracks
done

echo "✅ All files converted."