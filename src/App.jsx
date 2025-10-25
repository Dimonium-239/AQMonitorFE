import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AirMeasurementsDashboard() {
    const [measurements, setMeasurements] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const [startDate, setStartDate] = useState(weekAgo.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
    const [selectedSeries, setSelectedSeries] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/air/measurements/persisted')
            .then((res) => res.json())
            .then((data) => {
                setMeasurements(data);
                // Apply default date filter (one week window)
                const filteredData = data.filter(m => {
                    const t = new Date(m.timestamp);
                    return t >= weekAgo && t <= now;
                });
                setFiltered(filteredData);
                const uniqueParams = [...new Set(data.map(m => m.parameter))];
                setSelectedSeries(uniqueParams);
            })
            .catch(console.error);
    }, []);

    const handleFilter = (s = startDate, e = endDate) => {
        let filteredData = measurements;
        const start = new Date(s);
        start.setHours(0,0,0,0);
        const end = new Date(e);
        end.setHours(23,59,59,999);
        filteredData = filteredData.filter(m => {
            const t = new Date(m.timestamp);
            return t >= start && t <= end;
        });
        console.log(start);
        console.log(end);
        setFiltered(filteredData);
    };


    const toggleSeries = (param) => {
        if (selectedSeries.includes(param)) {
            setSelectedSeries(selectedSeries.filter(s => s !== param));
        } else {
            setSelectedSeries([...selectedSeries, param]);
        }
    };

    const groupedData = Object.values(
        filtered.reduce((acc, m) => {
            const t = new Date(m.timestamp).toISOString();
            if (!acc[t]) acc[t] = { timestamp: t };
            acc[t][m.parameter] = m.value;
            return acc;
        }, {})
    );

    const allParams = [...new Set(measurements.map(m => m.parameter))];

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Air Quality Dashboard</h2>

            <div style={{ marginBottom: '10px' }}>
                <label>Start date: </label>
                <input type="date" value={startDate} onChange={e => {
                    const val = e.target.value;
                    setStartDate(val);
                    handleFilter(val, endDate);
                }} />

                <label style={{ marginLeft: '10px' }}>End date: </label>
                <input type="date" value={endDate} onChange={e => {
                    const val = e.target.value;
                    setEndDate(val);
                    handleFilter(startDate, val);
                }} />

            </div>

            <div style={{ marginBottom: '10px' }}>
                <span>Show series:</span>
                {allParams.map(param => (
                    <label key={param} style={{ marginLeft: '10px' }}>
                        <input
                            type="checkbox"
                            checked={selectedSeries.includes(param)}
                            onChange={() => toggleSeries(param)}
                        /> {param}
                    </label>
                ))}
            </div>

            <div style={{ width: '100%', height: '300px', marginBottom: '20px' }}>
                <ResponsiveContainer>
                    <LineChart data={groupedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={t => new Date(t).toLocaleTimeString()} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedSeries.map(param => (
                            <Line key={param} type="monotone" dataKey={param} stroke="#8884d8" dot={false} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <table border="1" cellPadding="4" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                <tr>
                    <th>City</th>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Timestamp</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((m, i) => (
                    <tr key={i}>
                        <td>{m.city}</td>
                        <td>{m.parameter}</td>
                        <td>{m.value}</td>
                        <td>{m.unit}</td>
                        <td>{new Date(m.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}