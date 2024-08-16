import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProcessedDataView({ datasetId, onBack }) {
    const [data, setData] = useState(null);
    const [selectedTab, setSelectedTab] = useState('visualization');

    useEffect(() => {
        axios.post(`http://localhost:8000/datasets/${datasetId}/process_data/`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error processing dataset:', error);
                alert(`Error processing dataset: ${error.message}`);
            });
    }, [datasetId]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
            <button 
                onClick={onBack}
                className="mb-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
            >
                Back to Dataset List
            </button>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Processed Data</h2>
            
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

            {selectedTab === 'visualization' && <div>Data Visualization Content</div>}
            {selectedTab === 'analysis' && <div>Statistical Analysis Content</div>}
            {selectedTab === 'table' && <div>Data Table Content</div>}
        </div>
    );
}

export default ProcessedDataView;