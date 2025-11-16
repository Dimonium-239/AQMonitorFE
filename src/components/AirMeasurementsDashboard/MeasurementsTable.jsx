import React, {useState, useMemo, useEffect} from "react";
import {Pagination} from "./Pagination.jsx";

export default function MeasurementsTable({ filtered, totalItems, setTotalItems }) {
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });
    useEffect(() => {
        setTotalItems(filtered.length);
    }, [filtered, setTotalItems]);

    const sorted = useMemo(() => {
        if (!sortConfig.key) return filtered;

        return [...filtered].sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];

            if (sortConfig.key === "timestamp") {
                return sortConfig.direction === "asc"
                    ? new Date(valA) - new Date(valB)
                    : new Date(valB) - new Date(valA);
            }

            if (typeof valA === "number" && typeof valB === "number") {
                return sortConfig.direction === "asc" ? valA - valB : valB - valA;
            }

            return sortConfig.direction === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });
    }, [filtered, sortConfig]);

    const paginated = useMemo(() => {
        const start = (pageNum - 1) * pageSize;
        const end = start + pageSize;
        return sorted.slice(start, end);
    }, [sorted, pageNum, pageSize]);

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
    };

    const cellStyle = {
        border: "1px solid #ccc",
        padding: "6px 8px",
        textAlign: "left",
    };

    const headerStyle = {
        ...cellStyle,
        fontWeight: "bold",
        cursor: "pointer"
    };

    const handleSort = (key) => {
        setPageNum(1); // reset pagination
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    const getArrow = (key) => {
        if (sortConfig.key !== key) return "";
        return sortConfig.direction === "asc" ? " ▲" : " ▼";
    };

    return (
        <div>
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={headerStyle} onClick={() => handleSort("city")}>
                        City{getArrow("city")}
                    </th>
                    <th style={headerStyle} onClick={() => handleSort("parameter")}>
                        Parameter{getArrow("parameter")}
                    </th>
                    <th style={headerStyle} onClick={() => handleSort("value")}>
                        Value{getArrow("value")}
                    </th>
                    <th style={headerStyle} onClick={() => handleSort("unit")}>
                        Unit{getArrow("unit")}
                    </th>
                    <th style={headerStyle} onClick={() => handleSort("timestamp")}>
                        Timestamp{getArrow("timestamp")}
                    </th>
                </tr>
                </thead>
                <tbody>
                {paginated.map((m, i) => (
                    <tr key={i}>
                        <td style={cellStyle}>{m.city}</td>
                        <td style={cellStyle}>{m.parameter}</td>
                        <td style={cellStyle}>{m.value}</td>
                        <td style={cellStyle}>{m.unit}</td>
                        <td style={cellStyle}>
                            {new Date(m.timestamp)
                                .toISOString()
                                .replace("T", " ")
                                .split(".")[0]}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                pageNum={pageNum}
                setPageNum={setPageNum}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalItems={totalItems}
            />
        </div>
    );
}

