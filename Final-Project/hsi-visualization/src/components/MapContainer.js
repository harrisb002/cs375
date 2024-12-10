// MapContainer.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

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
}) {
    const [markers, setMarkers] = useState([]);
    const [selectedMarkerInfo, setSelectedMarkerInfo] = useState(null);

    useEffect(() => {
        const fetchPolygons = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/polygons`);
                if (!response.ok) throw new Error('Failed to fetch polygons');
                const data = await response.json();

                const validPolygons = data.filter(
                    (polygon) =>
                        polygon.ground_truth_label && polygon.predicted_label_name
                );

                const centroids = validPolygons.map((polygon) => ({
                    sample_num: polygon.sample_num,
                    position: calculateCentroid(polygon.coordinates),
                    groundTruthLabel: polygon.ground_truth_label,
                    predictedLabel: polygon.predicted_label_name,
                }));

                setMarkers(centroids);
            } catch (error) {
                console.error('Error fetching polygons:', error);
            }
        };

        fetchPolygons();
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

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
                {filteredMarkers.map((marker, index) => {
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

                {selectedMarkerInfo && (
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
    );
}
