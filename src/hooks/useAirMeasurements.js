import { useState, useEffect } from 'react';

export default function useAirMeasurements() {
    const [measurements, setMeasurements] = useState([]);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        fetch('https://aqmonitor.onrender.com/api/air/measurements/persisted')
            .then(res => res.json())
            .then(data => {
                setMeasurements(data);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const filteredData = data.filter(m => {
                    const t = new Date(m.timestamp);
                    return t >= weekAgo && t <= now;
                });
                setFiltered(filteredData);
            })
            .catch(console.error);
    }, []);

    const allParams = [...new Set(measurements.map(m => m.parameter))];

    return { measurements, filtered, setFiltered, allParams };
}
