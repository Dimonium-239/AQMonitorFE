import React, { useState, useMemo } from "react";
import {Pagination} from "./Pagination.jsx";

export default function MeasurementsTable({ filtered }) {
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState([]); // ["timestamp:asc", "city:desc"]
    const [totalItems, setTotalItems] = useState(1);

    const toggleSort = (field, multi = false) => {
        setSortBy(prev => {
            const existing = prev.find(s => s.startsWith(`${field}:`));
            const newDir = existing?.endsWith(":asc") ? "desc" : "asc";
            if (multi) {
                return existing ? prev.map(s => (s.startsWith(`${field}:`) ? `${field}:${newDir}` : s)) : [...prev, `${field}:${newDir}`];
            }
            return [`${field}:${newDir}`];
        });
        setPageNum(1); // reset page when sorting
    };

    const sortedData = useMemo(() => {
        if (!filtered) return [];
        setTotalItems(filtered.length);
        if (sortBy.length === 0) return filtered;
        return [...filtered].sort((a, b) => {
            for (const rule of sortBy) {
                const [field, dir] = rule.split(":");
                const av = a[field];
                const bv = b[field];
                if (av < bv) return dir === "asc" ? -1 : 1;
                if (av > bv) return dir === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [filtered, sortBy]);

    const startIdx = (pageNum - 1) * pageSize;
    const paginated = sortedData.slice(startIdx, startIdx + pageSize);

    console.log(totalItems)

    const getArrow = (field) => {
        const rule = sortBy.find(s => s.startsWith(`${field}:`));
        if (!rule) return "";
        return rule.endsWith(":asc") ? "▲" : "▼";
    };

    return (
        <div>
            <table border="1" cellPadding="4" width="100%">
                <thead>
                <tr>
                    {[
                        { field: "city", label: "City" },
                        { field: "parameter", label: "Parameter" },
                        { field: "value", label: "Value" },
                        { field: "unit", label: "Unit" },
                        { field: "timestamp", label: "Timestamp" },
                    ].map(({ field, label }) => (
                        <th key={field} onClick={(e) => toggleSort(field, e.shiftKey)} style={{ cursor: "pointer" }}>
                            {label} {getArrow(field)}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {paginated.map((m, i) => (
                    <tr key={i}>
                        <td>{m.city}</td>
                        <td>{m.parameter}</td>
                        <td>{m.value}</td>
                        <td>{m.unit}</td>
                        <td>{new Date(m.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                pageNum={pageNum}
                setPageNum={setPageNum}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalItems={filtered.length}
                setTotalItems={setTotalItems}
            />
        </div>
    );
}




