import React, {useEffect} from 'react';
import useAirMeasurements from '../../hooks/useAirMeasurements';
import Filters from './Filters';
import ChartView from './ChartView';
import MeasurementsTable from './MeasurementsTable';
import {Pagination} from "./Pagination.jsx";
import AddMeasurementForm from "./AddMeasurementForm.jsx";

export default function AirMeasurementsDashboard() {
    const { measurements,
        filtered,
        chartData,
        allParams,
        pageNum,
        setPageNum,
        pageSize,
        setPageSize,
        totalPages,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedSeries,
        setSelectedSeries,
        setMeasurements,
        setChartData} = useAirMeasurements();

    useEffect(() => {
        if (measurements.length > 0 && !startDate && !endDate && selectedSeries.length === 0) {
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            setStartDate(weekAgo.toISOString().split('T')[0]);
            setEndDate(now.toISOString().split('T')[0]);
            setSelectedSeries(allParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measurements, allParams]);

    const handleFilter = (s, e) => {
        setStartDate(s);
        setEndDate(e);
    };

    const toggleSeries = (param) => {
        setSelectedSeries(prev =>
            prev.includes(param)
                ? prev.filter(s => s !== param)
                : [...prev, param]
        );
    };


    const handleAdded = (newMeasurement) => {
        setChartData((prev) => [...prev, newMeasurement]);
        setMeasurements((prev) => [...prev, newMeasurement]);
    };

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

            <ChartView data={chartData} selectedSeries={selectedSeries} />
            <div>
                <AddMeasurementForm onAdded={handleAdded} />
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