import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DatasetList() {
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/datasets/')
            .then(response => {
                setDatasets(response.data);
            })
            .catch(error => {
                console.error('Error fetching datasets:', error);
            });
    }, []);

    const processDataset = (id) => {
        axios.post(`http://localhost:8000/api/datasets/${id}/process_data/`)
            .then(response => {
                alert('Data processed successfully');
                // Handle response here, e.g., update UI with new data
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
                        {dataset.name}
                        <button onClick={() => processDataset(dataset.id)}>Process Data</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DatasetList;
