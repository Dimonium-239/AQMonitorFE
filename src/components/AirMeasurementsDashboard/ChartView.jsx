import React from 'react';
import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function pivotData(data) {
    const grouped = {};

    data.forEach(item => {
        const t = item.timestamp;
        if (!grouped[t]) grouped[t] = { timestamp: t };
        grouped[t][item.parameter] = item.value;
    });
    return Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Map hash to hue (0-360)
    const hue = Math.abs(hash) % 360;
    const saturation = 70; // pastel = lower saturation
    const lightness = 80;  // pastel = high lightness
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function ChartView({ data, selectedSeries }) {
    const chartData = pivotData(data);
    const allParams =
        selectedSeries.length > 0
            ? selectedSeries
            : Object.keys(chartData[0] || {}).filter(k => k !== "timestamp");

    return (
        <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={t => new Date(t).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {allParams.map(param => (
                        <Line
                            key={param}
                            type="monotone"
                            dataKey={param}
                            stroke={stringToColor(param)}
                            dot={true}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}