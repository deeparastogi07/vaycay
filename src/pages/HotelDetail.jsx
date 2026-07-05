import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchHotelById } from '../api/hotelApi.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed.js';
import RatingStamp from '../components/RatingStamp.jsx';
import ShareButton from '../components/ShareButton.jsx';
import ReviewsSection from '../components/ReviewsSection.jsx';
import { LoadingState, ErrorState } from '../components/StateBlocks.jsx';

function todayPlusDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function HotelDetail() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recordView } = useRecentlyViewed();
  const [hotel, setHotel] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [checkIn, setCheckIn] = useState(todayPlusDays(7));
  const [checkOut, setCheckOut] = useState(todayPlusDays(9));
  const [guests, setGuests] = useState(2);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');
    setHotel(null);

    fetchHotelById(hotelId)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setStatus('ready');
          return;
        }
        setHotel(data);
        setStatus('ready');
        recordView(data.id);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err);
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  const nights = useMemo(() => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  if (status === 'loading') return <LoadingState />;
  if (status === 'error') return <ErrorState message={error?.message} />;

  if (!hotel) {
    return (
      <div className="container">
        <div className="state-block">
          <h3>Hotel not found</h3>
          <p>It may have been removed, or the link is incorrect.</p>
          <Link to="/" className="back-link" style={{ color: 'var(--teal-deep)', marginTop: 12 }}>
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  const photos = hotel.photos.length > 0 ? hotel.photos : [hotel.thumbnail];
  const favorite = isFavorite(hotel.id);
  const sidePhotos = photos.slice(1, 3);
  const remainingCount = photos.length - 1 - sidePhotos.length;

  return (
    <>
      <div className="detail-header">
        <div className="container">
          <button
            type="button"
            className="back-link"
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Back to results
          </button>
          <div className="detail-title-row">
            <div>
              <h1>{hotel.name}</h1>
              <p className="detail-location">📍 {hotel.location}</p>
            </div>
            <RatingStamp rating={hotel.rating} />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="detail-gallery">
          <div className="gallery-main">
            <img src={photos[activePhoto]} alt={`${hotel.name} view ${activePhoto + 1}`} />
          </div>
          <div className="gallery-sub">
            {sidePhotos.map((photo, index) => {
              const photoIndex = index + 1;
              const isLastTile = index === sidePhotos.length - 1 && remainingCount > 0;
              return (
                <button
                  key={photo}
                  type="button"
                  onClick={() => setActivePhoto(photoIndex)}
                  aria-label={`Show photo ${photoIndex + 1}`}
                >
                  <img src={photo} alt={`${hotel.name} thumbnail ${photoIndex + 1}`} />
                  {isLastTile && <span className="gallery-more-overlay">+{remainingCount} more</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h2>About this stay</h2>
            <p className="detail-description">{hotel.description}</p>

            {photos.length > 3 && (
              <div style={{ marginTop: 24 }}>
                <h2 style={{ marginBottom: 12 }}>Photo gallery</h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                    gap: 10,
                  }}
                >
                  {photos.map((photo, index) => (
                    <button
                      key={photo}
                      type="button"
                      onClick={() => setActivePhoto(index)}
                      style={{
                        padding: 0,
                        border: index === activePhoto ? '2px solid var(--marigold-deep)' : '2px solid transparent',
                        borderRadius: 12,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        aspectRatio: '1 / 1',
                      }}
                    >
                      <img
                        src={photo}
                        alt={`${hotel.name} thumbnail ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="booking-card">
            <div className="booking-price">
              {currency.format(hotel.price)}
              <span> / night</span>
            </div>

            {booked ? (
              <div className="booking-confirmation">
                <div className="check">✓</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>Reservation confirmed</h3>
                <p className="detail-description" style={{ marginBottom: 12 }}>
                  {nights} night{nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''} · {checkIn} to {checkOut}
                </p>
                <button type="button" className="booking-fav" onClick={() => setBooked(false)}>
                  Book another stay
                </button>
              </div>
            ) : (
              <>
                <div className="booking-form-row">
                  <div className="booking-form-field">
                    <label htmlFor="checkIn">Check-in</label>
                    <input
                      id="checkIn"
                      type="date"
                      value={checkIn}
                      min={todayPlusDays(0)}
                      onChange={(event) => setCheckIn(event.target.value)}
                    />
                  </div>
                  <div className="booking-form-field">
                    <label htmlFor="checkOut">Check-out</label>
                    <input
                      id="checkOut"
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(event) => setCheckOut(event.target.value)}
                    />
                  </div>
                </div>

                <div className="booking-form-field">
                  <label>Guests</label>
                  <div className="guest-stepper">
                    <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests">
                      −
                    </button>
                    <span>{guests} guest{guests > 1 ? 's' : ''}</span>
                    <button type="button" onClick={() => setGuests((g) => Math.min(8, g + 1))} aria-label="More guests">
                      +
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--line)', marginTop: 10, paddingTop: 10 }}>
                  <div className="booking-summary-line">
                    <span>{currency.format(hotel.price)} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>{currency.format(hotel.price * nights)}</span>
                  </div>
                  <div className="booking-summary-line" style={{ fontWeight: 700, color: 'var(--ink)' }}>
                    <span>Total</span>
                    <span>{currency.format(hotel.price * nights)}</span>
                  </div>
                </div>

                <button type="button" className="booking-cta" onClick={() => setBooked(true)}>
                  Reserve this room
                </button>
              </>
            )}

            <button type="button" className="booking-fav" onClick={() => toggleFavorite(hotel.id)}>
              {favorite ? '♥ Saved to favorites' : '♡ Save for later'}
            </button>
            <div style={{ marginTop: 10 }}>
              <ShareButton title={hotel.name} url={`${window.location.origin}/hotels/${hotel.id}`} />
            </div>
          </aside>
        </div>

        <ReviewsSection hotelId={hotel.id} />
      </div>
    </>
  );
}
