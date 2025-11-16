import React from 'react';
import DateRangeController from "./DateRangeController.jsx";

export default function Filters({
                                    startDate,
                                    endDate,
                                    setStartDate,
                                    setEndDate,
                                    allParams,
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
        <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
            <DateRangeController start={toStartOfDay(startDate)} end={toEndOfDay(endDate)} setStart={setStartDate} setEnd={setEndDate} loading={loading} error={error} />

            <div>
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
        </div>
    </div>
    );
}
