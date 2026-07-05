import { useEffect, useState } from 'react';
import { fetchAllHotels } from '../api/hotelApi.js';

/**
 * Loads the full hotel catalog once (for favorites, map view, price bounds).
 */
export function useHotels() {
  const [hotels, setHotels] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchAllHotels()
      .then((data) => {
        if (!isMounted) return;
        setHotels(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err);
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { hotels, status, error };
}
