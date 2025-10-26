import React, { useEffect, useState } from 'react';
import useAirMeasurements from '../../hooks/useAirMeasurements';
import Filters from './Filters';
import ChartView from './ChartView';
import MeasurementsTable from './MeasurementsTable';
import {Pagination} from "./Pagination.jsx";

export default function AirMeasurementsDashboard() {
    const { measurements,
        filtered,
        setFiltered,
        allParams,
        pageNum,
        setPageNum,
        pageSize,
        setPageSize,
        totalPages} = useAirMeasurements();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedSeries, setSelectedSeries] = useState([]);

    useEffect(() => {
        if (measurements.length > 0) {
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            setStartDate(weekAgo.toISOString().split('T')[0]);
            setEndDate(now.toISOString().split('T')[0]);
            setSelectedSeries(allParams);
        }
    }, [measurements, allParams]);

    const handleFilter = (s, e) => {
        if (!s || !e) return;
        const start = new Date(s);
        start.setHours(0, 0, 0, 0);
        const end = new Date(e);
        end.setHours(23, 59, 59, 999);
        const filteredData = measurements.filter(m => {
            const t = new Date(m.timestamp);
            return t >= start && t <= end;
        });
        setFiltered(filteredData);
    };

    const toggleSeries = (param) => {
        setSelectedSeries(prev =>
            prev.includes(param)
                ? prev.filter(s => s !== param)
                : [...prev, param]
        );
    };

    const groupedData = Object.values(
        filtered.reduce((acc, m) => {
            const t = new Date(m.timestamp).toISOString();
            if (!acc[t]) acc[t] = { timestamp: t };
            acc[t][m.parameter] = m.value;
            return acc;
        }, {})
    );

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Air Quality Dashboard</h2>

            <Filters
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleFilter={handleFilter}
                allParams={allParams}
                selectedSeries={selectedSeries}
                toggleSeries={toggleSeries}
            />

            <ChartView data={groupedData} selectedSeries={selectedSeries} />
            <div>
                <MeasurementsTable filtered={filtered} />
                <Pagination
                    pageNum={pageNum}
                    setPageNum={setPageNum}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    total={totalPages}
                />
            </div>
        </div>
    );
}