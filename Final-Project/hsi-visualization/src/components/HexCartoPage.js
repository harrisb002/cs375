import React, { useState, useEffect } from 'react';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl'; // Import MapLibre for rendering maps

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0,
});

const pointLight1 = new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-0.144528, 49.739968, 80000],
});

const pointLight2 = new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-3.807751, 54.104682, 8000],
});

const lightingEffect = new LightingEffect({
    ambientLight,
    pointLight1,
    pointLight2,
});

const INITIAL_VIEW_STATE = {
    longitude: -1.415727,
    latitude: 52.232395,
    zoom: 6.6,
    minZoom: 5,
    maxZoom: 15,
    pitch: 40.5,
    bearing: -27,
};

const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
];

function getTooltip({ object }) {
    if (!object) return null;
    const lat = object.position[1];
    const lng = object.position[0];
    const count = object.points.length;

    return `\
  latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
  longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
  ${count} points`;
}

export default function HexCartoPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_BACKEND_URL;
                const polygonsRes = await fetch(`${backendUrl}/api/polygons`);
                if (!polygonsRes.ok) throw new Error('Failed to fetch polygons');
                const polygons = await polygonsRes.json();

                // Calculate centroids of polygons
                const centroids = polygons.map((polygon) => {
                    const coords = polygon.coordinates;
                    let latSum = 0, lngSum = 0;
                    coords.forEach(([lng, lat]) => {
                        latSum += lat;
                        lngSum += lng;
                    });
                    const count = coords.length;
                    return [lngSum / count, latSum / count];
                });

                setData(centroids.filter(c => c[0] && c[1])); // Filter out invalid centroids
            } catch (error) {
                console.error('Error fetching data for HexCartoPage:', error);
            }
        };

        fetchData();
    }, []);

    const layer = new HexagonLayer({
        id: 'hexagon-layer',
        data,
        colorRange,
        coverage: 1,
        elevationRange: [0, 3000],
        elevationScale: data.length ? 50 : 1,
        extruded: true,
        getPosition: d => d,
        pickable: true,
        radius: 1000,
        upperPercentile: 100,
        material: {
            ambient: 0.64,
            diffuse: 0.6,
            shininess: 32,
            specularColor: [51, 51, 51],
        },
        colorDomain: [0, 1], // Default domain to avoid invalid scale errors
        getColorValue: points => points.length,
        getElevationValue: points => points.length,
    });

    return (
        <DeckGL
            layers={[layer]}
            effects={[lightingEffect]}
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            getTooltip={getTooltip}
            style={{ position: 'relative', width: '100%', height: '100%' }}
        >
            <Map reuseMaps mapLib={maplibregl} mapStyle={MAP_STYLE} />
        </DeckGL>
    );
}
