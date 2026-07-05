import React from 'react';
import HotelCard from './HotelCard.jsx';

export default function HotelGrid({ hotels }) {
  return (
    <div className="hotel-grid">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
