import { useState } from "react";
import { useAirMeasurements } from "../hooks/useAirMeasurements"; // your hook
import axios from "axios";

// Simple Modal component
function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-md w-full">
                {children}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Ok
                </button>
            </div>
        </div>
    );
}

export default function FetchNewMeasurementsButton({ city }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const { refetch } = useAirMeasurements(); // hook to refetch main data

    const handleClick = async () => {
        try {
            const response = await axios.get(`/air/measurements?city=${city}`);

            if (response.status === 204) {
                // No new data
                setModalContent(<p>No new measurements available.</p>);
            } else {
                // Show mini table of new measurements
                setModalContent(
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Parameter</th>
                            <th className="border px-2 py-1">Value</th>
                            <th className="border px-2 py-1">Unit</th>
                            <th className="border px-2 py-1">Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {response.data.map((m) => (
                            <tr key={m.id}>
                                <td className="border px-2 py-1">{m.parameter}</td>
                                <td className="border px-2 py-1">{m.value}</td>
                                <td className="border px-2 py-1">{m.unit}</td>
                                <td className="border px-2 py-1">{new Date(m.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                );
            }

            setIsModalOpen(true);
            // Re-fetch main measurements
            refetch();
        } catch (err) {
            console.error("Error fetching new measurements:", err);
            setModalContent(<p>Error fetching data. Please try again.</p>);
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Fetch New Measurements
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalContent}
            </Modal>
        </>
    );
}
