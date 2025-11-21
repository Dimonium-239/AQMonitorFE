import React, { useState, useMemo, useEffect } from "react";
import { Pagination } from "./Pagination.jsx";
import { ALL_PARAMETERS } from "../../utils.js";

const toLocalDatetimeInput = (utcString) => {
    const d = new Date(utcString);
    const pad = (n) => n.toString().padStart(2, "0");

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hour}:${minute}`;
};

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

        const res = await fetch(
            `https://chosen-noami-dimonium-239-f939ab63.koyeb.app/api/air/measurements/${id}`,
            { method: "DELETE" }
        );

        if (!res.ok) {
            alert("Failed to delete!");
            return;
        }
        onEdit();
    };

    const startEdit = (m) => {
        setEditingId(m.id);
        setEditData({
            value: m.value,
            parameter: m.parameter,
            timestamp: toLocalDatetimeInput(m.timestamp),
        });
    };

    const saveEdit = async (id) => {
        const params = new URLSearchParams();

        if (editData.value !== "") params.append("value", editData.value);
        params.append("parameter", editData.parameter);
        params.append("timestamp", editData.timestamp);

        await fetch(
            `https://chosen-noami-dimonium-239-f939ab63.koyeb.app/api/air/measurements/${id}?` +
            params.toString(),
            { method: "POST" }
        );

        setEditingId(null);
        onEdit();
    };

    return (
        <div>
            <table
                className="print-full-width"
                style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}
            >
                <thead>
                <tr>
                    <th onClick={() => handleSort("city")}>City{getArrow("city")}</th>
                    <th onClick={() => handleSort("parameter")}>
                        Parameter{getArrow("parameter")}
                    </th>
                    <th onClick={() => handleSort("value")}>Value{getArrow("value")}</th>
                    <th onClick={() => handleSort("unit")}>Unit{getArrow("unit")}</th>
                    <th onClick={() => handleSort("timestamp")}>
                        Timestamp{getArrow("timestamp")}
                    </th>
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
                                    onChange={(e) =>
                                        setEditData({ ...editData, parameter: e.target.value })
                                    }
                                >
                                    {ALL_PARAMETERS.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                m.parameter
                            )}
                        </td>

                        <td>
                            {editingId === m.id ? (
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    pattern="[0-9]*[.,]?[0-9]*"
                                    value={editData.value}
                                    onInput={(e) => {
                                        e.target.value = e.target.value
                                            .replace(/[^0-9.,]/g, "") // keep digits and , .
                                            .replace(/,/g, ".")       // normalize comma → dot
                                            .replace(/(\..*)\./g, "$1"); // prevent two dots

                                        setEditData({ ...editData, value: e.target.value });
                                    }}
                                />
                            ) : (
                                m.value
                            )}
                        </td>

                        <td>{m.unit}</td>

                        <td>
                            {editingId === m.id ? (
                                <input
                                    type="datetime-local"
                                    value={editData.timestamp}
                                    onChange={(e) =>
                                        setEditData({ ...editData, timestamp: e.target.value })
                                    }
                                />
                            ) : (
                                new Date(m.timestamp).toLocaleString("pl-PL")
                            )}
                        </td>

                        <td>
                            {editingId === m.id ? (
                                <>
                                    <button onClick={() => saveEdit(m.id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => startEdit(m)}>Edit</button>
                            )}
                        </td>

                        <td>
                            <button
                                style={{ color: "red" }}
                                onClick={() => handleDelete(m.id)}
                            >
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
