import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const defaultCenter = {
    lat: -33.9249, // Latitude for Cape Town
    lng: 18.4241,  // Longitude for Cape Town
};

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

export default function MapContainer({ selectedCategory }) {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        const fetchPolygons = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/kml`); // Correct endpoint
                if (!response.ok) throw new Error('Failed to fetch polygons');
                const data = await response.json();

                const centroids = data.map(polygon => ({
                    position: calculateCentroid(polygon.coordinates),
                    label: polygon.Label,
                }));

                setMarkers(centroids);
            } catch (error) {
                console.error('Error fetching polygons:', error);
            }
        };

        fetchPolygons();
    }, []);

    const filteredMarkers = selectedCategory
        ? markers.filter(marker => marker.label === selectedCategory)
        : markers;

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
                {filteredMarkers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.position}
                        onClick={() => setSelectedMarker(marker)}
                    />
                ))}

                {selectedMarker && (
                    <InfoWindow
                        position={selectedMarker.position}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div>
                            <h3>Category</h3>
                            <p>{selectedMarker.label}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
}
