import {useState, useEffect, useMemo} from 'react';


export default function useAirMeasurements(initialPage = 1, initialSize = 10) {
    const [measurements, setMeasurements] = useState([]);
    const [chartData, setChartData] = useState([]); // ✅ new state for chart
    const [pageNum, setPageNum] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialSize);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedSeries, setSelectedSeries] = useState([]);
    const [allParams, setAllParams] = useState([]);

    useEffect(() => {
        const maxPages = Math.max(1, totalPages);
        if (pageNum > maxPages) setPageNum(maxPages);
    }, [pageNum, pageSize, totalPages]);

    useEffect(() => {
        let isMounted = true;
        const params = new URLSearchParams({
            page: pageNum,
            page_size: pageSize
        });

        const chartParams = new URLSearchParams();

        if (startDate){
            params.append("startDate", startDate);
            chartParams.append("startDate", startDate);
        }
        if (endDate) {
            params.append("endDate", endDate);
            chartParams.append("endDate", endDate);
        }
        if (selectedSeries.length > 0) {
            selectedSeries.forEach(e => params.append("parameter", e));
            selectedSeries.forEach(e => chartParams.append("parameter", e));
        }

        const measurementsUrl = `https://aqmonitor.onrender.com/api/air/measurements/persisted?${params.toString()}`;
        const chartUrl = `https://aqmonitor.onrender.com/api/air/measurements/chart-data?${chartParams.toString()}`;
        console.log(measurementsUrl);
        console.log(chartUrl);

        fetch(measurementsUrl)
            .then(res => res.json())
            .then(data => {
                if (!isMounted) return;
                setMeasurements(data.items || []);
                setTotalPages(data.total || 1);
            })
            .catch(console.error);

        fetch(chartUrl)
            .then(res => res.json())
            .then(data => {
                if (!isMounted) return;
                setChartData(data || []); // assume backend returns array for chart
            })
            .catch(console.error);

        return () => { isMounted = false; };
    }, [pageNum, pageSize, startDate, endDate, selectedSeries]);

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


    useEffect(() => {
        const paramsFromMeasurements = new Set(measurements.map(m => m.parameter))
        setAllParams(prev => {
            return [...new Set([...prev, ...paramsFromMeasurements])];
        });
    }, [measurements]);

    return {
        measurements,
        filtered,
        chartData,
        allParams,
        setAllParams,
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
        setChartData
    };
}