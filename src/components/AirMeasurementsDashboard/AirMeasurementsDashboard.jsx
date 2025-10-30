import React, { useEffect } from "react";
import Filters from "./Filters";
import ChartView from "./ChartView";
import AddMeasurementForm from "./AddMeasurementForm";
import MeasurementsTable from "./MeasurementsTable";
import useAirMeasurements from "../../hooks/useAirMeasurements.js";

export default function AirMeasurementsDashboard() {
    const {
        measurements,
        filtered,
        chartData,
        allParams,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedSeries,
        setSelectedSeries,
        setMeasurements,
        setChartData
    } = useAirMeasurements();

    // Initialize default date range and series on first load
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
                toggleSeries={toggleSeries}/>
            <ChartView data={chartData} selectedSeries={selectedSeries} />
            <div style={{ marginTop: "20px" }}>
                <AddMeasurementForm onAdded={handleAdded} />
                <MeasurementsTable filtered={filtered} />
            </div>
        </div>
    );
}
