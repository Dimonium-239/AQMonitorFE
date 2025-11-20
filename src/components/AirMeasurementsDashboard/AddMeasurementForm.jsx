import { useState } from "react";
import {CITY_SENSOR_MAP} from "../../utils.js";

const getSensorByParameter = (cityName, param) => {
    const city = CITY_SENSOR_MAP[cityName];
    if (!city) return null;
    return Object.entries(city.sensors).find(([id, data]) => data.parameter === param);
};

export default function AddMeasurementForm({ onAdded }) {
    const [city] = useState("Warsaw");
    const [parameter, setParameter] = useState("");
    const [value, setValue] = useState("");
    const [unit, setUnit] = useState("");
    const [loading, setLoading] = useState(false);

    const sensors = CITY_SENSOR_MAP[city].sensors;

    const handleParameterChange = (p) => {
        setParameter(p);
        const sensor = Object.values(sensors).find(s => s.parameter === p);
        setUnit(sensor?.unit || "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!parameter || !value) {
            alert("All fields are required");
            return;
        }

        const sensorEntry = getSensorByParameter(city, parameter);
        if (!sensorEntry) {
            alert("Invalid parameter");
            return;
        }

        const [sensor_id] = sensorEntry;
        const params = new URLSearchParams({
            city,
            sensor_id,
            value,
        });

        try {
            setLoading(true);

            const res = await fetch(
                `https://chosen-noami-dimonium-239-f939ab63.koyeb.app/api/air/measurements?${params}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        city,
                        sensor_id: parseInt(sensor_id),
                        value: parseFloat(value)
                    }),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                console.error("Error response:", text);
                alert("Error while adding measurement");
                return;
            }

            // Notify parent to refresh data
            onAdded();

            // Reset form
            setParameter("");
            setValue("");
            setUnit("");

        } catch (err) {
            console.error("Error adding measurement:", err);
            alert("Error adding measurement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"no-print"} style={{ marginBottom: "25px" }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                }}
            >
                <label style={{ display: "flex", flexDirection: "column" }}>
                    City
                    <input value={city} disabled style={{ width: "100px" }} />
                </label>

                <label style={{ display: "flex", flexDirection: "column" }}>
                    Parameter
                    <select
                        value={parameter}
                        onChange={(e) => handleParameterChange(e.target.value)}
                        style={{ width: "100px" }}
                    >
                        <option value="">Select</option>
                        {Object.values(sensors).map((s) => (
                            <option key={s.parameter} value={s.parameter}>
                                {s.parameter}
                            </option>
                        ))}
                    </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column" }}>
                    Value
                    <input
                        type="number"
                        step="0.1"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        style={{ width: "70px" }}
                    />
                </label>

                <label style={{ display: "flex", flexDirection: "column" }}>
                    Unit
                    <span style={{ textAlign: "center", minWidth: "40px" }}>
                        {unit || "-"}
                    </span>
                </label>

                <button type="submit" disabled={loading} style={{ height: "38px" }}>
                    {loading ? "Saving..." : "Add"}
                </button>
            </form>
        </div>
    );
}
