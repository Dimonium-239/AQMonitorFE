import { useState, useEffect, useMemo } from "react";
import {ALL_PARAMETERS} from "../utils.js";

export default function useAirMeasurements(startDate, endDate, refreshKey, {
    initialPage = 1,
    initialSize = 10
} = {}) {

    const [pageNum, setPageNum] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialSize);
    const [rawData, setRawData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(ALL_PARAMETERS);
    const [sortBy, setSortBy] = useState(["timestamp:asc"]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        const params = new URLSearchParams();

        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);
        selectedSeries.forEach(p => params.append("parameter", p));
        sortBy.forEach(rule => params.append("sort_by", rule));

        const url = `https://chosen-noami-dimonium-239-f939ab63.koyeb.app/api/air/measurements/chart-data?${params}`;

        setLoading(true);
        setError(null);

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!isMounted) return;

                setRawData(data || []);
                setChartData(data || []);

                const total = data.length;
                setTotalItems(total);
                setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
                setLoading(false);
            })
            .catch(err => {
                if (!isMounted) return;
                setError(err.message || "Failed to fetch data");
                setLoading(false);
            });

        return () => { isMounted = false; };
    }, [
        startDate,
        endDate,
        selectedSeries,
        sortBy,
        pageSize,
        refreshKey
    ]);


    useEffect(() => {
        if (pageNum > totalPages) {
            setPageNum(totalPages);
        }
    }, [pageNum, totalPages]);

    const filtered = useMemo(() => {
        if (!startDate || !endDate) return rawData;

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return rawData.filter(m => {
            const t = new Date(m.timestamp);
            return t >= start && t <= end;
        });
    }, [rawData, startDate, endDate]);


    return {
        chartData,
        filtered,
        selectedSeries,
        setSelectedSeries,
        pageNum,
        setPageNum,
        pageSize,
        setPageSize,
        totalPages,
        sortBy,
        setSortBy,
        totalItems,
        setTotalItems,
        loading,
        error
    };
}
