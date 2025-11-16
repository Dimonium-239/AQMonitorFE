import Modal from "./Modal.jsx";
import {useState} from "react";

export default function RefreshButton({ onRefresh }) {
    const [modal, setModal] = useState(null);

    const handleRefresh = async () => {
        try {
            const response = await fetch('https://chosen-noami-dimonium-239-f939ab63.koyeb.app/api/air/measurements?city=Warsaw');
            if (response.status === 200) {
                const data = await response.json();
                setModal(
                    <Modal
                        title="New Measurement"
                        content={
                            <table border="1" style={{ width: '100%', textAlign: 'center' }}>
                                <thead>
                                <tr>
                                    {Object.keys(data).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    {Object.values(data).map((val, idx) => (
                                        <td key={idx}>{val}</td>
                                    ))}
                                </tr>
                                </tbody>
                            </table>
                        }
                        onClose={() => {
                            setModal(null);
                            onRefresh();
                        }}
                    />
                );
            } else if (response.status === 204) {
                setModal(
                    <Modal
                        title="Nothing to update"
                        content="No new measurement available."
                        onClose={() => setModal(null)}
                    />
                );
            }
        } catch (err) {
            console.log("err")
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