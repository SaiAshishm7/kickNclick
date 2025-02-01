import React, { useState } from 'react';
import axios from 'axios';
import './Booking.css'; // Ensure you have a Booking.css file for styles

const Booking = () => {
  const [turfId, setTurfId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const bookSlot = async (turfId, date, timeSlot) => {
    try {
      const response = await axios.post('http://localhost:5001/api/booking/book', {
        turfId,
        date,
        timeSlot,
      });

      if (response.data.status === 'ok') {
        alert('Booking successful!');
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      alert('Failed to book slot.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    bookSlot(turfId, date, timeSlot);
  };

  return (
    <div className="booking-container">
      <form onSubmit={handleSubmit}>
        <h2>Book a Slot</h2>
        <input
          type="text"
          placeholder="Turf ID"
          value={turfId}
          onChange={(e) => setTurfId(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Time Slot"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        />
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default Booking;
