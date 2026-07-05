import { useEffect, useState } from 'react';
import { searchHotels } from '../api/hotelApi.js';

/**
 * Fetches a filtered, paginated hotel list from the Demo Hotels API.
 * Re-fetches whenever filters or page change.
 */
export function useHotelSearch(filters, page, pageSize, { fetchAll = false } = {}) {
  const [hotels, setHotels] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');

    const params = {
      search: filters.search,
      location: filters.location,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      sortBy: filters.sortBy,
    };

    if (!fetchAll) {
      params.limit = pageSize;
      params.skip = (page - 1) * pageSize;
    }

    searchHotels(params)
      .then((result) => {
        if (!isMounted) return;
        setHotels(result.hotels);
        setTotalCount(result.count);
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
  }, [
    filters.search,
    filters.location,
    filters.maxPrice,
    filters.minRating,
    filters.sortBy,
    page,
    pageSize,
    fetchAll,
  ]);

  return { hotels, totalCount, status, error };
}
