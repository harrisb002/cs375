import { useEffect, useState } from 'react';

export function useData() {
    const [polygons, setPolygons] = useState([]);
    const [categories, setCategories] = useState([]);
    const [mergedData, setMergedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        fetch(`${backendUrl}/api/kml`)
            .then(res => {
                if (!res.ok) throw new Error(`Error fetching polygons: ${res.statusText}`);
                return res.json();
            })
            .then(polyData => {
                setPolygons(polyData);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setMergedData(polygons);
    }, [polygons]);

    return { mergedData, categories, loading, error };
}
