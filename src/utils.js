export const ALL_PARAMETERS = ["bc", "co", "no2", "pm10", "pm25"];

export const CITY_SENSOR_MAP = {
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


export const formatDateInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};