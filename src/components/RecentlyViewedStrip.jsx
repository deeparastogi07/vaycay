import React from 'react';
import { Link } from 'react-router-dom';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function RecentlyViewedStrip({ hotels }) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <div className="recent-strip-wrap">
      <span className="recent-strip-title">Recently viewed</span>
      <div className="recent-strip">
        {hotels.map((hotel) => (
          <Link key={hotel.id} to={`/hotels/${hotel.id}`} className="recent-card">
            <img src={hotel.thumbnail} alt={hotel.name} loading="lazy" />
            <div className="recent-card-body">
              <div className="recent-card-name">{hotel.name}</div>
              <div className="recent-card-price">{currency.format(hotel.price)}/night</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
