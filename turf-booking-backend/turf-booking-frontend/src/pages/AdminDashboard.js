import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TurfList from '../components/TurfList';
import './AdminDashboard.css'; // New CSS file for styling

function AdminDashboard() {
  const [turfs, setTurfs] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [timeSlots, setTimeSlots] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch turfs
    axios.get('http://localhost:5001/api/booking/turfs')
      .then(res => setTurfs(res.data.turfs))
      .catch(err => console.error(err));
  }, []);

  const handleAddTurf = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('image', image);
    formData.append('timeSlots', timeSlots);

    const response = await axios.post('http://localhost:5001/api/booking/turfs', formData, {
      headers: { 
        Authorization: token,
        'Content-Type': 'multipart/form-data'
      },
    });

    if (response.data.status === 'ok') {
      alert('Turf added successfully!');
      setTurfs([...turfs, response.data.turf]);
      setName('');
      setType('');
      setImage(null);
      setTimeSlots('');
    } else {
      alert(response.data.error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleAddTurf} className="admin-form">
        <h2>Add New Turf</h2>
        <input
          type="text"
          placeholder="Turf Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Turf Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Available Time Slots (comma-separated)"
          value={timeSlots}
          onChange={(e) => setTimeSlots(e.target.value)}
        />
        <button type="submit">Add Turf</button>
      </form>
      <TurfList turfs={turfs} />
    </div>
  );
}

export default AdminDashboard;
