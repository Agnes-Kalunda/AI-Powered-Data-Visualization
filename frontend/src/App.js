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
        <div>
            <h2>Upload Dataset</h2>
            <input type="text" value={name} onChange={handleNameChange} placeholder="Dataset Name" />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

// DatasetList Component
function DatasetList() {
    const [datasets, setDatasets] = useState([]);
    const [processedData, setProcessedData] = useState(null);

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
                setProcessedData(response.data);
            })
            .catch(error => {
                console.error('Error processing dataset:', error);
            });
    };

    return (
        <div>
            <h2>Dataset List</h2>
            <ul>
                {datasets.map(dataset => (
                    <li key={dataset.id}>
                        {dataset.name} - Uploaded at: {new Date(dataset.uploaded_at).toLocaleString()}
                        <button onClick={() => processDataset(dataset.id)}>Process Data</button>
                    </li>
                ))}
            </ul>
            {processedData && (
                <div>
                    <h3>Processed Data</h3>
                    <p>Summary: {JSON.stringify(processedData.summary)}</p>
                    <p>Regression Coefficient: {processedData.regression_coefficient}</p>
                    <p>Regression Intercept: {processedData.regression_intercept}</p>
                </div>
            )}
        </div>
    );
}

// Main App Component
function App() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    return (
        <div>
            <h1>AI Data Analysis App</h1>
            <DatasetUpload onUploadSuccess={handleUploadSuccess} />
            <DatasetList key={refreshKey} />
        </div>
    );
}

export default App;