import Modal from "./Modal.jsx";
import {useState} from "react";

export default function ReFetchButton({ onRefresh }) {
    const [modal, setModal] = useState(null);

    const handleRefresh = async () => {
        try {
            const response = await fetch(
                'https://chosen-noami-dimonium-239-f939ab63.koyeb.app/api/air/measurements?city=Warsaw'
            );

            if (response.status === 200) {
                const data = await response.json();

                if (!Array.isArray(data) || data.length === 0) {
                    setModal(
                        <Modal
                            title="No data"
                            content="The API returned no measurements."
                            onClose={() => setModal(null)}
                        />
                    );
                    return;
                }

                const renderValue = (val) =>
                    typeof val === "object" ? JSON.stringify(val) : val;

                const first = data[0];

                setModal(
                    <Modal
                        title="New Measurements"
                        content={
                            <table border="1" style={{ width: '100%', textAlign: 'center' }}>
                                <thead>
                                <tr>
                                    {Object.keys(first)
                                        .filter(key => key !== "id")
                                        .map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                                </thead>

                                <tbody>
                                {data.map((measurement, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.entries(measurement)
                                            .filter(([key, _]) => key !== "id")
                                            .map(([_, val], colIndex) => (
                                            <td key={colIndex}>{renderValue(val)}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        }
                        onClose={() => {
                            setModal(null);
                            onRefresh();
                        }}
                    />
                );
            }

            else if (response.status === 204) {
                setModal(
                    <Modal
                        title="Nothing to update"
                        content="No new measurement available."
                        onClose={() => setModal(null)}
                    />
                );
            }

        } catch (err) {
            console.error(err);

            setModal(
                <Modal
                    title="Error"
                    content="Failed to refresh measurement."
                    onClose={() => setModal(null)}
                />
            );
        }
    };

    return (
        <div style={{ display: 'inline-block', marginLeft: '10px' }}>
            <button onClick={handleRefresh}>Refresh</button>
            {modal}
        </div>
    );
}
