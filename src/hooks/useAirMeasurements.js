import {useState, useEffect, useMemo} from 'react';

export default function useAirMeasurements(initialPage = 1, initialSize = 10) {
    const [measurements, setMeasurements] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [pageNum, setPageNum] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialSize);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedSeries, setSelectedSeries] = useState([]);
    const [allParams, setAllParams] = useState([]);
    const [sortBy, setSortBy] = useState(["timestamp:asc"]); // multi-sort support

    useEffect(() => {
        const maxPages = Math.max(1, totalPages);
        if (pageNum > maxPages) setPageNum(maxPages);
    }, [pageNum, pageSize, totalPages]);

    // Fetch chart data (main backend endpoint)
    useEffect(() => {
        let isMounted = true;
        const params = new URLSearchParams();

        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);
        if (selectedSeries.length > 0) {
            selectedSeries.forEach(p => params.append("parameter", p));
        }
        if (sortBy.length > 0) {
            sortBy.forEach(s => params.append("sort_by", s));
        }

        const chartUrl = `https://aqmonitor.onrender.com/api/air/measurements/chart-data?${params.toString()}`;
        console.log("Fetching:", chartUrl);

        fetch(chartUrl)
            .then(res => res.json())
            .then(data => {
                if (!isMounted) return;
                setChartData(data || []);

                // FE pagination after receiving data
                const total = data.length;
                const pages = Math.ceil(total / pageSize);
                setTotalPages(pages);
                const startIdx = (pageNum - 1) * pageSize;
                const endIdx = startIdx + pageSize;
                setMeasurements(data.slice(startIdx, endIdx));
            })
            .catch(console.error);

        return () => { isMounted = false; };
    }, [pageNum, pageSize, startDate, endDate, selectedSeries, sortBy]);

    // Extract available parameters dynamically
    useEffect(() => {
        const paramsFromData = new Set(chartData.map(m => m.parameter));
        setAllParams(prev => [...new Set([...prev, ...paramsFromData])]);
    }, [chartData]);

    // Filter by date locally (optional — if needed)
    const filtered = useMemo(() => {
        if (!startDate || !endDate) return measurements;
        const start = new Date(startDate);
        start.setHours(0,0,0,0);
        const end = new Date(endDate);
        end.setHours(23,59,59,999);
        return measurements.filter(m => {
            const t = new Date(m.timestamp);
            return t >= start && t <= end;
        });
    }, [measurements, startDate, endDate]);

    return {
        measurements,
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
        sortBy,
        setSortBy,
        setChartData,
        setMeasurements
    };
}