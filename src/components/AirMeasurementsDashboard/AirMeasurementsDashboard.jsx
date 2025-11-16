import {formatDateInput} from "../../dateUtils.js";
import {useMemo, useState} from "react";
import useAirMeasurements from "../../hooks/useAirMeasurements.js";
import Filters from "./Filters.jsx";
import ChartView from "./ChartView.jsx";
import RefreshButton from "./ReFetchButton.jsx";
import AddMeasurementForm from "./AddMeasurementForm.jsx";
import MeasurementsTable from "./MeasurementsTable.jsx";

export default function AirMeasurementsDashboard() {
    const [refreshKey, setRefreshKey] = useState(0);

    const { nowNorm, pastNorm } = useMemo(() => {
        const now = new Date();
        const past = new Date();
        past.setDate(past.getDate() - 7);

        return {
            nowNorm: formatDateInput(now),
            pastNorm: formatDateInput(past)
        };
    }, []);

    const [startDate, setStartDate] = useState(pastNorm);
    const [endDate, setEndDate] = useState(nowNorm);

    const {
        filtered,
        chartData,
        allParams,
        selectedSeries,
        setSelectedSeries,
        totalItems,
        setTotalItems,
        loading,
        error
    } = useAirMeasurements(startDate, endDate, refreshKey);

    const handleAddMeasurement = () => {
        setRefreshKey(k => k + 1); // trigger re-fetch
    };

    const toggleSeries = (param) => {
        setSelectedSeries(prev =>
            prev.includes(param)
                ? prev.filter(s => s !== param)
                : [...prev, param]
        );
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Air Quality Dashboard</h2>

            <Filters
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                allParams={allParams}
                selectedSeries={selectedSeries}
                toggleSeries={toggleSeries}
                loading={loading}
                error={error}
            />

            <ChartView data={chartData} selectedSeries={selectedSeries} />

            <div style={{ marginTop: "20px" }}>
                <RefreshButton onRefresh={handleAddMeasurement} />
                <AddMeasurementForm onAdded={handleAddMeasurement} />

                <MeasurementsTable
                    filtered={filtered}
                    totalItems={totalItems}
                    setTotalItems={setTotalItems}
                />
            </div>
        </div>
    );
}
