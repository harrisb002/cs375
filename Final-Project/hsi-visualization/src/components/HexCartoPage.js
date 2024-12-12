// HexCartoPage.js
import React, { useState, useEffect } from 'react';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 1.0 });
const pointLight1 = new PointLight({ color: [255, 255, 255], intensity: 0.8, position: [-0.144528, 49.739968, 80000] });
const pointLight2 = new PointLight({ color: [255, 255, 255], intensity: 0.8, position: [-3.807751, 54.104682, 8000] });
const lightingEffect = new LightingEffect({ ambientLight, pointLight1, pointLight2 });

const INITIAL_VIEW_STATE = {
    longitude: 18.4241,
    latitude: -33.9249,
    zoom: 12,
    minZoom: 5,
    maxZoom: 15,
    pitch: 50,
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
    return `latitude: ${lat.toFixed(6)}\nlongitude: ${lng.toFixed(6)}\n${count} points\nElevation: ${object.elevationValue.toFixed(2)}`;
}

function calculateCentroid(coordinates) {
    let centroidLat = 0;
    let centroidLng = 0;
    coordinates.forEach(([lng, lat]) => {
        centroidLat += lat;
        centroidLng += lng;
    });
    const numPoints = coordinates.length;
    return { lat: centroidLat / numPoints, lng: centroidLng / numPoints };
}

export default function HexCartoPage() {
    const [hexData, setHexData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_BACKEND_URL;
                console.log('[HexCartoPage] Fetching polygons from:', backendUrl);

                const polygonsRes = await fetch(`${backendUrl}/api/polygons`);
                if (!polygonsRes.ok) throw new Error('Failed to fetch polygons');
                let polygons = await polygonsRes.json();
                console.log('[HexCartoPage] Fetched polygons count:', polygons.length);

                // Limit to first 100 polygons
                polygons = polygons.slice(0, 100);

                // Filter polygons
                const validPolygons = polygons.filter(
                    (polygon) => polygon.ground_truth_label && polygon.predicted_label_name
                );
                console.log('[HexCartoPage] Valid polygons count:', validPolygons.length);

                // Extract unique sample_nums
                const sampleNums = [...new Set(validPolygons.map(p => p.sample_num))];

                // Fetch only these samples
                const samplesUrl = `${backendUrl}/api/samples?sample_nums=${sampleNums.join(',')}`;
                const samplesRes = await fetch(samplesUrl);
                if (!samplesRes.ok) throw new Error('Failed to fetch samples');
                const samples = await samplesRes.json();
                console.log('[HexCartoPage] Fetched samples count:', samples.length);

                // Create sample map
                const sampleMap = samples.reduce((acc, s) => {
                    acc[s.Sample_num] = s;
                    return acc;
                }, {});

                // Construct hex data
                const hexPoints = validPolygons.map((polygon) => {
                    const centroid = calculateCentroid(polygon.coordinates);
                    const polySampleNum = polygon.sample_num;
                    const sample = sampleMap[polySampleNum];

                    let frequencyValue = 0;
                    if (sample) {
                        const freqKeys = Object.keys(sample).filter(key => key.startsWith('frq'));
                        frequencyValue = freqKeys.reduce((acc, k) => acc + (sample[k] || 0), 0);
                    }

                    return {
                        position: [centroid.lng, centroid.lat],
                        frequency: frequencyValue
                    };
                });

                console.log('[HexCartoPage] hexData length:', hexPoints.length);
                setHexData(hexPoints);
            } catch (error) {
                console.error('[HexCartoPage] Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // run once on mount

    const layer = new HexagonLayer({
        id: 'hexagon-layer',
        data: hexData,
        colorRange,
        coverage: 1,
        elevationRange: [0, 30000],
        elevationScale: hexData.length ? 200 : 1,
        extruded: true,
        getPosition: d => d.position,
        pickable: true,
        radius: 500,
        upperPercentile: 100,
        material: {
            ambient: 0.64,
            diffuse: 0.6,
            shininess: 32,
            specularColor: [51, 51, 51],
        },
        getColorValue: (points) => points.reduce((acc, p) => acc + p.frequency, 0),
        getElevationValue: (points) => points.reduce((acc, p) => acc + p.frequency, 0),
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
