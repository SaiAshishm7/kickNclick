import React from 'react';

function BookingList({ bookings }) {
  return (
    <div>
      <h2>All Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Turf</th>
            <th>Date</th>
            <th>Time Slot</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.userId.username}</td>
              <td>{booking.turfId.name}</td>
              <td>{booking.date}</td>
              <td>{booking.timeSlot}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingList;
