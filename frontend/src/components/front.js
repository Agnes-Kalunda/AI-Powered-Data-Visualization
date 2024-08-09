import React, { useState } from 'react';
import axios from 'axios';

function Front() {
  const [data, setData] = useState('');
  const [visualization, setVisualization] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/visualize/', { data });
      setVisualization(response.data.suggestion);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div>
      <h1>AI-Powered Data Visualization</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter your data here..."
        />
        <button type="submit">Visualize</button>
      </form>
      {visualization && (
        <div>
          <h2>Visualization Suggestion</h2>
          <p>{visualization}</p>
        </div>
      )}
    </div>
  );
}

export default Front;
