import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProcessedDataView({ datasetId, onBack }) {
    const [data, setData] = useState(null);
    const [datasetName, setDatasetName] = useState('');
    const [selectedTab, setSelectedTab] = useState('visualization');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Fetch processed data and dataset name for the selected dataset
        axios.post(`http://localhost:8000/datasets/${datasetId}/process_data/`)
            .then(response => {
                setData(response.data.processedData);  
                setDatasetName(response.data.datasetName);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error processing dataset:', error);
                alert(`Error processing dataset: ${error.message}`);
                setLoading(false);
            });
    }, [datasetId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="ml-4 text-xl font-semibold text-indigo-700">Processing data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8">
            <button 
                onClick={onBack}
                className="mb-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
            >
                Back to Dataset List
            </button>


            <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
                Dataset: {datasetName}
            </h2>
            
            {/* different views navigation */}
            <div className="flex space-x-4 my-4 justify-center">
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

            {/* Conditionally render content based on selected tab */}
            {selectedTab === 'visualization' && <div>Data Visualization Content</div>}
            {selectedTab === 'analysis' && <div>Statistical Analysis Content</div>}
            {selectedTab === 'table' && <div>Data Table Content</div>}
        </div>
    );
}

export default ProcessedDataView;