import React from 'react';
import DateRangeController from "./DateRangeController.jsx";
import {ALL_PARAMETERS} from "../../utils.js";

export default function Filters({
                                    startDate,
                                    endDate,
                                    setStartDate,
                                    setEndDate,
                                    selectedSeries,
                                    toggleSeries,
                                    loading,
                                    error
                                }) {

    const toStartOfDay = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr);
    };

    const toEndOfDay = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr);
    };

    return (
        <div className={"no-print"} style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
            <DateRangeController start={toStartOfDay(startDate)} end={toEndOfDay(endDate)} setStart={setStartDate} setEnd={setEndDate} loading={loading} error={error} />

            <div>
                <span>Show series:</span>
                {ALL_PARAMETERS.map(param => (
                    <label key={param} style={{ marginLeft: '10px' }}>
                        <input
                            type="checkbox"
                            checked={selectedSeries.includes(param)}
                            onChange={() => toggleSeries(param)}
                        /> {param}
                    </label>
                ))}
            </div>
        </div>
    </div>
    );
}
