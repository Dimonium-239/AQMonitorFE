import React from 'react';

export default function MeasurementsTable({ filtered }) {
    return (
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
    );
}
