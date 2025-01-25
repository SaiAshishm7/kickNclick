import React from 'react';

function TurfFilter({ turfType, setTurfType }) {
  const types = ['All', 'Soccer', 'Tennis', 'Cricket'];
  
  return (
    <select value={turfType} onChange={(e) => setTurfType(e.target.value)}>
      {types.map((type) => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>
  );
}

export default TurfFilter;
