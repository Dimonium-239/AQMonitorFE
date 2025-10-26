import {useState, useEffect, useMemo} from 'react';


export default function useAirMeasurements(initialPage = 1, initialSize = 10) {
    const [measurements, setMeasurements] = useState([]);
    const [pageNum, setPageNum] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialSize);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const totalPagesMax = Math.ceil(totalPages / pageSize);
        if (pageNum > totalPagesMax && totalPagesMax > 0) {
            setPageNum(totalPagesMax);
        }
    }, [pageNum, pageSize, totalPages]);

    useEffect(() => {
        let isMounted = true;
        fetch(`https://aqmonitor.onrender.com/api/air/measurements/persisted?page=${pageNum}&page_size=${pageSize}`)
            .then(res => res.json())
            .then(data => {
                if (!isMounted) return;
                setMeasurements(data.items || []);
                setTotalPages(data.total || 1);
            })
            .catch(console.error);

        return () => { isMounted = false; };
    }, [pageNum, pageSize]);

    const filtered = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return measurements.filter(m => {
            const t = new Date(m.timestamp);
            return t >= weekAgo && t <= now;
        });
    }, [measurements]);

    const allParams = useMemo(() => [...new Set(measurements.map(m => m.parameter))], [measurements]);

    return {
        measurements,
        filtered,
        allParams,
        pageNum,
        setPageNum,
        pageSize,
        setPageSize,
        totalPages
    };
}