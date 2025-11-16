import {formatDateInput} from "../../utils.js";

export default function DateRangeController({ start, end, setStart, setEnd, loading, error }) {

    const handleStartChange = (e) => {
        setStart(e.target.value);
    };

    const handleEndChange = (e) => {
        setEnd(e.target.value);
    };

    return (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
            <label>
                Start:
                <input
                    type="date"
                    value={formatDateInput(start)}
                    onChange={handleStartChange}
                    style={{ marginLeft: 8 }}
                />
            </label>
            <label style={{ marginLeft: 16 }}>
                End:
                <input
                    type="date"
                    value={formatDateInput(end)}
                    onChange={handleEndChange}
                    style={{ marginLeft: 8 }}
                />
            </label>
            {loading && <span style={{ marginLeft: 16 }}>Loading...</span>}
            {error && <span style={{ color: "red", marginLeft: 16 }}>Error: {error}</span>}
        </div>
    );
}
