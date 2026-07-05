import React from 'react';
import { Link } from 'react-router-dom';
import RatingStamp from './RatingStamp.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function HotelCard({ hotel }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(hotel.id);
  const airportCode = hotel.location.slice(0, 3).toUpperCase();

  return (
    <Link to={`/hotels/${hotel.id}`} className="hotel-card">
      <div className="hotel-photo-wrap">
        <img src={hotel.thumbnail} alt={hotel.name} loading="lazy" />
        <span className="airport-code">{airportCode}</span>
        <button
          type="button"
          className="fav-toggle"
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove from saved hotels' : 'Save this hotel'}
          onClick={(event) => {
            event.preventDefault();
            toggleFavorite(hotel.id);
          }}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="hotel-body">
        <h3 className="hotel-name">{hotel.name}</h3>
        <span className="hotel-location">📍 {hotel.location}</span>
        <div className="stub-divider" />
        <div className="hotel-footer">
          <span className="hotel-price">
            {currency.format(hotel.price)}
            <span>/night</span>
          </span>
          <RatingStamp rating={hotel.rating} />
        </div>
      </div>
    </Link>
  );
}
