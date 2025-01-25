import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css'; // New CSS file for styling

function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch turfs
    axios.get('http://localhost:5001/api/booking/turfs')
      .then(res => setTurfs(res.data.turfs))
      .catch(err => console.error(err));
  }, []);

  const fetchAvailableSlots = () => {
    if (!selectedTurf) return;

    axios.get('http://localhost:5001/api/booking/slots', {
      params: {
        turfId: selectedTurf._id,
        date: date.toISOString().split('T')[0],
      },
    })
    .then(res => setAvailableSlots(res.data.slots))
    .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [date, selectedTurf]);

  const bookSlot = async (timeSlot) => {
    const response = await axios.post('http://localhost:5001/api/booking/book', {
      turfId: selectedTurf._id,
      date: date.toISOString().split('T')[0],
      timeSlot,
    }, {
      headers: { Authorization: token },
    });

    if (response.data.status === 'ok') {
      alert('Booking successful!');
      fetchAvailableSlots(); // Refresh available slots
    } else {
      alert(response.data.error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dropdown-container">
        <select onChange={(e) => setSelectedTurf(JSON.parse(e.target.value))}>
          <option value="">Select a Turf</option>
          {turfs.map(turf => (
            <option key={turf._id} value={JSON.stringify(turf)}>
              {turf.name} - {turf.type}
            </option>
          ))}
        </select>
      </div>
      <Calendar value={date} onChange={setDate} className="calendar" />
      <div className="slots-container">
        <h3>Available Slots</h3>
        {availableSlots.map(slot => (
          <button key={slot} onClick={() => bookSlot(slot)}>
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
