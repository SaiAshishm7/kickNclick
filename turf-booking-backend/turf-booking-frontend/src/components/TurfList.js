import React from 'react';

function TurfList({ turfs }) {
  return (
    <div>
      <h2>Turfs</h2>
      <ul>
        {turfs.map(turf => (
          <li key={turf._id}>
            {turf.name} - {turf.type}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TurfList;
