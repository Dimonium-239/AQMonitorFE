import React, { useState, useMemo, useEffect } from "react";
import { Pagination } from "./Pagination.jsx";
import {ALL_PARAMETERS} from "../../utils.js";

export default function MeasurementsTable({ filtered, totalItems, setTotalItems, onEdit }) {
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        value: "",
        parameter: "",
        timestamp: "",
    });

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

    const handleSort = (key) => {
        setPageNum(1);
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

    const handleDelete = async (id) => {
        if (!confirm("Delete this measurement?")) return;

        const res = await fetch(`https://chosen-noami-dimonium-239-f939ab63.koyeb.app/api/air/measurements/${id}`, { method: "DELETE" });

        if (!res.ok) {
            alert("Failed to delete!");
            return;
        }
    };

    const startEdit = (m) => {
        setEditingId(m.id);
        setEditData({
            value: m.value,
            parameter: m.parameter,
            timestamp: new Date(m.timestamp).toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm
        });
    };

    const saveEdit = async (id) => {
        const params = new URLSearchParams();
        if (editData.value !== "") params.append("value", editData.value);
        params.append("parameter", editData.parameter);
        params.append("timestamp", new Date(editData.timestamp).toISOString());

        await fetch(`https://chosen-noami-dimonium-239-f939ab63.koyeb.app/api/air/measurements/${id}?` + params.toString(), {
            method: "POST",
        });

        setEditingId(null);
    };

    return (
        <div>
            <table className="print-full-width" style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                <thead>
                <tr>
                    <th onClick={() => handleSort("city")}>City{getArrow("city")}</th>
                    <th onClick={() => handleSort("parameter")}>Parameter{getArrow("parameter")}</th>
                    <th onClick={() => handleSort("value")}>Value{getArrow("value")}</th>
                    <th onClick={() => handleSort("unit")}>Unit{getArrow("unit")}</th>
                    <th onClick={() => handleSort("timestamp")}>Timestamp{getArrow("timestamp")}</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>

                <tbody>
                {paginated.map((m, i) => (
                    <tr key={i}>
                        <td>{m.city}</td>
                        <td>
                            {editingId === m.id ? (
                                <select
                                    value={editData.parameter}
                                    onChange={(e) => setEditData({ ...editData, parameter: e.target.value })}>
                                    {ALL_PARAMETERS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>) : (m.parameter)}
                        </td>
                        <td>
                            {editingId === m.id ? (
                                <input
                                    type="number"
                                    value={editData.value}
                                    onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                                />) : (m.value)}
                        </td>
                        <td>{m.unit}</td>
                        <td>
                            {editingId === m.id ? (
                                <input
                                    type="datetime-local"
                                    value={editData.timestamp}
                                    onChange={(e) => setEditData({ ...editData, timestamp: e.target.value })}
                                />) : (new Date(m.timestamp).toLocaleString().replace("T", " ").split(".")[0])}
                        </td>
                        <td>
                            {editingId === m.id ? (
                                <>
                                    <button onClick={() => saveEdit(m.id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </>) : (<button onClick={() => startEdit(m)}>Edit</button>)}
                        </td>
                        <td>
                            <button style={{ color: "red" }} onClick={() => handleDelete(m.id).then(() => onEdit())}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                class="no-print"
                pageNum={pageNum}
                setPageNum={setPageNum}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalItems={totalItems}
            />
        </div>
    );
}
