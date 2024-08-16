import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DatasetList({ onProcessDataset }) {
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        fetchDatasets();
    }, []);

    const fetchDatasets = () => {
        axios.get('http://localhost:8000/datasets/')
            .then(response => {
                setDatasets(response.data);
            })
            .catch(error => {
                console.error('Error fetching datasets:', error);
            });
    };

    return (
        <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Dataset List</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-indigo-500 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left text-white font-semibold">Dataset Name</th>
                        <th className="py-3 px-4 text-left text-white font-semibold">Date of Upload</th>
                        <th className="py-3 px-4 text-left text-white font-semibold">Uploaded File</th>
                        <th className="py-3 px-4 text-left text-white font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {datasets.map((dataset, index) => (
                        <tr key={dataset.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="py-3 px-4 border-t border-gray-200">{dataset.name}</td>
                            <td className="py-3 px-4 border-t border-gray-200">{new Date(dataset.uploaded_at).toLocaleString()}</td>
                            <td className="py-3 px-4 border-t border-gray-200">
                                <a href={dataset.file_url} className="text-indigo-600 hover:underline">Download File</a>
                            </td>
                            <td className="py-3 px-4 border-t border-gray-200">
                                <button
                                    onClick={() => onProcessDataset(dataset.id)}
                                    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition font-semibold"
                                >
                                    Process Data
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DatasetList;