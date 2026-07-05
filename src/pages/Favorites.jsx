import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHotels } from '../hooks/useHotels.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import HotelGrid from '../components/HotelGrid.jsx';
import { LoadingState, ErrorState } from '../components/StateBlocks.jsx';

export default function Favorites() {
  const { hotels, status, error } = useHotels();
  const { favoriteIds } = useFavorites();

  const savedHotels = useMemo(
    () => hotels.filter((hotel) => favoriteIds.has(hotel.id)),
    [hotels, favoriteIds]
  );

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Your saved stays</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>
        Hotels you've tagged with ♥ live here, stored locally in your browser.
      </p>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState message={error?.message} />}

      {status === 'ready' && savedHotels.length === 0 && (
        <div className="state-block">
          <h3>No saved hotels yet</h3>
          <p>Tap the ♡ icon on any hotel card to keep it here.</p>
          <Link to="/" className="back-link" style={{ color: 'var(--teal-deep)', marginTop: 12 }}>
            ← Browse hotels
          </Link>
        </div>
      )}

      {status === 'ready' && savedHotels.length > 0 && <HotelGrid hotels={savedHotels} />}
    </div>
  );
}
