import React from 'react';

export default function Filters({startDate,
                                    endDate,
                                    setStartDate,
                                    setEndDate,
                                    handleFilter,
                                    allParams,
                                    selectedSeries,
                                    toggleSeries }) {
    return (
        <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
                <label>Start date: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={e => {
                        const val = e.target.value;
                        setStartDate(val);
                        handleFilter(val, endDate);
                    }}
                />

                <label style={{ marginLeft: '10px' }}>End date: </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={e => {
                        const val = e.target.value;
                        setEndDate(val);
                        handleFilter(startDate, val);
                    }}
                />
            </div>

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
    );
}
