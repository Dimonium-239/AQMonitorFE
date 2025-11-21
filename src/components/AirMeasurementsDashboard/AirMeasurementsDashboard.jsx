import {ALL_PARAMETERS, formatDateInput} from "../../utils.js";
import {useMemo, useState} from "react";
import useAirMeasurements from "../../hooks/useAirMeasurements.js";
import Filters from "./Filters.jsx";
import ChartView from "./ChartView.jsx";
import ReFetchButton from "./ReFetchButton.jsx";
import AddMeasurementForm from "./AddMeasurementForm.jsx";
import MeasurementsTable from "./MeasurementsTable.jsx";

export default function AirMeasurementsDashboard() {
    const [refreshKey, setRefreshKey] = useState(true);

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
        selectedSeries,
        setSelectedSeries,
        totalItems,
        setTotalItems,
        loading,
        error
    } = useAirMeasurements(startDate, endDate, refreshKey);

    const handleAddMeasurement = () => {
        setRefreshKey(k => !k);
    };

    const toggleSeries = (param) => {
        setSelectedSeries(prev => {
            const newSelected = prev.includes(param)
                ? prev.filter(s => s !== param)
                : [...prev, param];

            return newSelected.length === 0 ? ALL_PARAMETERS : newSelected;
        });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Air Quality Dashboard</h2>
            <h3>Warsaw</h3>

            <Filters
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                selectedSeries={selectedSeries}
                toggleSeries={toggleSeries}
                loading={loading}
                error={error}
            />

            <ChartView data={chartData} selectedSeries={selectedSeries} />

            <div style={{ marginTop: "20px" }}>
                <ReFetchButton class="no-print" onRefresh={handleAddMeasurement} />
                <AddMeasurementForm class="no-print" onAdded={handleAddMeasurement} />
                <MeasurementsTable filtered={filtered} totalItems={totalItems} setTotalItems={setTotalItems} onEdit={handleAddMeasurement} />
            </div>
        </div>
    );
}
