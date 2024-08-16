import './index.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// DatasetUpload Component
function DatasetUpload({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);

        axios.post('http://localhost:8000/datasets/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
            alert('Dataset uploaded successfully');
            setFile(null);
            setName('');
            if (onUploadSuccess) onUploadSuccess();
        }).catch(error => {
            console.error('Error uploading dataset:', error);
        });
    };

    return (
        <div className="max-w-md mx-auto my-6 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">Upload Dataset</h2>
            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Dataset Name"
                className="w-full mb-4 p-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <input
                type="file"
                onChange={handleFileChange}
                className="w-full mb-4 p-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
                onClick={handleUpload}
                className="w-full bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600 transition font-semibold"
            >
                Upload
            </button>
        </div>
    );
}

// DatasetList Component with Enhanced Table Layout
function DatasetList({ onDatasetProcessed }) {
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

    const processDataset = (id) => {
        axios.post(`http://localhost:8000/datasets/${id}/process_data/`)
            .then(response => {
                onDatasetProcessed(response.data);
            })
            .catch(error => {
                console.error('Error processing dataset:', error);
                alert(`Error processing dataset: ${error.message}`);
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
                                    onClick={() => processDataset(dataset.id)}
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

// Main App Component with Tabs
function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [processedData, setProcessedData] = useState(null);
    const [selectedTab, setSelectedTab] = useState('visualization'); // Default tab

    const handleUploadSuccess = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const handleDatasetProcessed = (data) => {
        setProcessedData(data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 py-8">
            <h1 className="text-4xl font-bold text-center mb-6 text-indigo-700">AI Data Analysis App</h1>
            <div className="container mx-auto px-4">
                <DatasetUpload onUploadSuccess={handleUploadSuccess} />
                <DatasetList key={refreshKey} onDatasetProcessed={handleDatasetProcessed} />

                {processedData && (
                    <div>
                        {/* Tab Navigation */}
                        <div className="flex space-x-4 my-4">
                            <button
                                onClick={() => setSelectedTab('visualization')}
                                className={`py-2 px-4 rounded-lg ${selectedTab === 'visualization' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Data Visualization
                            </button>
                            <button
                                onClick={() => setSelectedTab('analysis')}
                                className={`py-2 px-4 rounded-lg ${selectedTab === 'analysis' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Statistical Analysis
                            </button>
                            <button
                                onClick={() => setSelectedTab('table')}
                                className={`py-2 px-4 rounded-lg ${selectedTab === 'table' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Data Table
                            </button>
                        </div>

                        {/* Conditionally render content based on the selected tab */}
                        {selectedTab === 'visualization' && <div> {/* Data Visualization */}</div>}
                        {selectedTab === 'analysis' && <div> {/*Statistical Analysis */}</div>}
                        {selectedTab === 'table' && <div> {/* Data Table */}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
