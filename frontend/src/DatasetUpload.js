import React, { useState } from 'react';
import axios from 'axios';

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
            if (onUploadSuccess) {
                onUploadSuccess(); // Trigger refresh
            }
        }).catch(error => {
            console.error('Error uploading dataset:', error);
            alert('Error uploading dataset.');
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

export default DatasetUpload;
