import React from 'react';
import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ChartView({ data, selectedSeries }) {
    return (
        <div style={{ width: '100%', height: '300px', marginBottom: '20px' }}>
            <ResponsiveContainer>
                <LineChart data={data}>
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
    );
}
