import React, { useState } from 'react';
import DatasetUpload from './DatasetUpload';
import DatasetList from './DatasetList';
import ProcessedDataView from './ProcessedDataView';

function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentView, setCurrentView] = useState('list');
    const [selectedDatasetId, setSelectedDatasetId] = useState(null);

    const handleUploadSuccess = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const handleProcessDataset = (datasetId) => {
        setSelectedDatasetId(datasetId);
        setCurrentView('processed');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedDatasetId(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 py-8">
            <h1 className="text-4xl font-bold text-center mb-6 text-indigo-700">AI Data Analysis App</h1>
            <div className="container mx-auto px-4">
                <DatasetUpload onUploadSuccess={handleUploadSuccess} />
                {currentView === 'list' ? (
                    <DatasetList 
                        key={refreshKey} 
                        onProcessDataset={handleProcessDataset} 
                    />
                ) : (
                    <ProcessedDataView 
                        datasetId={selectedDatasetId} 
                        onBack={handleBackToList} 
                    />
                )}
            </div>
        </div>
    );
}

export default App;