// MapContainer.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const defaultCenter = {
    lat: -33.9249,
    lng: 18.4241,
};

const greenIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
const redIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

const calculateCentroid = (coordinates) => {
    let centroidLat = 0;
    let centroidLng = 0;

    coordinates.forEach(([lng, lat]) => {
        centroidLat += lat;
        centroidLng += lng;
    });

    const numPoints = coordinates.length;
    return {
        lat: centroidLat / numPoints,
        lng: centroidLng / numPoints,
    };
};

export default function MapContainer({
    selectedCategory,
    selectedScatterMarkers,
    setSelectedScatterMarkers,
    selectedBarMarkers,
    setSelectedBarMarkers,
    showHexLayer,
    setShowHexLayer
}) {
    const [markers, setMarkers] = useState([]);
    const [selectedMarkerInfo, setSelectedMarkerInfo] = useState(null);
    const [hexData, setHexData] = useState([]);
    const mapRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_BACKEND_URL;

                // Fetch polygons
                const polygonsRes = await fetch(`${backendUrl}/api/polygons`);
                if (!polygonsRes.ok) throw new Error('Failed to fetch polygons');
                const polygons = await polygonsRes.json();

                // Fetch all samples
                const samplesRes = await fetch(`${backendUrl}/api/samples`);
                if (!samplesRes.ok) throw new Error('Failed to fetch samples');
                const samples = await samplesRes.json();

                // Create a lookup for samples keyed by Sample_num
                const sampleMap = samples.reduce((acc, s) => {
                    acc[s.Sample_num] = s;
                    return acc;
                }, {});

                // Filter polygons that have ground_truth_label and predicted_label_name
                const validPolygons = polygons.filter(
                    (polygon) => polygon.ground_truth_label && polygon.predicted_label_name
                );

                // Prepare markers for normal view
                const centroids = validPolygons.map((polygon) => ({
                    sample_num: polygon.sample_num,
                    position: calculateCentroid(polygon.coordinates),
                    groundTruthLabel: polygon.ground_truth_label,
                    predictedLabel: polygon.predicted_label_name,
                }));
                setMarkers(centroids);

                // Prepare data for hex layer
                const hexPoints = validPolygons.map((polygon) => {
                    const centroid = calculateCentroid(polygon.coordinates);
                    const sample = sampleMap[polygon.sample_num];

                    let frequencyValue = 0;
                    if (sample) {
                        // Sum all frequency fields (frq0, frq1, ...)
                        frequencyValue = Object.keys(sample)
                            .filter(key => key.startsWith('frq'))
                            .reduce((acc, key) => acc + sample[key], 0);
                    }

                    return {
                        position: [centroid.lng, centroid.lat],
                        frequency: frequencyValue
                    };
                });

                setHexData(hexPoints);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredMarkers = selectedCategory
        ? markers.filter((marker) => marker.groundTruthLabel === selectedCategory)
        : markers;

    const addToScatterList = (marker) => {
        if (!selectedScatterMarkers.some((m) => m.sample_num === marker.sample_num)) {
            setSelectedScatterMarkers([...selectedScatterMarkers, marker]);
        }
    };

    const addToBarList = (marker) => {
        if (!selectedBarMarkers.some((m) => m.sample_num === marker.sample_num)) {
            setSelectedBarMarkers([...selectedBarMarkers, marker]);
        }
    };

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
        // Use satellite for better 3D perspective
        map.setMapTypeId('satellite');

        // Attempt to enable tilt (3D view)
        map.addListener('tilesloaded', () => {
            map.setTilt(45);
        });

        // If hex layer is shown at load and we have data
        if (showHexLayer && hexData.length > 0) {
            const overlay = createHexOverlay(map, hexData);
            overlayRef.current = overlay;
        }
    }, [showHexLayer, hexData]);

    useEffect(() => {
        if (!mapRef.current) return;

        if (showHexLayer && hexData.length > 0) {
            const overlay = createHexOverlay(mapRef.current, hexData);
            overlayRef.current = overlay;
        } else {
            // Hide hex layer
            if (overlayRef.current) {
                overlayRef.current.setMap(null);
                overlayRef.current = null;
            }
        }
    }, [showHexLayer, hexData]);

    function createHexOverlay(map, data) {
        const hexLayer = new HexagonLayer({
            id: 'hexagon-layer',
            data,
            extruded: true,
            elevationScale: 200,
            pickable: true,
            radius: 500,
            coverage: 1,
            upperPercentile: 100,
            // Aggregate frequencies to determine elevation and color
            getElevationValue: (points) => points.reduce((acc, p) => acc + p.frequency, 0),
            getColorValue: (points) => points.reduce((acc, p) => acc + p.frequency, 0),
            colorRange: [
                [1, 152, 189],
                [73, 227, 206],
                [216, 254, 181],
                [254, 237, 177],
                [254, 173, 84],
                [209, 55, 78]
            ],
            material: {
                ambient: 0.64,
                diffuse: 0.6,
                shininess: 32,
                specularColor: [51, 51, 51]
            },
            parameters: {
                depthTest: true
            },
            getPosition: d => d.position,
            getTooltip: ({ object }) => object &&
                `Count: ${object.points.length}\nFreq Sum: ${object.elevationValue.toFixed(3)}`
        });

        const overlay = new GoogleMapsOverlay({
            layers: [hexLayer]
        });

        overlay.setMap(map);
        return overlay;
    }

    return (
        <div style={{ position: 'relative' }}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={12}
                    onLoad={onMapLoad}
                >
                    {!showHexLayer && filteredMarkers.map((marker, index) => {
                        const icon =
                            marker.groundTruthLabel === marker.predictedLabel
                                ? greenIcon
                                : redIcon;
                        return (
                            <Marker
                                key={index}
                                position={marker.position}
                                icon={icon}
                                onClick={() => setSelectedMarkerInfo(marker)}
                            />
                        );
                    })}

                    {selectedMarkerInfo && !showHexLayer && (
                        <InfoWindow
                            position={selectedMarkerInfo.position}
                            onCloseClick={() => setSelectedMarkerInfo(null)}
                        >
                            <div>
                                <h3>Sample Number</h3>
                                <p>{selectedMarkerInfo.sample_num}</p>
                                <h3>Ground Truth Label</h3>
                                <p>{selectedMarkerInfo.groundTruthLabel}</p>
                                <h3>Predicted Label</h3>
                                <p>{selectedMarkerInfo.predictedLabel}</p>

                                <button
                                    onClick={() => addToScatterList(selectedMarkerInfo)}
                                    style={{
                                        marginTop: '10px',
                                        padding: '5px 10px',
                                        backgroundColor: 'blue',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                    }}
                                >
                                    Add to Scatter Plot
                                </button>

                                <button
                                    onClick={() => addToBarList(selectedMarkerInfo)}
                                    style={{
                                        marginTop: '10px',
                                        padding: '5px 10px',
                                        backgroundColor: 'purple',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Add to Bar Plot
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
