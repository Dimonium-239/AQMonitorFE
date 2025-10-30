import { useState } from "react";

const CITY_SENSOR_MAP = {
    Warsaw: {
        id: 10776,
        sensors: {
            35996: { parameter: "bc", unit: "µg/m³" },
            36156: { parameter: "co", unit: "µg/m³" },
            36160: { parameter: "no2", unit: "µg/m³" },
            36161: { parameter: "pm10", unit: "µg/m³" },
            36162: { parameter: "pm25", unit: "µg/m³" },
        },
    },
};

const getSensorByParameter = (cityName, parameter) => {
    const city = CITY_SENSOR_MAP[cityName];
    if (!city) return null;
    return Object.entries(city.sensors).find(([id, data]) => data.parameter === parameter);
};

export default function AddMeasurementForm({ onAdded }) {
    const [city, setCity] = useState("Warsaw");
    const [parameter, setParameter] = useState("");
    const [value, setValue] = useState("");
    const [unit, setUnit] = useState("");
    const [loading, setLoading] = useState(false);

    const sensors = CITY_SENSOR_MAP[city]?.sensors || {};

    const handleParameterChange = (p) => {
        setParameter(p);
        const sensor = Object.values(sensors).find(s => s.parameter === p);
        setUnit(sensor?.unit || "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!city || !parameter || !value) {
            alert("All fields are required");
            return;
        }

        const [sensorId] = getSensorByParameter(city, parameter) || [];
        if (!sensorId) {
            alert("Invalid parameter");
            return;
        }

        try {
            setLoading(true);

            const params = new URLSearchParams({
                city,
                sensor_id: sensorId,
                value,
            });

            const res = await fetch(`https://aqmonitor.onrender.com/api/air/measurements?${params}`, {
                method: "POST",
            });

            const rawText = await res.text();
            console.log("Response status:", res.status);
            console.log("Raw response text:", rawText);

            if (!res.ok) {
                throw new Error(`Failed with status ${res.status}`);
            }

            // Safely parse JSON if it exists
            let newMeasurement = null;
            if (rawText) {
                try {
                    newMeasurement = JSON.parse(rawText);
                } catch (err) {
                    console.warn("Response was not valid JSON, ignoring parse error:", err);
                }
            }

            if (newMeasurement) {
                onAdded?.(newMeasurement);
            }

            setValue("");
        } catch (err) {
            console.error("Error adding measurement:", err);
            alert("Error adding measurement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: "25px" }}>
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
                    <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ width: "100px" }}
                    />
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

